<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use MercadoPago\MercadoPagoConfig;
use MercadoPago\Client\Payment\PaymentClient;
use App\Models\Vendas;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class MercadoPagoController extends Controller
{
    //Função para consultar os pedidos no mercado pago
    public function consultarMP() {
        try {

            $vendas = Vendas::select('id','payment_id','payment_status')
            ->where('payment_status','like', "%pending%")
            ->orWhere('payment_status','like', "%in_process%")
            ->get();

            MercadoPagoConfig::setAccessToken(config('services.mercadopago.access_token'));
            $mp = new PaymentClient();

            foreach ($vendas as $venda) {

                $payment = $mp->get($venda->payment_id);

                if($payment->status != $venda->payment_status){
                    $update = Vendas::findOrFail($venda->id);
                    $update->update([
                        'payment_status' => $payment->status, //status
                        'status' => helperStatusMP($payment->status),
                    ]);

                }
            }

            return redirect()->back();

        } catch (\Exception $e) {
           return redirect()->back();
       }
    }

    //Função para consultar os pedidos no mercado pago para usuario logado
    public function consultarMPAuthCliente() {
        try {

            $vendas = Vendas::select('id','payment_id','payment_status')
            ->where('id_comprador', auth()->user()->id)
            ->get();

            MercadoPagoConfig::setAccessToken(config('services.mercadopago.access_token'));
            $mp = new PaymentClient();

            foreach ($vendas as $venda) {

                $payment = $mp->get($venda->payment_id);
                if($payment->status != $venda->payment_status){

                    $update = Vendas::findOrFail($venda->id);
                    $update->update([
                        'payment_status' => $payment->status, //status
                        'status' => helperStatusMP($payment->status),
                    ]);

                }
            }

            return redirect()->back();

        } catch (\Exception $e) {
           return redirect()->back();
        }
    }

    //Função para consultar os pedidos no mercado pago
    public function consultarMPTodas() {
        try {

            $vendas = Vendas::select('id','payment_id','payment_status')->get();

            MercadoPagoConfig::setAccessToken(config('services.mercadopago.access_token'));
            $mp = new PaymentClient();

            foreach ($vendas as $venda) {

                $payment = $mp->get($venda->payment_id);
                if($payment->status != $venda->payment_status){

                    $update = Vendas::findOrFail($venda->id);
                    $update->update([
                        'payment_status' => $payment->status, //status
                        'status' => helperStatusMP($payment->status),
                    ]);

                }
            }

            return redirect()->back();

        } catch (\Exception $e) {
           return redirect()->back();
        }
    }

    //Função para cancelar pedidos no mercado pago
    public function cancelarPedidoMP(Request $request){
        try{

            MercadoPagoConfig::setAccessToken(config('services.mercadopago.access_token'));
            $mp = new PaymentClient();

            $pedido = Vendas::select('id','payment_id','payment_status')
            ->where('id','=', $request->id)
            ->first();


             if (!in_array($pedido->payment_status, helperStatusBloqueio('site'))) {
                $payment = $mp->get($pedido->payment_id);

                if ($payment->status === 'pending') {

                    $mp->cancel($pedido->payment_id);

                    // Atualiza status
                    $origem = 'cancelado_mp';
                    if($request->origem === 'cliente'){$origem = 'cancelado_app';}

                    $pedido->update([
                        'payment_status' => 'cancelled', //status
                        'status' => $origem,
                    ]);

                } else {
                    return redirect()->back()->with('warning', 'Não é possivel cancelar, entre em contato com o suporte');
                }

            } else {
                return redirect()->back()->with('warning', 'Não é possivel cancelar, entre em contato com o suporte');
            }


            return redirect()->back()->with('success', 'Pedido cancelado com sucesso!');

        } catch (\Exception $e) {
           return redirect()->back()->with('error', 'Não foi possivel cancelar seu pedido! '.$e);
        }
    }

    //Função para estornar valor dos pedidos no mercado pago
    public function estornarPedidoMP(Request $request){
        try{

            MercadoPagoConfig::setAccessToken(config('services.mercadopago.access_token'));
            $mp = new PaymentClient();

            $pedido = Vendas::select('id','payment_id','payment_status')
            ->where('id','=', $request->id)
            ->first();

             if (in_array($pedido->payment_status, helperStatusBloqueio('mp'))) {
                $payment = $mp->get($pedido->payment_id);

                if ($payment->status === 'approved') {

                    $mp->refund($pedido->payment_id);
                    $pedido->update([
                        'payment_status' => 'charged_back', //status
                        'status' => 'estornado',
                    ]);

                } else {
                    return redirect()->back()->with('warning', 'Não é possivel estornar, pagamento não efetuado - entre em contato com o suporte');
                }

            } else {
                return redirect()->back()->with('warning', 'Não é possivel estornar, verefique pagamento - entre em contato com o suporte');
            }


            return redirect()->back()->with('success', 'Valor estornado com sucesso!');

        } catch (\Exception $e) {
           return redirect()->back()->with('error', 'Não foi possivel estornar o valor! '.$e);
        }
    }

    //visualiza o pagamento no mp
    public function paymentMP($id){
        MercadoPagoConfig::setAccessToken(config('services.mercadopago.access_token'));
        $mp = new PaymentClient();
        dd($mp->get($id));
    }








    //vem do mercado pago, atualizações automáticas
    public function webhooks(Request $request){
        try{

            MercadoPagoConfig::setAccessToken(config('services.mercadopago.access_token'));
            $mp = new PaymentClient();

            $payment_id = data_get($request->all(), 'data.id');

            if (!$payment_id) {
                return response()->json(['error' => 'payment_id não informado'], 400);
            }

            $payment = $mp->get($payment_id);
            $pedido = Vendas::select('id','payment_id','payment_status')
            ->where('payment_external_reference', $payment->external_reference)
            ->where('payment_id','=', $payment->id)
            ->first();

            if (!$pedido) {
                Log::warning('Pedido não encontrado', [
                    'external_reference' => $payment->external_reference
                ]);
                return response()->json(['error' => 'Pedido não encontrado'], 404);
            }

        // Atualiza status
        if ($payment->status != $pedido->payment_status) {
            $pedido->update([
                 'payment_status' => $payment->status, //status
                 'status' => helperStatusMP($payment->status),
            ]);
        }

        return response()->json(['status' => 'ok']);

        } catch (\Exception $e) {
           return response()->json(['error' => 'Erro de verificação'], 404);
        }
    }

}
