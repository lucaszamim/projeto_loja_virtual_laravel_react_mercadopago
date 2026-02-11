<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Vendas;
use App\Models\DetalheVendas;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PedidosController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try{

            $pedidos = Vendas::where('id_comprador', Auth::id())->orderBy('id','desc')->get();

            return inertia('Clientes/Pedidos/Pedidos', [
                'pedidos' => $pedidos,
            ]);

        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Erro!');
        }
    }


    public function detalhesProdutos($pedido)
    {
        try{

            $produtos = DB::table('detalhe_vendas')
            ->join('produtos', 'produtos.id', '=', 'detalhe_vendas.id_produto')
            ->select(
                // PRODUTO
                'detalhe_vendas.id as id',
                'detalhe_vendas.valor as valor',
                'detalhe_vendas.quantidade as quantidade',
                'produtos.nome as produto'
            )
            ->where('detalhe_vendas.id_venda', '=', $pedido)
            ->orderBy('produtos.nome')
            ->get();

            return response()->json($produtos);

        } catch (\Exception $e) {
            return response()->json([
                'error' => true,
                'message' => 'Erro!',
            ]);;
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
