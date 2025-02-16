<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SalesReport extends Model {
    /** @use HasFactory<\Database\Factories\SalesReportFactory> */
    use HasFactory;

    protected $fillable = [
        'grower_id',
        'submission_date',
        'data',
        'quarter',
        'year',
        'quarters_array',
        'total',
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