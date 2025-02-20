<?php

use App\Console\Commands\GenerateBlankSalesReports;
use App\Console\Commands\SendSampleDateNotifications;
use Illuminate\Support\Facades\Artisan;

Artisan::command( 'sales-reports:generate', function () {
    $this->comment( 'Generating blank sales reports...' );
    app( GenerateBlankSalesReports::class )->handle();
} )->purpose( 'Generate blank sales report entries for all growers based on their reporting quarters' );

Artisan::command( 'notify:sample-dates', function () {
    $this->comment( 'Sending sample date notifications...' );
    app( SendSampleDateNotifications::class )->handle();
} )->purpose( 'Send notifications for upcoming sample dates' );

Artisan::command( 'notify:sales-report-submission', function () {
    $this->comment( 'Sending sales report submission notifications...' );
    app( SendSalesReportSubmissionNotificationification::class )->handle();
} )->purpose( 'Send notifications for overdue sales report submission' );
