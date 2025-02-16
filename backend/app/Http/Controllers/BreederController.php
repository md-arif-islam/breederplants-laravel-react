<?php

namespace App\Http\Controllers;

use App\Imports\BreedersImport;
use App\Models\Breeder;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class BreederController extends Controller {
    /**
     * Display a listing of the resource.
     */
    public function index( Request $request ) {
        $query = $request->input( 'search' );

        $breeders = Breeder::with( 'user' )->when( $query, function ( $q ) use ( $query ) {
            return $q->where( 'contact_person', 'like', "%{$query}%" )->orWhere( 'company_name', 'like', "%{$query}%" )->orWhereHas( 'user', function ( $q ) use ( $query ) {
                $q->where( 'email', 'like', "%{$query}%" );
            } );
        } )->paginate( 10 );

        return response()->json( $breeders );
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
            'username' => 'required|string|max:255|unique:breeders,username',
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
            'password' => 'required|string|min:4|confirmed',
        ] );

        // Create user
        $user = $request->user()->create( [
            'email' => $request->company_email,
            'password' => $request->password,
            'role' => 'breeder',
            'is_active' => $request->is_active,
        ] );

        // Create breeder
        $breeder = new Breeder();
        $breeder->create( [
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

        ] );

    }

    /**
     * Display the specified resource.
     */
    public function show( Breeder $breeder ) {
        $breeder = Breeder::with( 'user' )->findOrFail( $breeder->id );
        return response()->json( $breeder );
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit( Breeder $breeder ) {

    }

    /**
     * Update the specified resource in storage.
     */
    public function update( Request $request, Breeder $breeder ) {

        $user = $breeder->user;

        $request->validate( [
            'username' => 'required|string|max:255|unique:breeders,username,' . $breeder->id,
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

    /**
     * Remove the specified resource from storage.
     */
    public function destroy( Breeder $breeder ) {
        $breeder->delete();
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

            // Check if there are any failed imports due to duplicate username/email
            if ( count( $import->failedImports ) > 0 ) {
                return redirect()->back()->with( [
                    'success' => 'Breeders imported successfully with some errors.',
                    'failedImports' => $import->failedImports, // Pass failed imports to view
                ] );
            }

            return response()->json( ['message' => 'Breeders imported successfully'] );
        } catch ( Exception $e ) {
            // Log the error or handle it as needed
            return response()->json( ['message' => 'An error occurred while importing breeders'] );
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

            // Add CSV headers
            fputcsv( $handle, [
                'Breeder ID',
                'Contact Person',
                'Company Name',
                'Company Email',
                'Street',
                'City',
                'Postal Code',
                'Country',
                'Phone Number',
                'Website',
            ] );

            // Fetch and process data in chunks
            Breeder::with( 'user' )->chunk( 100, function ( $breeders ) use ( $handle ) {
                foreach ( $breeders as $breeder ) {
                    $data = [
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
                    ];
                    fputcsv( $handle, $data );
                }
            } );

            fclose( $handle );
        };

        return response()->stream( $callback, 200, $headers );
    }

}