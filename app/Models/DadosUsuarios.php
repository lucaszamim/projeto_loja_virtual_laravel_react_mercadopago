<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DadosUsuarios extends Model
{
    protected $table = 'dados_usuarios';
    protected $primaryKey = 'id';

    // Se não usar created_at / updated_at
    // public $timestamps = false;
     protected $fillable = [
        'id_usuario',
        'endereco_tipo', //casa, trabalho, escola ...
        'endereco_rua',
        'endereco_numero',
        'endereco_bairro',
        'endereco_complemento',
        'endereco_referencia',
        'endereco_cidade',
        'endereco_cep',
        'endereco_id_estado',
        'logs'
    ];

}
