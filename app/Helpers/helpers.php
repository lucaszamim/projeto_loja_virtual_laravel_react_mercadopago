<?php

if (!function_exists('helperStatusMP')) {
    function helperStatusMP($status){
        try{
            // processando, pendente, pago, enviado, entregue, rma, cancelado_mp, cancelado_app, estornado, concluido
            if($status === 'in_process'){
                return 'processando';
            } else if($status === 'pending'){
                return 'pendente';
            } else if($status === 'failure'){
                return 'cancelado_mp'; //cancelado pelo mp
            } else if($status === 'rejected' || $status === 'refunded'){
                return 'cancelado_mp'; //cancelado pelo mp
            } else if($status === 'cancelled'){
                return 'cancelado_app'; //cancelado pelo vendedor ou cliente
            } else if($status === 'charged_back' || $status === 'chargeback'){
                return 'estornado';
            } else
                return 'pago';

        } catch (\Exception $e) {
            return 'pendente';
        }
    }
}

if (!function_exists('helperStatusBloqueio')) {
    function helperStatusBloqueio($id){
        try{

            $status = null;
            if($id === 'todos'){ //todos
                $status = ['processando', 'pendente', 'pago', 'enviado', 'entregue', 'rma', 'cancelado_mp', 'cancelado_app', 'estornado', 'concluido'];
            } else if($id === 'mp'){ //mp
                $status = ['processando', 'pendente', 'pago'];
            } else if($id === 'site'){
                $status = ['enviado', 'entregue', 'rma', 'cancelado_mp', 'cancelado_app', 'estornado', 'concluido'];
            } else {
                $status = null;
            }

            return $status;

        } catch (\Exception $e) {
            return null;
        }
    }
}
