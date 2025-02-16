<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model {
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'breeder_id',
        'genus',
        'species',
        'cultivar',
        'plant_id',
        'protection_number',
        'cpvo_expiration_date',
        'royalty_fee',
        'sun_icon',
        'edible_icon',
        'partial_shade_icon',
        'blooming_time_icon',
        'blooming_period',
        'pruning_icon',
        'pruning_period',
        'winter_hardy_icon',
        'temperature',
        'height_icon',
        'height',
        'width_icon',
        'width',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'sun_icon' => 'boolean',
        'edible_icon' => 'boolean',
        'partial_shade_icon' => 'boolean',
        'blooming_time_icon' => 'boolean',
        'pruning_icon' => 'boolean',
        'winter_hardy_icon' => 'boolean',
    ];

    public function breeder() {
        return $this->belongsTo( Breeder::class );
    }
}