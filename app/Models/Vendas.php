<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vendas extends Model
{
    protected $table = 'vendas';
    protected $primaryKey = 'id';

    // Se não usar created_at / updated_at
    // public $timestamps = false;
    protected $fillable = [
        'id_comprador',
        'data_venda',
        'valor_total',
        'desconto',
        'valor_final',
        'link_nf',
        'meio_envio',
        'codigo_rastreio',
        'link_rastreio',
        'progresso_envio',
        'endereco_envio',
        'observacao_entrega',
        'status',
        'ativo',
        'payment_id', //id
        'payment_method', //pix, cc, bolet
        'payment_type',
        'payment_status', //status
        'payment_url', //url caso direcionar para o ml
        'payment_qr_code', //qr-codigo
        'payment_qr_code_base64',// qr
        'payment_boleto_url', //url boleto
        'payment_barcode', //boleto codigo de barras
        'payment_external_reference', //codigo da loja para referencia
        'logs',
    ];
}
