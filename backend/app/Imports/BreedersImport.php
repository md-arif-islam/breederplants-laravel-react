<?php

namespace App\Imports;

use App\Models\Breeder;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\ToCollection;

class BreedersImport implements ToCollection {
    private $firstRow = true;
    public $failedImports = []; // Array to store failed imports

    public function collection( Collection $rows ) {
        foreach ( $rows as $row ) {
            if ( $this->firstRow ) {
                $this->firstRow = false; // Skip the first row (header)
                continue;
            }

            // Check if the row is blank
            if ( $row->filter()->isEmpty() ) {
                Log::warning( 'Blank row encountered in import.' );
                continue;
            }

            // Check if email or username already exists
            $existingUser = User::where( 'email', $row[3] )->first();
            $existingBreeder = Breeder::where( 'username', $row[0] )->first();

            if ( $existingUser || $existingBreeder ) {
                // Store failed import due to duplicate email or username
                $this->failedImports[] = [
                    'username' => $row[0],
                    'email' => $row[3],
                ];
                Log::warning( 'Duplicate email or username found.', [
                    'username' => $row[0],
                    'email' => $row[3],
                ] );
                continue; // Skip to next row
            }

            // Generate dynamic password
            $password = Str::lower( str_replace( ' ', '', $row[6] ) );

            // Create the User
            $user = User::create( [
                'email' => $row[3],
                'password' => Hash::make( $password ),
                'role' => 'breeder',
                'status' => 'active',
            ] );

            // Create the Breeder
            Breeder::create( [
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
            ] );
        }
    }
}
