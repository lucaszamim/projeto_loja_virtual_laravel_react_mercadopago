<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DetalheVendas extends Model
{
    protected $table = 'detalhe_vendas';
    protected $primaryKey = 'id';

    // Se não usar created_at / updated_at
    // public $timestamps = false;
    protected $fillable = [
        'id_venda',
        'id_produto',
        'quantidade',
        'valor',
        'logs',
    ];
}
