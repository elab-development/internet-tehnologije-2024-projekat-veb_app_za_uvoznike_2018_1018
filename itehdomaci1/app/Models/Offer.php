<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Offer extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'valid_until',
        'supplier_id',
    ];

    public function supplier()
    {
        return $this->belongsTo(User::class, 'supplier_id');
    }
}
