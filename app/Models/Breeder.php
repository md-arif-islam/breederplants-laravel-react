<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Breeder extends Model {
    use HasFactory;

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
    ];

    public function user() {
        return $this->belongsTo( User::class );
    }

}