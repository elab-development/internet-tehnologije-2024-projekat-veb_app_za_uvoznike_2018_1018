<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'image_path',
        'dimensions',
        'features',
        'price',
        'category',
        'supplier_id', // ID dobavljača koji nudi proizvod
    ];

    public function supplier()
    {
        return $this->belongsTo(User::class, 'supplier_id');
    }
}
