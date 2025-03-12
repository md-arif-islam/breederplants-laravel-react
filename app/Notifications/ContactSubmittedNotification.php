<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ContactSubmittedNotification extends Notification {
    use Queueable;

    protected $data;

    public function __construct( array $data ) {
        $this->data = $data;
    }

    public function via( $notifiable ) {
        return ['mail'];
    }

    public function toMail( $notifiable ): MailMessage {
        return ( new MailMessage )
            ->subject( 'New Contact Submission' )
            ->view( 'emails.custom-contact', ['data' => $this->data] );
    }
}
