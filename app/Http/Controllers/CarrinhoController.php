<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Produtos;
use Illuminate\Support\Facades\DB;

class CarrinhoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try{

            return inertia('Site/Carrinho', [
                 'carrinho' => collect(session()->get('cart', []))
                    ->sortBy('nome')
                    ->values()
            ]);

        } catch (\Exception $e) {
           return redirect()->back()
                ->with('error', 'Erro!');
        }
    }

    public function adicionar(Request $request)
    {

    $request->validate([
            'produto_id' => 'required|exists:produtos,id',
            'quantidade' => 'required|integer|min:1',
    ]);

    try{

        $produto = Produtos::findOrFail($request->produto_id);
        $carrinho = session()->get('cart', []);

        if (isset($carrinho[$produto->id])) {
            $carrinho[$produto->id]['quantidade'] += $request->quantidade;
        } else {
            $carrinho[$produto->id] = [
                'id' => $produto->id,
                'nome' => $produto->nome,
                'preco' => $produto->valor,
                'quantidade' => $request->quantidade,
            ];
        }

        session()->put('cart', $carrinho);
        return back()->with('success', 'Produto adicionado ao carrinho');

    } catch (\Exception $e) {
           return redirect()->back()
                ->with('error', 'Erro!');
    }
}

    //excluir tudo
    public function excluir(Request $request)
    {
        try{
            $cart = session()->get('cart', []);
            unset($cart[$request->produto_id]);
            session()->put('cart', $cart);

            return back();
        } catch (\Exception $e) {
           return redirect()->back()
                ->with('error', 'Erro!');
        }
    }


    public function aumentar(Request $request)
    {
        try{
            $produtoId = $request->produto_id;

            $cart = session()->get('cart', []);

            // Se o produto não existir no carrinho, adiciona
            if (!isset($cart[$produtoId])) {
                $produto = Produto::findOrFail($produtoId);

                $cart[$produtoId] = [
                    'id' => $produto->id,
                    'nome' => $produto->nome,
                    'preco' => $produto->valor,
                    'quantidade' => 1,
                ];
            } else {
                // Se já existe, aumenta a quantidade
                $cart[$produtoId]['quantidade']++;
            }

            session()->put('cart', $cart);

            return back()->with('success', 'Produto atualizado');
        } catch (\Exception $e) {
           return redirect()->back()
                ->with('error', 'Erro!');
        }
    }

    public function diminuir(Request $request)
    {
        try{
            $produtoId = $request->produto_id;

            $cart = session()->get('cart', []);

            if (!isset($cart[$produtoId])) {
                return redirect()->back();
            }

            // Diminui quantidade
            $cart[$produtoId]['quantidade']--;

            // Se chegou a 0, remove
            if ($cart[$produtoId]['quantidade'] <= 0) {
                unset($cart[$produtoId]);
            }

            session()->put('cart', $cart);

            return back()->with('success', 'Produto atualizado');
        } catch (\Exception $e) {
           return redirect()->back()
                ->with('error', 'Erro!');
        }
    }

    public function remover(Request $request)
    {
        try{
            $produtoId = $request->produto_id;

            $cart = session()->get('cart', []);

            if (isset($cart[$produtoId])) {
                unset($cart[$produtoId]);
                session()->put('cart', $cart);
            }

        return back()->with('success', 'Produto removido');

       } catch (\Exception $e) {
           return redirect()->back()
                ->with('error', 'Erro!');
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
