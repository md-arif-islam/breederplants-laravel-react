<?php

namespace App\Imports;

use App\Models\Breeder;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\ToCollection;

class BreedersImport implements ToCollection {
    private $firstRow = true;
    public $failedImports = [];
    public $successCount = 0;

    public function collection( Collection $rows ) {
        foreach ( $rows as $index => $row ) {
            $rowNumber = $index + 1;

            if ( $this->firstRow ) {
                $this->firstRow = false;
                continue;
            }

            if ( $row->filter()->isEmpty() ) {
                $this->addFailure( $rowNumber, 'Blank row' );
                continue;
            }

            $username = trim( $row[0] ?? '' );
            $contactPerson = $row[1] ?? '';
            $companyName = $row[2] ?? '';
            $email = trim( $row[3] ?? '' );
            $street = $row[4] ?? '';
            $city = $row[5] ?? '';
            $postalCode = $row[6] ?? '';
            $country = $row[7] ?? '';
            $phone = $row[8] ?? '';
            $website = $row[9] ?? '';

            if ( empty( $email ) && !empty( $companyName ) ) {
                // Create a default email using company name if email is empty
                $sanitizedCompanyName = preg_replace( '/[^a-z0-9]/i', '', strtolower( $companyName ) );
                $email = "info+{$sanitizedCompanyName}@breederplants.nl";
            }

            if ( empty( $username ) || empty( $email ) ) {
                $this->addFailure( $rowNumber, 'Missing username or email' );
                continue;
            }

            // Check soft-deleted user
            $user = User::withTrashed()->where( 'email', $email )->first();
            if ( $user && !$user->trashed() ) {
                $this->addFailure( $rowNumber, "Duplicate email: $email" );
                continue;
            }

            // Check soft-deleted breeder
            $breeder = Breeder::withTrashed()->where( 'username', $username )->first();
            if ( $breeder && !$breeder->trashed() ) {
                $this->addFailure( $rowNumber, "Duplicate username: $username" );
                continue;
            }

            try {
                DB::beginTransaction();

                $password = 'Breederplants@Strong!';

                if ( $user && $user->trashed() ) {
                    $user->restore();
                    $user->update( [
                        'password' => Hash::make( $password ),
                        'role' => 'breeder',
                        'status' => 'active',
                    ] );
                } elseif ( !$user ) {
                    $user = User::create( [
                        'email' => $email,
                        'password' => Hash::make( $password ),
                        'role' => 'breeder',
                        'status' => 'active',
                    ] );
                }

                if ( $breeder && $breeder->trashed() ) {
                    $breeder->restore();
                    $breeder->update( [
                        'user_id' => $user->id,
                        'username' => $username,
                        'contact_person' => $contactPerson,
                        'company_name' => $companyName,
                        'company_email' => $email,
                        'street' => $street,
                        'city' => $city,
                        'postal_code' => $postalCode,
                        'country' => $country,
                        'phone' => $phone,
                        'website' => $website,
                    ] );
                } elseif ( !$breeder ) {
                    Breeder::create( [
                        'user_id' => $user->id,
                        'username' => $username,
                        'contact_person' => $contactPerson,
                        'company_name' => $companyName,
                        'company_email' => $email,
                        'street' => $street,
                        'city' => $city,
                        'postal_code' => $postalCode,
                        'country' => $country,
                        'phone' => $phone,
                        'website' => $website,
                    ] );
                }

                DB::commit();
                $this->successCount++;
            } catch ( \Exception $e ) {
                DB::rollBack();
                $this->addFailure( $rowNumber, 'Exception: ' . $e->getMessage() );
            }
        }

        Log::info( 'Breeder import finished', [
            'success_count' => $this->successCount,
            'failed_count' => count( $this->failedImports ),
        ] );
    }

    private function addFailure( $rowNumber, $reason ) {
        $this->failedImports[] = [
            'row' => $rowNumber,
            'reason' => $reason,
        ];

        Log::warning( 'Breeder import failed', [
            'row' => $rowNumber,
            'reason' => $reason,
        ] );
    }
}