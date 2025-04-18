<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Grower extends Model {
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'username',
        'company_name',
        'company_email',
        'contact_person',
        'street',
        'city',
        'postal_code',
        'country',
        'phone',
        'website',
        'agreement_number',
        'sales_reporting_quarter',
        'production_reporting_quarter',
        'production_reporting_values',
    ];

    public function user() {
        return $this->belongsTo( User::class );
    }
}