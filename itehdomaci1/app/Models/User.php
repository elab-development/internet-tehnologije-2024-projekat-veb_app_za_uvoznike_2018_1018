<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable; // Važno: Nasleđuje se od Authenticatable
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; // ili Passport/Airlock/Jetstream, po potrebi

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Polja koja se mogu masovno dodeljivati.
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',       // 'admin', 'supplier', 'importer'
        'company_name', 
        'contact_person',
        'phone',
        'address',
        'country'
    ];

    /**
     * Polja koja će biti skrivena u JSON odgovorima.
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Mutator za password - da se automatski hešuje.
     */
    public function setPasswordAttribute($password)
    {
        $this->attributes['password'] = bcrypt($password);
    }

    /**
     * Pomoćne metode za role:
     */
    public function isAdmin()
    {
        return $this->role === 'admin';
    }

    public function isSupplier()
    {
        return $this->role === 'supplier';
    }

    public function isImporter()
    {
        return $this->role === 'importer';
    }
}
