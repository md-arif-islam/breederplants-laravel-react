<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VarietySample extends Model {
    use HasFactory;

    protected $fillable = [
        'variety_report_id',
        'images',
        'sample_date',
        'leaf_color',
        'amount_of_branches',
        'flower_buds',
        'branch_color',
        'roots',
        'flower_color',
        'flower_petals',
        'flowering_time',
        'length_of_flowering',
        'seeds',
        'seed_color',
        'amount_of_seeds',
        'note',
        'status',
    ];

    protected $casts = [
        'images' => 'array',
    ];

    protected static function boot() {
        parent::boot();

        static::deleting( function ( $varietySample ) {
            // Delete associated images
            $images = json_decode( $varietySample->images, true );
            if ( $images ) {
                foreach ( $images as $image ) {
                    if ( file_exists( public_path( $image ) ) ) {
                        unlink( public_path( $image ) );
                    }
                }
            }
        } );
    }

    public function varietyReport() {
        return $this->belongsTo( VarietyReport::class );
    }
}