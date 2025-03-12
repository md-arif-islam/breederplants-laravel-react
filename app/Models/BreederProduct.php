<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BreederProduct extends Model {
    /** @use HasFactory<\Database\Factories\BreederProductFactory> */
    use HasFactory;

    protected $fillable = ['breeder_id', 'product_id'];

    public function breeder() {
        return $this->belongsTo( Breeder::class );
    }

    public function product() {
        return $this->belongsTo( Product::class );
    }
}
