<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Breeder;
use App\Models\Grower;
use App\Models\VarietyReport;
use Illuminate\Http\Request;

class PublicVarietyReportController extends Controller {
    public function index( Request $request ) {

        $query = VarietyReport::with( ['grower', 'breeder'] );

        // Search functionality
        if ( $search = $request->input( 'search' ) ) {
            $query->where( 'variety_name', 'LIKE', "%{$search}%" );
        }

        // Sorting functionality
        if ( $sort = $request->input( 'sort' ) ) {
            switch ( $sort ) {
            case 'a-z':
                $query->orderBy( 'variety_name', 'asc' );
                break;
            case 'last-item-first':
                $query->latest();
                break;
            case 'first-item-last':
                $query->oldest();
                break;
            }
        }

        // Paginate the results once.
        $varietyReports = $query->paginate( 6 );
        $growers = Grower::all( 'id', 'company_name' );

        return response()->json( [
            'varietyReports' => $varietyReports,
            'growers' => $growers,
        ] );
    }

    public function show( $id ) {
        $varietyReport = VarietyReport::with( ['grower', 'breeder', 'samples'] )->findOrFail( $id );
        $growers = Grower::all( 'id', 'company_name' );
        $breeders = Breeder::all( 'id', 'company_name' );

        return response()->json( [
            'varietyReport' => $varietyReport,
            'growers' => $growers,
            'breeders' => $breeders,
        ] );
    }
}