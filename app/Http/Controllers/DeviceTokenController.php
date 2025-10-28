<?php

namespace App\Http\Controllers;

use App\Models\DeviceToken;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class DeviceTokenController extends Controller
{
    /**
     * Register or update FCM token for authenticated user
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'fcm_token' => 'required|string',
            'device_type' => 'nullable|string',
            'device_name' => 'nullable|string',
        ]);

        try {
            DeviceToken::updateOrCreate(
                [
                    'user_id' => auth()->id(),
                    'fcm_token' => $validated['fcm_token'],
                ],
                [
                    'device_type' => $validated['device_type'] ?? 'android',
                    'device_name' => $validated['device_name'] ?? null,
                    'is_active' => true,
                    'last_used_at' => now(),
                ]
            );

            Log::info('FCM token registered', [
                'user_id' => auth()->id(),
                'device_type' => $validated['device_type'] ?? 'android',
            ]);

            return response()->json([
                'success' => true,
                'message' => 'FCM token registered successfully',
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to register FCM token', [
                'user_id' => auth()->id(),
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to register FCM token',
            ], 500);
        }
    }

    /**
     * Deactivate FCM token (on logout)
     */
    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'fcm_token' => 'required|string',
        ]);

        try {
            DeviceToken::where('user_id', auth()->id())
                ->where('fcm_token', $validated['fcm_token'])
                ->update(['is_active' => false]);

            Log::info('FCM token deactivated', [
                'user_id' => auth()->id(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'FCM token deactivated successfully',
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to deactivate FCM token', [
                'user_id' => auth()->id(),
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to deactivate FCM token',
            ], 500);
        }
    }
}
