<?php

namespace App\Models;

use App\Notifications\CustomResetPasswordNotification;
// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable {
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'email',
        'password',
        'role',
        'is_active',
        'fcm_token',
        'is_deleted',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',

    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
            'fcm_token' => 'string',
            'is_deleted' => 'boolean',
        ];

    }

    public function grower() {
        return $this->hasOne( Grower::class );
    }

    public function breeder() {
        return $this->hasOne( Breeder::class );
    }

    // Added posts relationship for seeder usage.
    public function posts() {
        return $this->hasMany( Post::class );
    }

    // Relationships
    public function varietyReportsAsGrower() {
        return $this->hasMany( VarietyReport::class, 'grower_id' );
    }

    public function varietyReportsAsBreeder() {
        return $this->hasMany( VarietyReport::class, 'breeder_id' );
    }

    public function sendPasswordResetNotification( $token ) {
        $url = env( 'FRONTEND_URL' ) . '/reset-password?token=' . $token . '&email=' . urlencode( $this->email );
        $this->notify( new CustomResetPasswordNotification( $token, $url ) );
    }
}