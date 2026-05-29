<?php


namespace App\Providers;

use App\Models\ConfigWa;
use App\Models\ConfigWaGroup;

class WhatsAppGateway
{
    private const SUCCESS_STATUSES = [
        'PENDING',
        'QUEUED',
        'SENT',
        'DELIVERED',
        'DELIVERED_TO_DEVICE',
        'DELIVERED_TO_GATEWAY',
        'SUCCESS',
    ];

    protected $baseUrl;
    protected $token;
    protected $session;

    public function __construct()
    {
        $config = ConfigWa::current();

        $this->baseUrl = rtrim($config?->wa_gateway_url ?? env('WA_GATEWAY_URL', ''), '/');
        $this->token   = $config?->wa_gateway_secret ?? env('WA_GATEWAY_SECRET', '');
        $this->session = $config?->wa_session_name   ?? env('WA_SESSION_NAME', '');

        if (!$this->baseUrl || !$this->token || !$this->session) {
            throw new \RuntimeException('Konfigurasi WhatsApp gateway belum lengkap.');
        }
    }

    // Backward compat — dipanggil oleh NotificationService & OtpService
    public function sendText(string $to, string $message): void
    {
        $this->sendToPhone($to, $message);
    }

    public function sendToPhone(string $to, string $message): void
    {
        $this->sendRequest('/message/send-text', [
            'session'  => $this->session,
            'to'       => preg_replace('/\D+/', '', $to),
            'text'     => $message,
            'is_group' => false,
        ]);
    }

    /**
     * Kirim pesan ke grup WA.
     *
     * @param string      $message
     * @param string|null $groupIdOrKeterangan  group_id langsung (xxx@g.us) atau keterangan grup
     */
    public function sendToGroup(string $message, ?string $groupIdOrKeterangan = null): void
    {
        if ($groupIdOrKeterangan) {
            if (str_contains($groupIdOrKeterangan, '@g.us') || ctype_digit($groupIdOrKeterangan)) {
                $target = $groupIdOrKeterangan;
            } else {
                $group = ConfigWaGroup::findByKeterangan($groupIdOrKeterangan);
                if (!$group) {
                    throw new \RuntimeException("Grup WA dengan keterangan '{$groupIdOrKeterangan}' tidak ditemukan.");
                }
                $target = $group->group_id;
            }
        } else {
            $group = ConfigWaGroup::where('is_active', true)->first();
            if (!$group) {
                throw new \RuntimeException('Tidak ada grup WA aktif yang tersimpan.');
            }
            $target = $group->group_id;
        }

        if (!str_contains($target, '@g.us')) {
            $target .= '@g.us';
        }

        $this->sendRequest('/message/send-text', [
            'session'  => $this->session,
            'to'       => $target,
            'text'     => $message,
            'is_group' => true,
        ]);
    }

    public function getGroups(): array
    {
        $url = "{$this->baseUrl}/session/groups?session={$this->session}";

        $ch = curl_init($url);

        curl_setopt_array($ch, [
            CURLOPT_HTTPHEADER     => [
                "Authorization: Bearer {$this->token}",
                'Accept: application/json',
            ],
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT        => 15,
            CURLOPT_CONNECTTIMEOUT => 5,
            CURLOPT_SSL_VERIFYPEER => true,
        ]);

        $body   = curl_exec($ch);
        $errno  = curl_errno($ch);
        $error  = curl_error($ch);
        $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);

        curl_close($ch);

        if ($errno !== 0) {
            throw new \RuntimeException("WhatsApp Gateway tidak bisa dihubungi: {$error}");
        }

        if ($status >= 400) {
            throw new \RuntimeException("WhatsApp Gateway error ({$status}): {$body}");
        }

        $decoded = json_decode($body, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new \RuntimeException("Respons gateway tidak valid: {$body}");
        }

        return $decoded['data'] ?? $decoded ?? [];
    }

    private function sendRequest(string $endpoint, array $payload): void
    {
        $url = $this->baseUrl.$endpoint;

        $ch = curl_init($url);

        curl_setopt_array($ch, [
            CURLOPT_HTTPHEADER     => [
                'Authorization: Bearer '.$this->token,
                'Content-Type: application/json',
                'Accept: application/json',
            ],
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => json_encode($payload),
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT        => 15,
            CURLOPT_CONNECTTIMEOUT => 5,
            CURLOPT_SSL_VERIFYPEER => true,
        ]);

        $body   = curl_exec($ch);
        $errno  = curl_errno($ch);
        $error  = curl_error($ch);
        $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);

        curl_close($ch);

        if ($errno !== 0) {
            throw new \RuntimeException('WhatsApp Gateway tidak bisa dihubungi: '.$error);
        }

        if ($status >= 400) {
            throw new \RuntimeException("WhatsApp Gateway error ({$status}): ".$body);
        }

        $decoded = json_decode($body, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new \RuntimeException('Respons gateway tidak valid: '.$body);
        }

        if ($this->responseIndicatesSuccess($decoded)) {
            return;
        }

        throw new \RuntimeException('Gateway tidak mengembalikan status sukses: '.$body);
    }

    /**
     * @param  array<string, mixed>  $response
     */
    protected function responseIndicatesSuccess(array $response): bool
    {
        $successFlag = $this->normalizeBoolean($response['success'] ?? null);

        if ($successFlag === true) {
            return true;
        }

        $status = $this->extractStatus($response);

        if ($status !== null) {
            if (is_numeric($status)) {
                $numericStatus = (int) $status;

                if ($numericStatus >= 200 && $numericStatus < 400) {
                    return true;
                }
            }

            if (in_array(strtoupper((string) $status), self::SUCCESS_STATUSES, true)) {
                return true;
            }
        }

        if (
            isset($response['message'])
            && ! isset($response['error'])
            && ! isset($response['errors'])
        ) {
            return true;
        }

        return false;
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    protected function extractStatus(array $payload): ?string
    {
        if (array_key_exists('status', $payload)) {
            $status = $payload['status'];

            if (is_string($status) || is_numeric($status)) {
                return (string) $status;
            }
        }

        foreach ($payload as $value) {
            if (is_array($value)) {
                $nestedStatus = $this->extractStatus($value);

                if ($nestedStatus !== null) {
                    return $nestedStatus;
                }
            }
        }

        return null;
    }

    protected function normalizeBoolean(mixed $value): ?bool
    {
        if (is_bool($value)) {
            return $value;
        }

        if (is_string($value)) {
            $normalized = strtolower($value);

            if (in_array($normalized, ['true', '1', 'yes'], true)) {
                return true;
            }

            if (in_array($normalized, ['false', '0', 'no'], true)) {
                return false;
            }
        }

        if (is_int($value)) {
            if ($value === 1) {
                return true;
            }

            if ($value === 0) {
                return false;
            }
        }

        return null;
    }
}
