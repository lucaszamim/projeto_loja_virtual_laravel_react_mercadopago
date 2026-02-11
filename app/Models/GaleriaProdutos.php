<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GaleriaProdutos extends Model
{
    protected $table = 'galeria_produtos';
    protected $primaryKey = 'id';

    // Se não usar created_at / updated_at
    // public $timestamps = false;
    protected $fillable = [
        'id_produto',
        'link_imagem',
        'principal',
        'ativo',
        'logs'
    ];
}
