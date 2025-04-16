<?php

namespace App\Http\Controllers;

use App\Imports\GrowersImport;
use App\Models\Grower;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Maatwebsite\Excel\Facades\Excel;

class GrowerController extends Controller {
    public function index( Request $request ) {
        $query = $request->input( 'search' );

        $growers = Grower::with( 'user' )
            ->when( $query, function ( $q ) use ( $query ) {
                return $q->where( 'contact_person', 'like', "%{$query}%" )
                    ->orWhere( 'company_name', 'like', "%{$query}%" )
                    ->orWhereHas( 'user', function ( $q ) use ( $query ) {
                        $q->where( 'email', 'like', "%{$query}%" );
                    } );
            } )
            ->paginate( 10 );

        return response()->json( $growers );
    }

    public function store( Request $request ) {
        $request->validate( [
            'username' => [
                'required', 'string', 'max:255',
                Rule::unique( 'growers' )->whereNull( 'deleted_at' ),
            ],
            'company_email' => [
                'required', 'string', 'email', 'max:255',
                Rule::unique( 'users', 'email' )->whereNull( 'deleted_at' ),
            ],
            'password' => 'required|string|min:4|confirmed',
            'company_name' => 'required|string|max:255',
            'contact_person' => 'required|string|max:255',
            'street' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'postal_code' => 'required|string|max:255',
            'country' => 'required|string|max:255',
            'phone' => 'nullable|string|max:255',
            'website' => 'nullable|string|max:255',
            'agreement_number' => 'required|string',
            'sales_reporting_quarter' => 'nullable|array',
            'production_reporting_quarter' => 'nullable|array',
            'production_reporting_values' => 'nullable|array',
        ] );

        // Check if user with email exists (trashed)
        $user = User::withTrashed()->where( 'email', $request->company_email )->first();
        if ( $user && $user->trashed() ) {
            $user->restore();
            $user->update( [
                'password' => $request->password,
                'role' => 'grower',
                'is_active' => true,
            ] );
        } elseif ( !$user ) {
            $user = User::create( [
                'email' => $request->company_email,
                'password' => $request->password,
                'role' => 'grower',
                'is_active' => true,
            ] );
        }

        // Check if grower with username exists (trashed)
        $grower = Grower::withTrashed()->where( 'company_email', $request->company_email )->first();
        if ( $grower && $grower->trashed() ) {
            $grower->restore();
            $grower->update( [
                'user_id' => $user->id,
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
        } elseif ( !$grower ) {
            Grower::create( [
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

        return response()->json( ['message' => 'Grower created or restored successfully'] );
    }

    public function show( Grower $grower ) {
        return response()->json(
            Grower::with( 'user' )->findOrFail( $grower->id )
        );
    }

    public function update( Request $request, Grower $grower ) {
        $user = $grower->user;

        $request->validate( [
            'username' => [
                'required', 'string', 'max:255',
                Rule::unique( 'growers' )->ignore( $grower->id )->whereNull( 'deleted_at' ),
            ],
            'company_email' => [
                'required', 'string', 'email', 'max:255',
                Rule::unique( 'users', 'email' )->ignore( $user->id )->whereNull( 'deleted_at' ),
            ],
            'password' => 'nullable|string|min:4|confirmed',
            'company_name' => 'required|string|max:255',
            'contact_person' => 'required|string|max:255',
            'street' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'postal_code' => 'required|string|max:255',
            'country' => 'required|string|max:255',
            'phone' => 'nullable|string|max:255',
            'website' => 'nullable|string|max:255',
            'agreement_number' => 'required|string',
            'sales_reporting_quarter' => 'nullable|array',
            'production_reporting_quarter' => 'nullable|array',
            'production_reporting_values' => 'nullable|array',
        ] );

        $user->update( [
            'email' => $request->company_email,
            'is_active' => true,
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

    public function destroy( Grower $grower ) {
        $grower->delete();
        $grower->user->delete();

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

            return response()->json( [
                'message' => 'Import completed',
                'success_count' => $import->successCount,
                'failed_count' => count( $import->failedImports ),
                'failed_details' => $import->failedImports,
            ], $import->failedImports ? 422 : 200 );
        } catch ( Exception $e ) {
            return response()->json( [
                'message' => 'Failed to import growers',
                'error' => $e->getMessage(),
            ], 500 );
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

            fputcsv( $handle, [
                'Grower ID', 'Contact Person', 'Company Name', 'Company Email',
                'Street', 'City', 'Postal Code', 'Country', 'Phone Number',
                'Website', 'Agreement Number', 'Sales Reporting Quarter',
                'Production Reporting Quarter', 'Production Reporting Values',
            ] );

            Grower::with( 'user' )
                ->chunk( 100, function ( $growers ) use ( $handle ) {
                    foreach ( $growers as $grower ) {
                        fputcsv( $handle, [
                            $grower->username,
                            $grower->contact_person,
                            $grower->company_name,
                            $grower->user->email,
                            $grower->street,
                            $grower->city,
                            $grower->postal_code,
                            $grower->country,
                            $grower->phone,
                            $grower->website,
                            $grower->agreement_number,
                            $grower->sales_reporting_quarter,
                            $grower->production_reporting_quarter,
                            $grower->production_reporting_values,
                        ] );
                    }
                } );

            fclose( $handle );
        };

        return response()->stream( $callback, 200, $headers );
    }
}