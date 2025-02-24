<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductionReport extends Model {

    protected $fillable = [
        'grower_id',
        'submission_date',
        'data',
        'quarter',
        'year',
        'quarters_array',
    ];

    protected $casts = [
        'submission_date' => 'datetime',
        'data' => 'json',
        'quarters_array' => 'array',
    ];

    public function grower() {
        return $this->belongsTo( Grower::class );
    }

}