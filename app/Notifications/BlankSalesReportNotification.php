<?php

namespace App\Notifications;

use App\Channels\FcmChannel;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;

class BlankSalesReportNotification extends Notification implements ShouldQueue {
    use Queueable;

    protected $grower;
    protected $quarter;
    protected $aboutQuarters;
    protected $link;
    protected $year;

    public function __construct( $grower, $quarter, $aboutQuarters, $link, $year ) {
        $this->grower = $grower;
        $this->quarter = $quarter;
        $this->aboutQuarters = $aboutQuarters;
        $this->link = $link;
        $this->year = $year;

        Log::info( 'BlankSalesReportNotification constructed', [
            'grower' => $this->grower,
            'quarter' => $this->quarter,
            'aboutQuarters' => $this->aboutQuarters,
            'link' => $this->link,
            'year' => $this->year,
        ] );
    }

    public function via( object $notifiable ): array {
        Log::info( 'BlankSalesReportNotification via', ['notifiable' => $notifiable] );
        return ['mail', 'database', 'broadcast', FcmChannel::class];
    }

    public function toMail( object $notifiable ): MailMessage {
        Log::info( 'BlankSalesReportNotification toMail', ['notifiable' => $notifiable] );
        $growerName = $this->grower->grower->contact_person ?? $this->grower->company_name;
        return ( new MailMessage )
            ->subject( 'New sales report is available and requires your input' )
            ->view( 'emails.blank-sales-report', [
                'growerName' => $growerName,
                'quarter' => $this->quarter,
                'aboutQuarters' => $this->aboutQuarters,
                'link' => $this->link,
                'year' => $this->year,
            ] );
    }

    public function toDatabase( object $notifiable ): array {
        Log::info( 'BlankSalesReportNotification toDatabase', ['notifiable' => $notifiable] );
        return [
            'message' => "A New sales report for quarter {$this->quarter} ({$this->year}) has been generated. Check details at <a href='{$this->link}'>Sales Reports</a>.",
        ];
    }

    public function toArray( object $notifiable ): array {
        Log::info( 'BlankSalesReportNotification toArray', ['notifiable' => $notifiable] );
        return [
            'message' => "A New sales report for quarter {$this->quarter} ({$this->year}) has been generated. Check details at <a href='{$this->link}'>Sales Reports</a>.",
        ];
    }

    public function toBroadcast( object $notifiable ): BroadcastMessage {
        Log::info( 'BlankSalesReportNotification toBroadcast', ['notifiable' => $notifiable] );
        return new BroadcastMessage( [
            'data' => $this->toArray( $notifiable ),
            'type' => 'blank-sales-report',
        ] );
    }
    // Todo: Fcm not working
    public function toFcm( object $notifiable ) {
        Log::info( 'BlankSalesReportNotification toFcm', ['notifiable' => $notifiable] );
        return [
            'fcm_token' => $this->grower->fcm_token,
            'notification' => [
                'title' => "Breederplants Notification",
                'body' => "You missed the sample date for  Please check your report and take action as soon as possible.",
            ],
            'data' => [
                'variety_name' => "variety_name",
                'sample_date' => "12/12/2021",
                'url' => "https://breederplants.com",
            ],
        ];
    }

}
