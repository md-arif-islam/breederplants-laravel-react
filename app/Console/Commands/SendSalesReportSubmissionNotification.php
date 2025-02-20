<?php

namespace App\Console\Commands;

use App\Models\Grower;
use App\Models\SalesReport;
use App\Models\User;
use App\Notifications\SalesReportOverdueNotification;
use Carbon\Carbon;
use Exception;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;

class SendSalesReportSubmissionNotification extends Command {

    protected $signature = 'notify:sales-report-submission';
    protected $description = 'Send notifications for overdue sales report submission';

    public function handle() {
        $notSubmittedReports = SalesReport::whereNull( 'submission_date' )->get();

        foreach ( $notSubmittedReports as $saleReport ) {
            $grower = Grower::find( $saleReport->grower_id );
            if ( !$grower ) {
                Log::warning( "Grower not found for sales report ID: {$saleReport->id}" );
                continue;
            }
            $quarter = $saleReport->quarter;
            $year = $saleReport->year;
            $aboutQuarters = $saleReport->about_quarter;
            $createdDate = $saleReport->created_at->toDateString();

            $createdPlusOneMonth = Carbon::parse( $createdDate )->addMonth()->toDateString();
            $currentDate = Carbon::now()->toDateString();
            Log::info( "Checking sales report", [
                'sales_report_id' => $saleReport->id,
                'created_plus_one_month' => $createdPlusOneMonth,
                'current_date' => $currentDate,
            ] );

            // todo if ( "2025-03-20" == $createdPlusOneMonth ) {
            if ( "2025-03-20" == $createdPlusOneMonth ) {
                $link = env( 'FRONTEND_URL' ) . "/sales-reports";
                try {
                    // Send notification to grower via their user account
                    $grower = Grower::find( $saleReport->grower_id );
                    $grower = Grower::find( $grower->id );
                    $user = User::find( $grower->user_id );

                    if ( !$user ) {
                        Log::error( "User not found for grower ID: {$grower->id}" );
                        continue;
                    }

                    Notification::send( $user, new SalesReportOverdueNotification( $quarter, $aboutQuarters, $link, $createdDate ) );
                    Log::info( "Overdue notification sent to user (ID: {$user->id}) for grower (ID: {$grower->id}) for quarter: " . ucfirst( $quarter ) );
                } catch ( Exception $e ) {
                    Log::error( "Failed to send overdue notification for grower (ID: {$grower->id}) for quarter: " . ucfirst( $quarter ) . ". Error: " . $e->getMessage() );
                }
            }
        }
    }
}