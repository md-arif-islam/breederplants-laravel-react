<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\File;

class VarietyReport extends Model {

    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'variety_name',
        'grower_id',
        'breeder_id',
        'amount_of_plants',
        'pot_size',
        'pot_trial',
        'open_field_trial',
        'date_of_propagation',
        'date_of_potting',
        'samples_schedule',
        'start_date',
        'end_date',
        'status',
        'thumbnail',
    ];

    public function grower() {
        return $this->belongsTo( Grower::class );
    }

    public function breeder() {
        return $this->belongsTo( Breeder::class );
    }

    public function samples() {
        return $this->hasMany( VarietySample::class );
    }

    protected static function booted() {

        static::deleting( function ( $report ) {
            if ( $report->thumbnail && file_exists( public_path( $report->thumbnail ) ) ) {
                $trashDir = public_path( 'images/variety-reports/trash/' );
                if ( !File::exists( $trashDir ) ) {
                    File::makeDirectory( $trashDir, 0755, true );
                }

                File::move(
                    public_path( $report->thumbnail ),
                    $trashDir . basename( $report->thumbnail )
                );
            }
        } );

        static::restoring( function ( $report ) {
            if ( $report->thumbnail ) {
                $fileName = basename( $report->thumbnail );
                $trashPath = public_path( 'images/variety-reports/trash/' . $fileName );
                $originalPath = public_path( $report->thumbnail );

                if ( file_exists( $trashPath ) ) {
                    // Create the directory if it doesn't exist
                    $originalDir = dirname( $originalPath );
                    if ( !File::exists( $originalDir ) ) {
                        File::makeDirectory( $originalDir, 0755, true );
                    }

                    // Move the file from trash back to original location
                    File::move( $trashPath, $originalPath );
                }
            }
        } );
    }
}
