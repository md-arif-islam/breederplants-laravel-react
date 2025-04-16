<?php

namespace App\Http\Controllers;

use App\Imports\BreedersImport;
use App\Models\Breeder;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Maatwebsite\Excel\Facades\Excel;

class BreederController extends Controller {
    public function index( Request $request ) {
        $query = $request->input( 'search' );

        $breeders = Breeder::with( 'user' )
            ->when( $query, function ( $q ) use ( $query ) {
                return $q->where( 'contact_person', 'like', "%{$query}%" )
                    ->orWhere( 'company_name', 'like', "%{$query}%" )
                    ->orWhereHas( 'user', function ( $q ) use ( $query ) {
                        $q->where( 'email', 'like', "%{$query}%" );
                    } );
            } )
            ->paginate( 10 );

        return response()->json( $breeders );
    }

    public function store( Request $request ) {
        $request->validate( [
            'username' => [
                'required', 'string', 'max:255',
                Rule::unique( 'breeders' )->whereNull( 'deleted_at' ),
            ],
            'company_email' => [
                'required', 'string', 'email', 'max:255',
                Rule::unique( 'users', 'email' )->whereNull( 'deleted_at' ),
            ],
            'password' => 'required|string|min:4|confirmed',
            'is_active' => 'required|boolean',
            'company_name' => 'required|string|max:255',
            'contact_person' => 'required|string|max:255',
            'street' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'postal_code' => 'required|string|max:255',
            'country' => 'required|string|max:255',
            'phone' => 'nullable|string|max:255',
            'website' => 'nullable|string|max:255',
        ] );

        DB::beginTransaction();

        try {
            $email = $request->company_email;
            $username = $request->username;

            // User restore or create
            $user = User::withTrashed()->where( 'email', $email )->first();
            if ( $user && $user->trashed() ) {
                $user->restore();
                $user->update( [
                    'password' => $request->password,
                    'role' => 'breeder',
                    'is_active' => $request->is_active,
                ] );
            } elseif ( !$user ) {
                $user = User::create( [
                    'email' => $email,
                    'password' => $request->password,
                    'role' => 'breeder',
                    'is_active' => $request->is_active,
                ] );
            }

            // Breeder restore or create
            $breeder = Breeder::withTrashed()->where( 'company_email', $email )->first();
            if ( $breeder && $breeder->trashed() ) {
                $breeder->restore();
                $breeder->update( [
                    'user_id' => $user->id,
                    'username' => $username,
                    'company_name' => $request->company_name,
                    'company_email' => $email,
                    'contact_person' => $request->contact_person,
                    'street' => $request->street,
                    'city' => $request->city,
                    'postal_code' => $request->postal_code,
                    'country' => $request->country,
                    'phone' => $request->phone,
                    'website' => $request->website,
                ] );
            } elseif ( !$breeder ) {
                Breeder::create( [
                    'user_id' => $user->id,
                    'username' => $username,
                    'company_name' => $request->company_name,
                    'company_email' => $email,
                    'contact_person' => $request->contact_person,
                    'street' => $request->street,
                    'city' => $request->city,
                    'postal_code' => $request->postal_code,
                    'country' => $request->country,
                    'phone' => $request->phone,
                    'website' => $request->website,
                ] );
            }

            DB::commit();

            return response()->json( ['message' => 'Breeder created or restored successfully'] );
        } catch ( Exception $e ) {
            DB::rollBack();
            return response()->json( ['error' => $e->getMessage()], 500 );
        }
    }

    public function show( Breeder $breeder ) {
        return response()->json(
            Breeder::with( 'user' )->findOrFail( $breeder->id )
        );
    }

    public function update( Request $request, Breeder $breeder ) {
        $user = $breeder->user;

        $request->validate( [
            'username' => [
                'required', 'string', 'max:255',
                Rule::unique( 'breeders' )->ignore( $breeder->id )->whereNull( 'deleted_at' ),
            ],
            'company_email' => [
                'required', 'string', 'email', 'max:255',
                Rule::unique( 'users', 'email' )->ignore( $user->id )->whereNull( 'deleted_at' ),
            ],
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
        ] );

        $user->update( [
            'email' => $request->company_email,
            'is_active' => $request->is_active,
        ] );

        $breeder->update( [
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
        ] );

        return response()->json( $breeder );
    }

    public function destroy( Breeder $breeder ) {
        $breeder->delete();
        $breeder->user->delete();

        return response()->json( ['message' => 'Breeder deleted successfully'] );
    }

    public function updatePassword( Request $request, Breeder $breeder ) {
        $request->validate( [
            'password' => 'required|string|min:4|confirmed',
        ] );

        $breeder->user->update( [
            'password' => $request->password,
        ] );

        return response()->json( ['message' => 'Password updated successfully'] );
    }

    public function importCSV( Request $request ) {
        $request->validate( [
            'file' => 'required|file|mimes:csv,txt',
        ] );

        try {
            $import = new BreedersImport;
            Excel::import( $import, $request->file( 'file' ) );

            return response()->json( [
                'message' => 'Import completed',
                'success_count' => $import->successCount,
                'failed_count' => count( $import->failedImports ),
                'failed_details' => $import->failedImports,
            ], 200 );
        } catch ( Exception $e ) {
            return response()->json( [
                'message' => 'An error occurred while importing breeders',
                'error' => $e->getMessage(),
            ], 500 );
        }
    }

    public function exportCSV() {
        $filename = 'breeders-data-' . date( 'Y-m-d' ) . '.csv';

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
                'Breeder ID', 'Contact Person', 'Company Name', 'Company Email',
                'Street', 'City', 'Postal Code', 'Country', 'Phone Number', 'Website',
            ] );

            Breeder::with( 'user' )
                ->chunk( 100, function ( $breeders ) use ( $handle ) {
                    foreach ( $breeders as $breeder ) {
                        fputcsv( $handle, [
                            $breeder->username ?? '',
                            $breeder->contact_person ?? '',
                            $breeder->company_name ?? '',
                            $breeder->user->email ?? '',
                            $breeder->street ?? '',
                            $breeder->city ?? '',
                            $breeder->postal_code ?? '',
                            $breeder->country ?? '',
                            $breeder->phone ?? '',
                            $breeder->website ?? '',
                        ] );
                    }
                } );

            fclose( $handle );
        };

        return response()->stream( $callback, 200, $headers );
    }
}