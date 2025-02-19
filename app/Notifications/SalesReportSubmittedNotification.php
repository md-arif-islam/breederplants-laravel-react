<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Str;

class SalesReportSubmittedNotification extends Notification {
    use Queueable;

    protected $salesReport;
    protected $grower;
    protected $excelFile;
    protected $recipientType; // 'admin' or 'grower'

    public function __construct( $salesReport, $grower, $excelFile, $recipientType ) {
        $this->salesReport = $salesReport;
        $this->grower = $grower;
        $this->excelFile = $excelFile;
        $this->recipientType = $recipientType;
    }

    public function via( $notifiable ) {
        return ['mail'];
    }

    public function toMail( $notifiable ): MailMessage {
        if ( $this->recipientType === 'admin' ) {
            $subject = "New Sales Report Submission: " . $this->grower->company_name . " (" . ucwords( $this->salesReport->quarter ) . " " . $this->salesReport->year . ")";
            $greeting = "Dear Admin,";
            $messageLine = "A new sales report has been submitted by " . $this->grower->company_name . ".";
            $notificationTitle = "New Sales Report Submission";
        } else {
            $subject = "Sales Report Submission: " . ucwords( $this->salesReport->quarter ) . " " . $this->salesReport->year;
            $greeting = "Dear " . $this->grower->company_name . ",";
            $messageLine = "Your sales report has been submitted successfully.";
            $notificationTitle = "Sales Report Submission";
        }
        $quarter = ucwords( $this->salesReport->quarter );
        $year = $this->salesReport->year;
        $submissionDate = $this->salesReport->submission_date->format( "d-m-Y" );

        $data = [
            'notificationTitle' => $notificationTitle,
            'greeting' => $greeting,
            'messageLine' => $messageLine,
            'quarter' => $quarter,
            'year' => $year,
            'submissionDate' => $submissionDate,
            'growerName' => ( $this->recipientType === 'admin' ) ? 'Admin' : $this->grower->company_name,
        ];

        return ( new MailMessage )
            ->subject( $subject )
            ->view( 'emails.sales-report-sub mitted', $data )
            ->attachData(
                $this->excelFile,
                "Breederplants-" . Str::slug( $this->grower->company_name ) . "-" . $this->salesReport->quarter . "-" . $this->salesReport->year . ".xlsx", [
                    'mime' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                ]
            );
    }
}