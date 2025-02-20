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

    public function varietyReport() {
        return $this->belongsTo( VarietyReport::class );
    }
}