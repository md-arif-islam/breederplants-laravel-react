<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Str;

class ProductionReportSubmittedNotification extends Notification {
    use Queueable;

    protected $productionReport;
    protected $grower;
    protected $excelFile;
    protected $recipientType; // 'admin' or 'grower'

    public function __construct( $productionReport, $grower, $excelFile, $recipientType ) {
        $this->productionReport = $productionReport;
        $this->grower = $grower;
        $this->excelFile = $excelFile;
        $this->recipientType = $recipientType;
    }

    public function via( $notifiable ) {
        return ['mail'];
    }

    public function toMail( $notifiable ): MailMessage {
        if ( $this->recipientType === 'admin' ) {
            $subject = "New Production Report Submission: " . $this->grower->company_name . " (" . ucwords( $this->productionReport->quarter ) . " " . $this->productionReport->year . ")";
            $greeting = "Dear Admin,";
            $messageLine = "A new production report has been submitted by " . $this->grower->company_name . ".";
            $notificationTitle = "New Production Report Submission";
        } else {
            $subject = "Production Report Submission: " . ucwords( $this->productionReport->quarter ) . " " . $this->productionReport->year;
            $greeting = "Dear " . $this->grower->company_name . ",";
            $messageLine = "Your production report has been submitted successfully.";
            $notificationTitle = "Production Report Submission";
        }
        $quarter = ucwords( $this->productionReport->quarter );
        $year = $this->productionReport->year;
        $submissionDate = $this->productionReport->submission_date->format( "d-m-Y" );

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
            ->view( 'emails.production-report-submitted', $data )
            ->attachData(
                $this->excelFile,
                "Breederplants-" . Str::slug( $this->grower->company_name ) . "-" . $this->productionReport->quarter . "-" . $this->productionReport->year . ".xlsx", [
                    'mime' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                ]
            );
    }
}