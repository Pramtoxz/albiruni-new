<?php


namespace App\Providers;

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
        $this->baseUrl = rtrim(config('services.whatsapp.gateway_url', env('WA_GATEWAY_URL')), '/');
        $this->token   = config('services.whatsapp.gateway_secret', env('WA_GATEWAY_SECRET'));
        $this->session = config('services.whatsapp.session_name', env('WA_SESSION_NAME'));

        if (!$this->baseUrl || !$this->token || !$this->session) {
            throw new \RuntimeException('Konfigurasi WhatsApp gateway belum lengkap.');
        }
    }

    public function sendText(string $to, string $message): void
    {
        $payload = [
            'session' => $this->session,
            'to'      => preg_replace('/\D+/', '', $to),
            'text'    => $message,
        ];

        $url = $this->baseUrl.'/message/send-text?'.http_build_query($payload);

        $ch = curl_init($url);

        curl_setopt_array($ch, [
            CURLOPT_HTTPHEADER     => [
                'Authorization: Bearer '.$this->token,
                'Accept: application/json',
            ],
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT        => 15,
            CURLOPT_CONNECTTIMEOUT => 5,
            CURLOPT_SSL_VERIFYPEER => true,   // ubah ke false sementara jika SSL gateway self-signed
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

        // fallback: anggap gagal bila struktur tidak sesuai
        throw new \RuntimeException('Gateway tidak mengembalikan status sukses: '.$body);
    }

    /**
     * Determine whether the decoded response indicates a successful send.
     *
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
     * Recursively search for a status value inside the payload.
     *
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
