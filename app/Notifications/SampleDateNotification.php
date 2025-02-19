<?php

namespace App\Notifications;

use App\Channels\FcmChannel;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;

class SampleDateNotification extends Notification implements ShouldQueue {
    use Queueable;

    protected $varietyReport;
    protected $grower;
    protected $formattedDate;
    protected $varietyReportUrl;

    /**
     * Create a new notification instance.
     *
     * @param $varietyReport
     * @param $grower
     * @param $formattedDate
     * @param $varietyReportUrl
     */
    public function __construct( $varietyReport, $grower, $formattedDate, $varietyReportUrl ) {
        $this->varietyReport = $varietyReport;
        $this->grower = $grower;
        $this->formattedDate = $formattedDate;
        $this->varietyReportUrl = $varietyReportUrl;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  object  $notifiable
     * @return array
     */
    public function via( object $notifiable ): array {
        return ['mail', 'database', 'broadcast', FcmChannel::class];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  object  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail( object $notifiable ): MailMessage {
        $growerName = $this->grower->grower->contact_person ?? $this->grower->company_name;

        return ( new MailMessage )
            ->subject( 'Sample Date Notification' )
            ->view( 'emails.sample-date', [
                'growerName' => $growerName,
                'variety_name' => $this->varietyReport->variety_name,
                'formatted_date' => $this->formattedDate,
                'url' => $this->varietyReportUrl,
            ] );
    }

    /**
     * Get the array representation of the notification. For database storage.
     *
     * @param  object  $notifiable
     * @return array
     */
    public function toDatabase( object $notifiable ): array {
        return [
            'message' => 'Your next sample date for ' . $this->varietyReport->variety_name . ' on ' . $this->formattedDate . '. Please check your report for <a href="' . $this->varietyReportUrl . '">' . $this->varietyReport->variety_name . '</a> and take action as soon as possible.',
        ];
    }

    /**
     * Get the array representation of the notification. For in-app (React) usage.
     *
     * @param  object  $notifiable
     * @return array
     */
    public function toArray( object $notifiable ): array {
        return [
            'message' => 'Your next sample date for ' . $this->varietyReport->variety_name . ' on ' . $this->formattedDate . '. Please check your report for <a href="' . $this->varietyReportUrl . '">' . $this->varietyReport->variety_name . '</a> and take action as soon as possible.',
        ];
    }

    /**
     * Get the broadcastable representation of the notification. For real-time updates.
     *
     * @param  object  $notifiable
     * @return BroadcastMessage
     */
    public function toBroadcast( object $notifiable ): BroadcastMessage {
        return new BroadcastMessage( [
            'data' => $this->toArray( $notifiable ),
            'type' => 'sample-date',
        ] );
    }

    /**
     * Get the Firebase Cloud Messaging representation of the notification.
     *
     * @param  object  $notifiable
     * @return array
     */
    public function toFcm( object $notifiable ) {
        $variety_name = $this->varietyReport->variety_name;
        $formatted_date = $this->formattedDate;
        $varietyReportUrl = $this->varietyReportUrl;

        Log::info( $this->grower );

        return [
            'fcm_token' => $this->grower->fcm_token,
            'notification' => [
                'title' => "Upcoming Sample Date for {$variety_name}",
                'body' => "Your next sample date is on {$formatted_date}. Please check the report.",
            ],
            'data' => [
                'variety_name' => $variety_name,
                'sample_date' => $formatted_date,
                'url' => $varietyReportUrl,
            ],
        ];
    }
}