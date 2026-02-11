<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Vendas;
use App\Models\DetalheVendas;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;


class VendasController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try{

            $vendas = Vendas::orderBy('id','desc')->paginate(8);

            return inertia('Administradores/Vendas/Vendas', [
                'vendas' => $vendas,
            ]);

        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Erro!');
        }
    }


    /**
     * envio
    */
    public function envio(Request $request)
    {
         $request->validate([
            'meio_envio' => 'required|string',
            'codigo_rastreio' => 'nullable|string',
            'status' => 'nullable|string',
        ]);

        try {

            $venda = Vendas::findOrFail($request->id);
            $venda->update([
                'meio_envio' => $request->meio_envio,
                'codigo_rastreio' => $request->codigo_rastreio,
                'status' => $request->status,
            ]);

            return redirect()
                ->back()
                ->with('success', 'Envio atualizado com sucesso!');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->with('error', 'Erro ao atualizar envio.');
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
        try {

            $venda = Vendas::where('id',$id)->get();
            $produtos = DB::table('detalhe_vendas')
                ->join('vendas', 'vendas.id', '=', 'detalhe_vendas.id_venda')
                ->join('produtos', 'detalhe_vendas.id_produto', '=', 'produtos.id')
                ->select(
                    // PRODUTO
                    'produtos.nome as produto_nome',
                    'detalhe_vendas.id as id',
                    'detalhe_vendas.quantidade as quantidade',
                    'detalhe_vendas.valor as valor',
                    )
                ->where('detalhe_vendas.id_venda', '=', $id)
                ->get();

            $cliente = DB::table('vendas')
                ->join('users', 'vendas.id_comprador', '=', 'users.id')
                ->select(
                    // PRODUTO
                    'users.id as id',
                    'users.name as name',
                    'users.email as email',
                    )
                ->where('vendas.id', '=', $id)
                ->get();


            return inertia('Administradores/Vendas/Detalhes', [
                'venda' => $venda,
                'produtos' => $produtos,
                'cliente' => $cliente
            ]);
            
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->with('error', 'Erro ao exibir detalhes do produto.');
       }
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
