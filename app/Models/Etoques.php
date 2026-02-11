<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Etoques extends Model
{
    protected $table = 'estoques';
    protected $primaryKey = 'id';

    // Se não usar created_at / updated_at
    // public $timestamps = false;
    protected $fillable = [
        'id_produto',
        'quantidade',
        'nf',
        'data_compra',
        'data_entrada_estoque',
        'local_estoque',
        'ativo',
        'logs'
    ];
}
