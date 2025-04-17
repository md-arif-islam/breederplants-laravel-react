<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model {
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'images', // New JSON field for thumbnails
        'genus',
        'species',
        'cultivar',
        'description', // New text field for product description
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
        'images' => 'array', // Cast images as an array
    ];

    public function breederProducts() {
        return $this->hasMany( BreederProduct::class );
    }

    public function breeders() {
        return $this->belongsToMany( Breeder::class, 'breeder_products' );
    }

    public function growerProducts() {
        return $this->hasMany( GrowerProduct::class );
    }

    public function growers() {
        return $this->belongsToMany( Grower::class, 'grower_products' );
    }
}