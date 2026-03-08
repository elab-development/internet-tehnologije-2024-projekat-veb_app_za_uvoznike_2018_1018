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
    public function supplier()
    {
        return $this->belongsTo(User::class, 'supplier_id');
    }
    public function importer()
    {
        return $this->belongsTo(User::class, 'importer_id');
    }
}
