<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GrowerProduct extends Model {
    /** @use HasFactory<\Database\Factories\GrowerProductFactory> */
    use HasFactory;

    protected $fillable = ['grower_id', 'product_id', 'unit_price', 'stock'];

    public function grower() {
        return $this->belongsTo( Grower::class );
    }

    public function product() {
        return $this->belongsTo( Product::class );
    }
}