<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

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
}