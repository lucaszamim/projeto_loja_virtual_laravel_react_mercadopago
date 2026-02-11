<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\DadosUsuarios;
use App\Models\Estados;
use App\Models\Vendas;
use App\Models\DetalheVendas;
use MercadoPago\MercadoPagoConfig;
use MercadoPago\Client\Payment\PaymentClient;
use Illuminate\Support\Carbon;

class CheckoutController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try{

            //se carrinho estiver vazio
            if (empty($carrinho = session('cart', []))) {
                return redirect()
                    ->route('produtos.site.index')
                    ->with('warning', 'Seu carrinho está vazio, selecione ao menos um produto.');
            }

            $user = Auth::user();
            $enderecos = DadosUsuarios::where('id_usuario', $user->id)->get();

            return inertia('Clientes/Checkout/Checkout', [
                 'carrinho' => collect(session()->get('cart', []))
                    ->sortBy('nome')
                    ->values(),
                 'user' => $user,
                 'enderecos' => $enderecos
            ]);

        } catch (\Exception $e) {
           return redirect()->back()
                ->with('error', 'Erro!');
        }
    }


    public function finalizar(Request $request)
    {

        $request->validate([
            'endereco_id' => 'required',
            'forma_pagamento' => 'required|string',
            'cpf' => 'required|string',
            'observacao_entrega' => 'nullable|string',
            
        ], [

            'endereco_id.required' => 'Selecione um endereço de entrega.',
            'forma_pagamento.required' => 'Selecione uma forma de pagamento.',
            'cpf.required' => 'O CPF é obrigatório.',
            'cpf.string' => 'CPF inválido.',
        ]);


        //venda
        try {

            $cart = session()->get('cart', []);
            $pedido_codigo_externo = auth()->user()->id . '' . now()->format('dmYHis');
            $total_cart = collect($cart)->sum(function ($item) {
                return $item['preco'] * $item['quantidade'];
            });

            //endereco
            $endereco = DadosUsuarios::findOrFail($request->endereco_id);
            $estado = Estados::findOrFail($endereco->endereco_id_estado);
            $endereco_envio = $endereco->endereco_rua . ', ' . $endereco->endereco_numero . ', ' . $endereco->endereco_bairro .
                ', ' . $endereco->endereco_complemento . ', ' . $endereco->endereco_cidade . ', ' . $estado->nome . ' - ' . $endereco->endereco_cep.
                '. Ref.: '. $endereco->endereco_referencia;

                //venda
            $venda = null;
            $venda = Vendas::create([
                'id_comprador' => auth()->user()->id,
                'data_venda' => Carbon::now(),
                'valor_total' => $total_cart,
                'desconto' => 0,
                'valor_final' => ($total_cart),
                'link_nf' => null,
                'meio_envio' => null,
                'codigo_rastreio' => null,
                'link_rastreio' => null,
                'progresso_envio' => null,
                'endereco_envio' => $endereco_envio,
                'observacao_entrega' => $request->observacao_entrega,
                'status' => 'pendente',
                'ativo' => true,
                'payment_id' => null, //id
                'payment_method' => $request->forma_pagamento,
                'payment_type' => null, //tipo de pagamento
                'payment_status' => null, //status
                'payment_url' => null, //url caso direcionar para o ml
                'payment_qr_code' => null, //qr-codigo
                'payment_qr_code_base64' => null,// qr
                'payment_boleto_url' => null, //url boleto
                'payment_barcode' => null, //boleto codigo de barras
                'payment_external_reference'=>$pedido_codigo_externo,
                'logs'=>null,
            ]);


            //mp - payment
            $cpf = preg_replace('/[^0-9]/', '', $request->cpf);
            $nome = explode(' ', auth()->user()->name);
            $primeiro = $nome[0];
            $ultimo = end($nome);
            $payment = null;

            if (!preg_match('/^\d{11}$/', $cpf)) {
                throw new \Exception('CPF inválido para pagamento.');
            }

            try {
                //GERAR PAGAMENTO
                MercadoPagoConfig::setAccessToken(config('services.mercadopago.access_token'));
                $client = new PaymentClient();

                if ($request->forma_pagamento === 'pix') { //PIX

                    $payment = $client->create([
                        "transaction_amount" => (float)$total_cart,
                        "description" => "Pedido {$pedido_codigo_externo}",
                        "payment_method_id" => "pix",
                        "external_reference" => $pedido_codigo_externo,
                        "payer" => [
                            "email" => auth()->user()->email,
                            "first_name" => "{$primeiro}",
                            "last_name" => "{$ultimo}",
                            "identification" => [
                                "type" => "CPF",
                                "number" => "{$cpf}"
                            ]
                        ]
                    ]);

                    if ($payment->id && $payment->id > 0) {
                        $update = Vendas::findOrFail($venda->id);
                        $update->update([
                            'payment_id' => $payment->id, //id
                            'payment_method' => 'pix', //metodo de pagamento
                            'payment_status' => $payment->status, //status
                            'payment_qr_code' => $payment->point_of_interaction->transaction_data->qr_code, //qr-codigo
                            'payment_qr_code_base64' => $payment->point_of_interaction->transaction_data->qr_code_base64,// qr
                        ]);
                    }

                } else { //BOLETO
                    $cep = preg_replace('/[^0-9]/', '', $endereco->endereco_cep);
                    $payment = $client->create([
                        "transaction_amount" => (float)$total_cart,
                        "description" => "Pedido {$pedido_codigo_externo}",
                        "payment_method_id" => "bolbradesco",
                        "external_reference" => $pedido_codigo_externo,
                        "date_of_expiration" => now()->addDays(3)->format('Y-m-d\TH:i:s.000P'),
                        "payer" => [
                            "email" => auth()->user()->email,
                            "first_name" => "{$primeiro}",
                            "last_name" => "{$ultimo}",
                            "identification" => [
                                "type" => "CPF",
                                "number" => "{$cpf}"
                            ],
                            "address" => [
                                "zip_code" => "{$cep}",
                                "street_name" => "{$endereco->endereco_rua}",
                                "street_number" => $endereco->endereco_numero,
                                "neighborhood" => "{$endereco->endereco_bairro}",
                                "city" => "{$endereco->endereco_cidade}",
                                "federal_unit" => "{$estado->uf}"
                            ]
                        ]
                    ]);

                   if ($payment->id && $payment->id > 0) {
                        $update = Vendas::findOrFail($venda->id);
                        $update->update([
                            'payment_id' => $payment->id, //id
                            'payment_method' => 'boleto', //metodo de pagamento
                            'payment_status' => $payment->status, //status
                            'payment_boleto_url' => $payment->transaction_details->external_resource_url, //url boleto
                            'payment_barcode' => $payment->transaction_details->digitable_line ?? null, //boleto codigo de barras
                        ]);
                    }
                }

            } catch (\MercadoPago\Exceptions\MPApiException $e) {
                //deletar venda salva
                Vendas::destroy($venda->id);
                return redirect()->back()
                    ->with('error', 'Erro de comunicação com o Mercado Pago: ' . $e);
            }

            //dd($payment);
            try {
                //detalhe vendas
                $dvenda = null;
                foreach ($cart as $produto_id => $item) {
                    $dvenda = DetalheVendas::create([
                        'id_venda' => $venda->id,
                        'id_produto' => $item['id'],
                        'quantidade' => $item['quantidade'],
                        'valor' => $item['preco'],
                    ]);
                }
            } catch (\Exception $e) {
                session()->forget('cart');
                if($request->forma_pagamento === 'pix') {
                    return inertia('Clientes/Checkout/FinalizadoPix', [
                        'venda' => Vendas::findOrFail($venda->id),
                        'status' => 'sucesso',
                    ]);
                }

                return inertia('Clientes/Checkout/FinalizadoBoleto', [
                    'venda' => Vendas::findOrFail($venda->id),
                    'status' => 'sucesso',
                ]);
            }

            // elimina o carrinho
            session()->forget('cart');

            if($request->forma_pagamento === 'pix') {
                return inertia('Clientes/Checkout/FinalizadoPix', [
                    'venda' => Vendas::findOrFail($venda->id),
                    'status' => 'sucesso',
                ]);
            }

            return inertia('Clientes/Checkout/FinalizadoBoleto', [
                'venda' => Vendas::findOrFail($venda->id),
                'status' => 'sucesso',
            ]);

        } catch (\Exception $e) {
            return redirect()->back()
            ->with('error', 'Erro ao finalizar a venda ' . $e);
       }
    }



    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
