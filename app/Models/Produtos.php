<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Produtos extends Model
{
    protected $table = 'produtos';
    protected $primaryKey = 'id';

    // Se não usar created_at / updated_at
    // public $timestamps = false;
    protected $fillable = [
        'nome',
        'descricao',
        'valor',
        'estoque_disponivel',
        'id_subcategoria',
        'marca',
        'modelo',
        'linha',
        'cor',
        'tamanho',
        'material',
        'data_fabricacao',
        'data_vencimento',
        'genero',
        'idade',
        'conteudo_embalagem',
        'condicoes',
        'tamanhos',
        'peso',
        'desconto',
        'etiqueta',
        'ativo',
        'logs'
    ];
}
