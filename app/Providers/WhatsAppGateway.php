<?php


namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class WhatsAppGateway extends ServiceProvider
{
    protected $baseUrl;
    protected $token;
    protected $session;

    public function __construct()
    {
        $this->baseUrl = rtrim(env('WA_GATEWAY_URL'), '/');
        $this->token   = env('WA_GATEWAY_SECRET');
        $this->session = env('WA_SESSION_NAME');

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

        if (!empty($decoded['success']) || isset($decoded['message'])) {
            return; // asumsi sukses; jika gateway kirim flag lain, sesuaikan
        }

        // fallback: anggap gagal bila struktur tidak sesuai
        throw new \RuntimeException('Gateway tidak mengembalikan status sukses: '.$body);
    }
}
