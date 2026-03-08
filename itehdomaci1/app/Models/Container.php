<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Container extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'max_capacity',
        'max_dimensions',
        'total_import_cost',
        'importer_id',
        'status', // npr. 'pending', 'shipped', 'delivered'
    ];

    public function importer()
    {
        return $this->belongsTo(User::class, 'importer_id');
    }
}
