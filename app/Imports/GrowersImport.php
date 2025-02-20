<?php

namespace App\Imports;

use App\Models\Grower;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\ToCollection;

class GrowersImport implements ToCollection {
    private $firstRow = true;
    public $failedImports = []; // Store failed records

    public function collection( Collection $rows ) {

        foreach ( $rows as $index => $row ) {

            if ( $this->firstRow ) {

                $this->firstRow = false; // Skip the header row
                continue;
            }

            // Check if the row is blank
            if ( $row->filter()->isEmpty() ) {
                // Log the blank row error
                Log::error( 'Failed import', [
                    'reason' => 'Blank row',
                ] );

                continue; // Skip this row, as it is blank
            }

            // Check if the email already exists
            $existingUser = User::where( 'email', $row[3] )->first();

            // Check if the username already exists
            $existingGrower = Grower::where( 'username', $row[0] )->first();

            if ( $existingUser || $existingGrower ) {
                // Store the failed record in the array
                $this->failedImports[] = [
                    'username' => $row[0],
                    'email' => $row[3],
                    'reason' => $existingUser ? 'Email already exists' : 'Username already exists',
                ];

                // Log the failed import
                Log::error( 'Failed import', [
                    'username' => $row[0],
                    'email' => $row[3],
                    'reason' => $existingUser ? 'Email already exists' : 'Username already exists',
                ] );

                continue;
            }

            // Create user and grower if no conflicts
            $password = Str::lower( str_replace( ' ', '', $row[6] ) );

            try {
                $user = User::create( [
                    'email' => $row[3],
                    'password' => Hash::make( $password ),
                    'role' => 'grower',
                    'status' => 'active', // default status
                ] );

                Log::info( 'User created', ['user_id' => $user->id, 'email' => $user->email] );
            } catch ( \Exception $e ) {
                Log::error( 'Failed to create user', ['email' => $row[3], 'error' => $e->getMessage()] );
                continue; // Skip to the next row if user creation fails
            }

            try {
                Grower::create( [
                    'user_id' => $user->id,
                    'username' => $row[0] ?? '',
                    'contact_person' => $row[1] ?? '',
                    'company_name' => $row[2] ?? '',
                    'company_email' => $row[3] ?? '',
                    'street' => $row[4] ?? '',
                    'city' => $row[5] ?? '',
                    'postal_code' => $row[6] ?? '',
                    'country' => $row[7] ?? '',
                    'phone' => $row[8] ?? '',
                    'website' => $row[9] ?? '',
                    'agreement_number' => $row[10] ?? '',
                    'sales_reporting_quarter' => $row[11] ?? '',
                ] );
                Log::info( 'Grower created', ['username' => $row[0], 'user_id' => $user->id] );
            } catch ( \Exception $e ) {
                Log::error( 'Failed to create grower', ['username' => $row[0], 'user_id' => $user->id, 'error' => $e->getMessage()] );
                // Optionally, delete the user if grower creation fails
                $user->delete();
                Log::warning( 'User deleted due to grower creation failure', ['user_id' => $user->id] );
                continue; // Skip to the next row if grower creation fails
            }
        }
        Log::info( 'Import finished' );
    }
}
