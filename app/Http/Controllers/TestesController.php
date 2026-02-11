<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use MercadoPago\MercadoPagoConfig;
use MercadoPago\Client\Payment\PaymentClient;

class TestesController extends Controller
{
    //testar mp
    public function testarPaymentIdMP($id){

        MercadoPagoConfig::setAccessToken(config('services.mercadopago.access_token'));
        $mp = new PaymentClient();
        $payment = $mp->get($id);
        dd($payment);

    }
}
