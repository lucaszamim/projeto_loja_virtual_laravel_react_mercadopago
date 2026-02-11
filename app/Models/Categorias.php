<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Categorias extends Model
{
    protected $table = 'categorias';
    protected $primaryKey = 'id';

    // Se não usar created_at / updated_at
    // public $timestamps = false;
    protected $fillable = [
        'nome',
        'descricao',
        'ativo',
        'logs'
    ];


    public function subcategorias() {
        return $this->hasMany(Subcategorias::class, 'id_categoria')->orderBy('nome', 'asc');
    }
}
