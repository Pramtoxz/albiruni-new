<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Firebase Credentials
    |--------------------------------------------------------------------------
    |
    | Path to the Firebase service account JSON file.
    | This file contains the credentials needed to authenticate with Firebase.
    |
    */
    'credentials' => env(
        'FIREBASE_CREDENTIALS',
        app_path('Providers/albiruni-pre-school-firebase-adminsdk-fbsvc-9724349ba8.json')
    ),

    /*
    |--------------------------------------------------------------------------
    | Firebase Project ID
    |--------------------------------------------------------------------------
    |
    | Your Firebase project ID from the Firebase console.
    |
    */
    'project_id' => env('FIREBASE_PROJECT_ID', 'albiruni-pre-school'),
];
