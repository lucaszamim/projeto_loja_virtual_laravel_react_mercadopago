<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subcategorias extends Model
{
    protected $table = 'subcategorias';
    protected $primaryKey = 'id';

    // Se não usar created_at / updated_at
    // public $timestamps = false;
    protected $fillable = [
        'nome',
        'descricao',
        'ativo',
        'id_categoria',
        'logs'
    ];


    public function categoria() {
        return $this->belongsTo(Categorias::class, 'id_categoria')->orderBy('nome', 'asc');
    }
}
