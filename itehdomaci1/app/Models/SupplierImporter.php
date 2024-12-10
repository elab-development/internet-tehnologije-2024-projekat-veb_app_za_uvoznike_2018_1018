<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SupplierImporter extends Model
{
    use HasFactory;

    protected $fillable = [
        'supplier_id',
        'importer_id',
    ];

    public $timestamps = false;

    
}
