<?php
namespace App\Notifications;

use App\Channels\FcmChannel;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;

class SalesReportOverdueNotification extends Notification implements ShouldQueue {
    use Queueable;

    protected $quarter;
    protected $aboutQuarters;
    protected $link;
    protected $createdDate;

    public function __construct( $quarter, $aboutQuarters, $link, $createdDate ) {
        $this->quarter = $quarter;
        $this->aboutQuarters = $aboutQuarters;
        $this->link = $link;
        $this->createdDate = $createdDate;

        Log::info( 'SalesReportOverdueNotification constructed', [
            'quarter' => $this->quarter,
            'aboutQuarters' => $this->aboutQuarters,
            'link' => $this->link,
            'createdDate' => $this->createdDate,
        ] );
    }

    public function via( $notifiable ) {
        Log::info( 'SalesReportOverdueNotification via', ['notifiable' => $notifiable] );
        return ['mail', 'database', 'broadcast', FcmChannel::class];
    }

    public function toMail( $notifiable ) {
        Log::info( 'SalesReportOverdueNotification toMail', ['notifiable' => $notifiable] );
        $quarterUc = ucfirst( $this->quarter );
        return ( new MailMessage )
            ->subject( "Sales Report [{$quarterUc}] overdue" )
            ->view( 'emails.overdue-sales-report', [
                'quarter' => $quarterUc,
                'aboutQuarters' => $this->aboutQuarters,
                'link' => $this->link,
                'createdDate' => $this->createdDate,
                'contactPerson' => $notifiable->contact_person,
            ] );
    }

    public function toDatabase( object $notifiable ): array {
        Log::info( 'BlankSalesReportNotification toDatabase', ['notifiable' => $notifiable] );
        return [
            'message' => "Your sales report for " . ucfirst( $this->quarter ) . " is overdue.",
        ];
    }

    public function toArray( object $notifiable ): array {
        return [
            'message' => "Your sales report for " . ucfirst( $this->quarter ) . " is overdue.",
        ];
    }

    public function toBroadcast( $notifiable ) {
        Log::info( 'SalesReportOverdueNotification toBroadcast', ['notifiable' => $notifiable] );
        return new BroadcastMessage( [
            'data' => $this->toArray( $notifiable ),
            'type' => 'sales-report-overdue',
        ] );
    }

    public function toFcm( $notifiable ) {
        Log::info( 'SalesReportOverdueNotification toFcm', ['notifiable' => $notifiable] );
        return [
            'fcm_token' => $notifiable->fcm_token,
            'notification' => [
                'title' => "Submit Sales Report for " . ucfirst( $this->quarter ),
                'body' => "Please submit your sales report for " . ucfirst( $this->quarter ) . ".",
            ],
            'data' => [
                'quarter' => $this->quarter,
                'link' => $this->link,
            ],
        ];
    }
}