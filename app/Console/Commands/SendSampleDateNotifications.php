<?php

namespace App\Console\Commands;

use App\Models\Grower;
use App\Models\User;
use App\Models\VarietyReport;
use App\Notifications\SampleDateNotification;
use Carbon\Carbon;
use Exception;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class SendSampleDateNotifications extends Command {
    protected $signature = 'notify:sample-dates';
    protected $description = 'Send notifications for upcoming sample dates';

    public function __construct() {
        parent::__construct();
    }

    public function handle() {
        Log::info( 'Starting to send sample date notifications.' );

        try {
            $today = Carbon::now()->format( 'Y-m-d' );
            Log::info( "Checking variety reports for sample date: $today" );

            $varietyReports = VarietyReport::with( 'grower' )->whereJsonContains( 'samples_schedule', $today )->get();

            Log::info( 'Variety reports retrieved: ' . $varietyReports->count() );

            foreach ( $varietyReports as $varietyReport ) {
                Log::info( 'Processing variety report ID: ' . $varietyReport->id );

                $next_sample_date = $today;

                $grower_id = $varietyReport->grower_id;
                $grower = Grower::findOrFail( $grower_id );
                $grower = User::find( $grower->user_id );

                Log::info( "Grower ID: $grower_id, Grower Email: {$grower->email}" );

                // Ensure grower and grower's email are valid
                if ( empty( $grower->email ) ) {
                    $this->error( "Grower (ID: $grower_id) does not have a valid email address." );
                    Log::warning( "Skipped grower (ID: $grower_id) due to missing email address." );
                    continue;
                }

                $formatted_date = Carbon::parse( $next_sample_date )->format( 'l, M d Y' );
                $variety_name = $varietyReport->variety_name;

                // Generate the URL for the variety report
                $varietyReportUrl = "https://google.com";

                try {
                    $grower->notify( new SampleDateNotification( $varietyReport, $grower, $formatted_date, $varietyReportUrl ) );
                    Log::info( "Notification sent to grower (ID: $grower_id) for variety: $variety_name" );
                } catch ( Exception $e ) {
                    Log::error( "Failed to send notification to grower (ID: $grower_id) for variety: $variety_name. Error: " . $e->getMessage() );
                }
            }

            $this->info( 'Sample date notifications sent successfully!' );
            Log::info( 'Sample date notifications process completed successfully.' );
        } catch ( Exception $e ) {
            Log::error( 'Failed to send sample date notifications: ' . $e->getMessage() );
            $this->error( 'Failed to send sample date notifications.' );
        }
    }
}