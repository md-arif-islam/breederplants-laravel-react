<?php

namespace App\Http\Controllers\Admin;

use App\Exports\SalesReportExport;
use App\Http\Controllers\Controller;
use App\Models\Grower;
use App\Models\SalesReport;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Facades\Excel;

class AdminSalesReportController extends Controller {
    public function index( Request $request ) {
        $currentYear = Carbon::now()->year;
        $currentQuarter = "q" . ceil( Carbon::now()->month / 3 );

        // Retrieve selected filters
        $selectedGrower = $request->get( 'grower', '' );
        $selectedQuarter = $request->get( 'quarter', '' );
        $selectedStatus = $request->get( 'status', '' );

        // Fetch all growers for filtering options
        $growers = Grower::all();

        // Build query to fetch sales reports
        $query = SalesReport::query();

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

        $salesReports = $query->with( 'grower' )->orderBy( 'year', 'desc' )->orderBy( 'quarter', 'desc' )->paginate( 10 );

        return response()->json( $salesReports );
    }

    public function show( $id ) {
        // Fetch the specific sales report by ID
        $salesReport = SalesReport::with( 'grower' )->findOrFail( $id );

        // Return the show view with the sales report details
        return response()->json( $salesReport );
    }

    public function empty( $id ) {
        // Find the sales report and update it
        $salesReport = SalesReport::findOrFail( $id );
        $salesReport->update( [
            'submission_date' => null,
            'data' => null,
        ] );

        return response()->json( [
            'message' => 'Sales report deleted successfully.',
        ] );
    }

    public function export( $id ) {
        // Fetch the specific sales report by ID
        $salesReport = SalesReport::findOrFail( $id );
        $grower = Grower::where( 'id', $salesReport->grower_id )->first();

        $fileName = 'Breederplants-' . Str::slug( $grower->company_name ) . '-' . $salesReport->quarter . '-' . $salesReport->year . '.xlsx';

        return Excel::download( new SalesReportExport( $salesReport, $grower ), $fileName );

    }
}