<?php

namespace App\Console\Commands;

use App\Models\VarietyReport;
use Illuminate\Console\Command;

class RestoreVarietyReport extends Command {
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:restore-variety-report {id}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Restores a soft-deleted variety report by ID';

    /**
     * Execute the console command.
     */
    public function handle() {
        $id = $this->argument( 'id' );
        $report = VarietyReport::withTrashed()->find( $id );

        if ( !$report ) {
            $this->error( "No report found with ID $id." );
            return;
        }

        $report->restore();
        $this->info( "Variety report ID $id restored." );
    }
}
