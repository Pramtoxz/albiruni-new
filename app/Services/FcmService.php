<?php

namespace App\Services;

use App\Models\DeviceToken;
use Kreait\Firebase\Factory;
use Kreait\Firebase\Messaging\CloudMessage;
use Kreait\Firebase\Messaging\Notification;
use Illuminate\Support\Facades\Log;

class FcmService
{
    protected $messaging;

    public function __construct()
    {
        try {
            $factory = (new Factory)->withServiceAccount(config('firebase.credentials'));
            $this->messaging = $factory->createMessaging();
        } catch (\Exception $e) {
            Log::error('Failed to initialize Firebase', [
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Send notification to specific user
     */
    public function sendToUser(int $userId, string $title, string $body, string $url, array $extraData = []): void
    {
        $tokens = DeviceToken::where('user_id', $userId)
            ->where('is_active', true)
            ->pluck('fcm_token')
            ->toArray();

        if (empty($tokens)) {
            Log::info("No active FCM tokens for user {$userId}");

            return;
        }

        $data = array_merge([
            'url' => $url,
            'click_action' => 'FLUTTER_NOTIFICATION_CLICK',
        ], $extraData);

        $notification = Notification::create($title, $body);

        foreach ($tokens as $token) {
            $this->sendToToken($token, $notification, $data, $userId);
        }
    }

    /**
     * Send notification to multiple users
     */
    public function sendToUsers(array $userIds, string $title, string $body, string $url, array $extraData = []): void
    {
        foreach ($userIds as $userId) {
            $this->sendToUser($userId, $title, $body, $url, $extraData);
        }
    }

    /**
     * Send notification to specific token
     */
    protected function sendToToken(string $token, Notification $notification, array $data, ?int $userId = null): void
    {
        try {
            $message = CloudMessage::withTarget('token', $token)
                ->withNotification($notification)
                ->withData($data);

            $this->messaging->send($message);

            Log::info('FCM notification sent', [
                'token' => substr($token, 0, 20).'...',
                'user_id' => $userId,
                'title' => $notification->title(),
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to send FCM notification', [
                'token' => substr($token, 0, 20).'...',
                'user_id' => $userId,
                'error' => $e->getMessage(),
            ]);

            // Mark token as inactive if it's invalid
            if ($this->isInvalidTokenError($e->getMessage())) {
                DeviceToken::where('fcm_token', $token)->update(['is_active' => false]);
                Log::info('Marked FCM token as inactive', ['token' => substr($token, 0, 20).'...']);
            }
        }
    }

    /**
     * Check if error indicates invalid token
     */
    protected function isInvalidTokenError(string $errorMessage): bool
    {
        $invalidTokenErrors = [
            'not-found',
            'invalid-registration-token',
            'registration-token-not-registered',
            'invalid-argument',
        ];

        foreach ($invalidTokenErrors as $error) {
            if (str_contains(strtolower($errorMessage), $error)) {
                return true;
            }
        }

        return false;
    }
}
