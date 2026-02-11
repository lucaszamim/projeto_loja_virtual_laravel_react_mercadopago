<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Estados extends Model
{
    protected $table = 'estados';
    protected $primaryKey = 'id';

    // Se não usar created_at / updated_at
    // public $timestamps = false;
    protected $fillable = [
        'uf',
        'nome',
        'logs'
    ];
}
