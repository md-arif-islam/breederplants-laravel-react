<?php

namespace App\Imports;

use App\Models\Grower;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\ToCollection;

class GrowersImport implements ToCollection {
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

            try {
                $username = trim( $row[0] ?? '' );
                $contactPerson = $row[1] ?? '';
                $companyName = $row[2] ?? '';
                $companyEmail = $row[3] ?? '';
                $street = $row[4] ?? '';
                $city = $row[5] ?? '';
                $postalCode = $row[6] ?? '';
                $country = $row[7] ?? '';
                $phone = $row[8] ?? '';
                $website = $row[9] ?? '';
                $agreementNumber = $row[10] ?? '';
                $salesReportingQuarter = isset( $row[11] ) ? explode( '.', $row[11] ) : [];

                if ( empty( $username ) || empty( $companyEmail ) ) {
                    $this->addFailure( $rowNumber, 'Missing username or email' );
                    continue;
                }

                // Check if soft-deleted user exists
                $user = User::withTrashed()->where( 'email', $companyEmail )->first();
                if ( $user && !$user->trashed() ) {
                    $this->addFailure( $rowNumber, "Duplicate email: $companyEmail" );
                    continue;
                }

                // Check if soft-deleted grower exists
                $grower = Grower::withTrashed()->where( 'username', $username )->first();
                if ( $grower && !$grower->trashed() ) {
                    $this->addFailure( $rowNumber, "Duplicate username: $username" );
                    continue;
                }

                $generatedPassword = Str::lower( str_replace( ' ', '', $postalCode ) );

                DB::beginTransaction();

                if ( $user && $user->trashed() ) {
                    $user->restore();
                    $user->update( [
                        'password' => Hash::make( $generatedPassword ),
                        'role' => 'grower',
                        'status' => 'active',
                    ] );
                } elseif ( !$user ) {
                    $user = User::create( [
                        'email' => $companyEmail,
                        'password' => Hash::make( $generatedPassword ),
                        'role' => 'grower',
                        'status' => 'active',
                    ] );
                }

                if ( $grower && $grower->trashed() ) {
                    $grower->restore();
                    $grower->update( [
                        'user_id' => $user->id,
                        'username' => $username,
                        'contact_person' => $contactPerson,
                        'company_name' => $companyName,
                        'company_email' => $companyEmail,
                        'street' => $street,
                        'city' => $city,
                        'postal_code' => $postalCode,
                        'country' => $country,
                        'phone' => $phone,
                        'website' => $website,
                        'agreement_number' => $agreementNumber,
                        'sales_reporting_quarter' => json_encode( $salesReportingQuarter ),
                        'production_reporting_quarter' => null,
                        'production_reporting_values' => null,
                    ] );
                } elseif ( !$grower ) {
                    Grower::create( [
                        'user_id' => $user->id,
                        'username' => $username,
                        'contact_person' => $contactPerson,
                        'company_name' => $companyName,
                        'company_email' => $companyEmail,
                        'street' => $street,
                        'city' => $city,
                        'postal_code' => $postalCode,
                        'country' => $country,
                        'phone' => $phone,
                        'website' => $website,
                        'agreement_number' => $agreementNumber,
                        'sales_reporting_quarter' => json_encode( $salesReportingQuarter ),
                        'production_reporting_quarter' => null,
                        'production_reporting_values' => null,
                    ] );
                }

                DB::commit();
                $this->successCount++;
            } catch ( \Exception $e ) {
                DB::rollBack();
                $this->addFailure( $rowNumber, 'Exception: ' . $e->getMessage() );
            }
        }

        Log::info( 'Grower import finished', [
            'success_count' => $this->successCount,
            'failed_count' => count( $this->failedImports ),
        ] );
    }

    private function addFailure( $rowNumber, $reason ) {
        $this->failedImports[] = [
            'row' => $rowNumber,
            'reason' => $reason,
        ];

        Log::warning( 'Import row failed', [
            'row' => $rowNumber,
            'reason' => $reason,
        ] );
    }
}