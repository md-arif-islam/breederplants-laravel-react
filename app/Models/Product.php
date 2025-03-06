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
        'blooming_period',
        'pruning_period',
        'temperature',
        'height',
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
    ];
}