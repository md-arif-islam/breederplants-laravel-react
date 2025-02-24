<?php

namespace App\Http\Controllers;

use App\Imports\GrowersImport;
use App\Models\Grower;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class GrowerController extends Controller {
    /**
     * Display a listing of the resource.
     */
    public function index( Request $request ) {
        $query = $request->input( 'search' );

        $growers = Grower::with( 'user' )->when( $query, function ( $q ) use ( $query ) {
            return $q->where( 'contact_person', 'like', "%{$query}%" )->orWhere( 'company_name', 'like', "%{$query}%" )->orWhereHas( 'user', function ( $q ) use ( $query ) {
                $q->where( 'email', 'like', "%{$query}%" );
            } );
        } )->paginate( 10 );

        return response()->json( $growers );
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create() {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store( Request $request ) {

        $request->validate( [
            'username' => 'required|string|max:255|unique:growers,username',
            'company_email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'nullable|string|min:4|confirmed',
            'is_active' => 'required|boolean',
            'company_name' => 'required|string|max:255',
            'contact_person' => 'required|string|max:255',
            'street' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'postal_code' => 'required|string|max:255',
            'country' => 'required|string|max:255',
            'phone' => 'nullable|string|max:255',
            'website' => 'nullable|string|max:255',
            'agreement_number' => 'required|numeric',
            'sales_reporting_quarter' => 'required|array',
            'sales_reporting_quarter.*' => 'required|string',
            'production_reporting_quarter' => 'required|array',
            'production_reporting_quarter.*' => 'required|string',
            'production_reporting_values' => 'required|array',
            'production_reporting_values.*' => 'required|string',
            'password' => 'required|string|min:4|confirmed',
        ] );

        // Create user
        $user = $request->user()->create( [
            'email' => $request->company_email,
            'password' => $request->password,
            'role' => 'grower',
            'is_active' => $request->is_active,
        ] );

        // Create grower
        $grower = new Grower();
        $grower->create( [
            'user_id' => $user->id,
            'username' => $request->username,
            'company_name' => $request->company_name,
            'company_email' => $request->company_email,
            'contact_person' => $request->contact_person,
            'street' => $request->street,
            'city' => $request->city,
            'postal_code' => $request->postal_code,
            'country' => $request->country,
            'phone' => $request->phone,
            'website' => $request->website,
            'agreement_number' => $request->agreement_number,
            'sales_reporting_quarter' => json_encode( $request->sales_reporting_quarter ),
            'production_reporting_quarter' => json_encode( $request->production_reporting_quarter ),
            'production_reporting_values' => json_encode( $request->production_reporting_values ),
        ] );

    }

    /**
     * Display the specified resource.
     */
    public function show( Grower $grower ) {
        $grower = Grower::with( 'user' )->findOrFail( $grower->id );
        return response()->json( $grower );
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit( Grower $grower ) {

    }

    /**
     * Update the specified resource in storage.
     */
    public function update( Request $request, Grower $grower ) {

        $user = $grower->user;

        $request->validate( [
            'username' => 'required|string|max:255|unique:growers,username,' . $grower->id,
            'company_email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:4|confirmed',
            'is_active' => 'required|boolean',
            'company_name' => 'required|string|max:255',
            'contact_person' => 'required|string|max:255',
            'street' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'postal_code' => 'required|string|max:255',
            'country' => 'required|string|max:255',
            'phone' => 'nullable|string|max:255',
            'website' => 'nullable|string|max:255',
            'agreement_number' => 'required|numeric',
            'sales_reporting_quarter' => 'required|array',
            'sales_reporting_quarter.*' => 'required|string|max:255',
            'production_reporting_quarter' => 'required|array',
            'production_reporting_quarter.*' => 'required|string|max:255',
            'production_reporting_values' => 'required|array',
            'production_reporting_values.*' => 'required|string|max:255',
        ] );

        $user->update( [
            'email' => $request->company_email,
            'is_active' => $request->is_active,
        ] );

        $grower->update( [
            'username' => $request->username,
            'company_name' => $request->company_name,
            'company_email' => $request->company_email,
            'contact_person' => $request->contact_person,
            'street' => $request->street,
            'city' => $request->city,
            'postal_code' => $request->postal_code,
            'country' => $request->country,
            'phone' => $request->phone,
            'website' => $request->website,
            'agreement_number' => $request->agreement_number,
            'sales_reporting_quarter' => json_encode( $request->sales_reporting_quarter ),
            'production_reporting_quarter' => json_encode( $request->production_reporting_quarter ),
            'production_reporting_values' => json_encode( $request->production_reporting_values ),
        ] );

        return response()->json( $grower );

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy( Grower $grower ) {
        $user = $grower->user;
        $grower->delete();
        $user->delete();
        return response()->json( ['message' => 'Grower deleted successfully'] );
    }

    public function updatePassword( Request $request, Grower $grower ) {
        $request->validate( [
            'password' => 'required|string|min:4|confirmed',
        ] );

        $grower->user->update( [
            'password' => $request->password,
        ] );

        return response()->json( ['message' => 'Password updated successfully'] );
    }

    public function importCSV( Request $request ) {

        $request->validate( [
            'file' => 'required|file|mimes:csv,txt',
        ] );

        try {
            $import = new GrowersImport;
            Excel::import( $import, $request->file( 'file' ) );

            // Check if there were any failed imports
            if ( count( $import->failedImports ) > 0 ) {
                return response()->json( [
                    'message' => 'Growers imported with some errors.',
                    'failedImports' => $import->failedImports,
                ], 422 );
            }

            return response()->json( ['message' => 'Growers imported successfully'] );
        } catch ( Exception $e ) {
            // Log the error or handle it as needed
            return response()->json( ['message' => 'Failed to import growers'] );
        }
    }

    public function exportCSV() {

        $filename = 'growers-data-' . date( 'Y-m-d' ) . '.csv';

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"$filename\"",
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
        ];

        $callback = function () {
            $handle = fopen( 'php://output', 'w' );

            // Add CSV headers
            fputcsv( $handle, [
                'Grower ID',
                'Contact Person',
                'Company Name',
                'Company Email',
                'Street',
                'City',
                'Postal Code',
                'Country',
                'Phone Number',
                'Website',
                'Agreement Number',
                'Sales Reporting Quarter',
            ] );

            // Fetch and process data in chunks
            Grower::with( 'user' )->chunk( 100, function ( $growers ) use ( $handle ) {
                foreach ( $growers as $grower ) {
                    $data = [
                        $grower->username ?? '',
                        $grower->contact_person ?? '',
                        $grower->company_name ?? '',
                        $grower->user->email ?? '',
                        $grower->street ?? '',
                        $grower->city ?? '',
                        $grower->postal_code ?? '',
                        $grower->country ?? '',
                        $grower->phone ?? '',
                        $grower->website ?? '',
                        $grower->agreement_number ?? '',
                        $grower->sales_reporting_quarter ?? '',
                    ];
                    fputcsv( $handle, $data );
                }
            } );

            fclose( $handle );
        };

        return response()->stream( $callback, 200, $headers );
    }
}