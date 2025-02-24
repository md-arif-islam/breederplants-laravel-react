<?php

namespace App\Http\Controllers\Admin;

use App\Exports\ProductionReportExport;
use App\Http\Controllers\Controller;
use App\Models\Grower;
use App\Models\ProductionReport;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Facades\Excel;

class AdminProductionReportController extends Controller {
    public function index( Request $request ) {
        $currentYear = Carbon::now()->year;
        $currentQuarter = "q" . ceil( Carbon::now()->month / 3 );

        // Retrieve selected filters
        $selectedGrower = $request->get( 'grower', '' );
        $selectedQuarter = $request->get( 'quarter', '' );
        $selectedStatus = $request->get( 'status', '' );

        // Fetch all growers for filtering options
        $growers = Grower::all();

        // Build query to fetch production reports
        $query = ProductionReport::query();

        if ( !empty( $selectedGrower ) ) {
            $query->where( 'grower_id', $selectedGrower );
        }

        if ( !empty( $selectedQuarter ) ) {
            $query->where( 'quarter', $selectedQuarter );
        }

        if ( !empty( $selectedStatus ) ) {
            if ( $selectedStatus == 'submitted' ) {
                $query->whereNotNull( 'submission_date' );
            } elseif ( $selectedStatus == 'pending' ) {
                $query->whereNull( 'submission_date' );
            }
        }

        $productionReports = $query->with( 'grower' )->orderBy( 'year', 'desc' )->orderBy( 'quarter', 'desc' )->paginate( 10 );

        return response()->json( $productionReports );
    }

    public function show( $id ) {
        // Fetch the specific production report by ID
        $productionReport = ProductionReport::with( 'grower' )->findOrFail( $id );

        // Return the show view with the production report details
        return response()->json( $productionReport );
    }

    public function empty( $id ) {
        // Find the production report and update it
        $productionReport = ProductionReport::findOrFail( $id );
        $productionReport->update( [
            'submission_date' => null,
            'data' => null,
        ] );

        return response()->json( [
            'message' => 'Production report deleted successfully.',
        ] );
    }

    public function export( $id ) {
        // Fetch the specific production report by ID
        $productionReport = ProductionReport::findOrFail( $id );
        $grower = Grower::where( 'id', $productionReport->grower_id )->first();

        $fileName = 'Breederplants-' . Str::slug( $grower->company_name ) . '-' . $productionReport->quarter . '-' . $productionReport->year . '.xlsx';

        return Excel::download( new ProductionReportExport( $productionReport, $grower ), $fileName );

    }
}