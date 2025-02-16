<?php

namespace App\Channels;

use GuzzleHttp\Client;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;

class FcmChannel {
    protected $projectId;

    public function __construct() {
        // You can set this via config or .env, here we're hard-coding for demo purposes.
        $this->projectId = 'breederplants'; // Replace with your actual project ID if different.
    }

    /**
     * Send the given notification.
     *
     * @param  mixed  $notifiable
     * @param  \Illuminate\Notifications\Notification  $notification
     * @return void
     */
    public function send( $notifiable, Notification $notification ) {
        if ( !method_exists( $notification, 'toFcm' ) ) {
            return;
        }

        $message = $notification->toFcm( $notifiable );
        // Use notifiable's token if available; otherwise use the token from the message.
        $fcmToken = $notifiable->fcm_token ?? ( $message['fcm_token'] ?? null );
        if ( !$fcmToken ) {
            Log::info( 'No FCM token found for notifiable.' );
            return;
        }

        $client = new Client();

        try {
            $response = $client->post(
                'https://fcm.googleapis.com/v1/projects/' . $this->projectId . '/messages:send',
                [
                    'headers' => [
                        'Authorization' => 'Bearer ' . $this->getAccessToken(),
                        'Content-Type' => 'application/json',
                    ],
                    'json' => [
                        'message' => [
                            'token' => $fcmToken,
                            'notification' => [
                                'title' => $message['notification']['title'],
                                'body' => $message['notification']['body'],
                            ],
                            'data' => $message['data'] ?? [],
                        ],
                    ],
                ]
            );

            Log::info( "FCM response: " . $response->getBody()->getContents() );
        } catch ( \Throwable $th ) {
            Log::error( "Error sending FCM notification: " . $th->getMessage() );
        }
    }

    /**
     * Retrieve the access token for FCM.
     *
     * @return string
     */
    private function getAccessToken() {
        $credentialsPath = storage_path( 'app/breederplants-firebase.json' );

        $client = new \Google\Client();
        $client->setAuthConfig( $credentialsPath );
        $client->addScope( 'https://www.googleapis.com/auth/firebase.messaging' );

        $token = $client->fetchAccessTokenWithAssertion();

        return $token['access_token'] ?? '';
    }
}
