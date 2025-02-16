<?php

use Google\Client as GoogleClient;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;

Route::get( '/', function () {
    return view( 'welcome' );
} );

Route::get( '/test-fcm-alternative', function () {
    $grower = (object) [
        'fcm_token' => "dbHJ4Kx4SC-30WVXCjvfzd:APA91bF0dgIe2gNPJ2-4yXStabwE3tmNdeQL9WFMzCt19jFT5uF7r5OXDvBn4ZE45gSLOyiXo500L_sv0OLTROnh_2JoJBLUHM1zQiJ-lm7gxX3W8ZWu6Tw",
        'email' => 'test@example.com',
        'grower' => (object) [
            'contact_person' => 'Test User',
        ],
    ];
    $variety_name = "Demo Variety";
    $formatted_date = "2024-01-01";
    $varietyReportUrl = "https://example.com/report";

    $credentialsPath = storage_path( 'app/breederplants-firebase.json' ); // Path to your service account file

    $client = new \GuzzleHttp\Client();
    $getAccessToken = function () {
        $credentialsPath = storage_path( 'app/breederplants-firebase.json' ); // Path to your service account file

        $client = new GoogleClient();
        $client->setAuthConfig( $credentialsPath );
        $client->addScope( 'https://www.googleapis.com/auth/firebase.messaging' );

        $token = $client->fetchAccessTokenWithAssertion();

        return $token['access_token'];
    };

    if ( isset( $grower->fcm_token ) && $grower->fcm_token != null ) {
        try {
            $response = $client->post( 'https://fcm.googleapis.com/v1/projects/breederplants/messages:send', [
                'headers' => [
                    'Authorization' => 'Bearer ' . $getAccessToken(), 'Content-Type' => 'application/json',
                ], 'json' => [
                    'message' => [
                        'token' => $grower->fcm_token,
                        'notification' => [
                            'title' => "Breederplants Notification",
                            'body' => "You missed the sample date for {$variety_name} on {$formatted_date}. Please check your report and take action as soon as possible.",
                            // 'badge' => $unreadNotificationCount,

                        ], 'data' => [
                            'variety_name' => $variety_name,
                            'sample_date' => $formatted_date,
                            'url' => $varietyReportUrl,
                            // 'badgeCount' => $unreadNotificationCount,
                        ],
                    ],
                ],
            ] );
            Log::info( "FCM response: " . $response->getBody() );

            return "FCM response: " . $response->getBody();
        } catch ( \Throwable $th ) {
            Log::info( "Error sending FCM notification: " . $th->getMessage() );

            return "Error sending FCM notification: " . $th->getMessage();
        }
    }

    return 'No FCM token found for grower.';
} );