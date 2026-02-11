<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Produtos;
use App\Models\Categorias;
use App\Models\Subcategorias;
use Illuminate\Support\Facades\DB;

class ProdutosController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {

            $produtos = DB::table('produtos')
            ->join('subcategorias', 'produtos.id_subcategoria', '=', 'subcategorias.id')
            ->join('categorias', 'subcategorias.id_categoria', '=', 'categorias.id')
            ->select(
                // PRODUTO
                'produtos.id as produto_id',
                'produtos.nome as produto_nome',
                'produtos.descricao as produto_descricao',
                'produtos.valor as produto_valor',
                'produtos.estoque_disponivel as produto_estoque_disponivel',
                'produtos.id_subcategoria as produto_id_subcategoria',
                'produtos.marca as produto_marca',
                'produtos.modelo as produto_modelo',
                'produtos.linha as produto_linha',
                'produtos.cor as produto_cor',
                'produtos.tamanho as produto_tamanho',
                'produtos.material as produto_material',
                'produtos.data_fabricacao as produto_data_fabricacao',
                'produtos.data_vencimento as produto_data_vencimento',
                'produtos.genero as produto_genero',
                'produtos.idade as produto_idade',
                'produtos.conteudo_embalagem as produto_conteudo_embalagem',
                'produtos.condicoes as produto_condicoes',
                'produtos.tamanhos as produto_tamanhos',
                'produtos.peso as produto_peso',
                'produtos.desconto as produto_desconto',
                'produtos.etiqueta as produto_etiqueta',
                'produtos.ativo as produto_ativo',

                // SUBCATEGORIA
                'subcategorias.id as subcategoria_id',
                'subcategorias.nome as subcategoria_nome',

                // CATEGORIA
                'categorias.id as categoria_id',
                'categorias.nome as categoria_nome'
            )
            ->orderBy('produtos.ativo', 'desc')
            ->orderBy('produtos.nome', 'asc')
            ->paginate(5);

            $subcategorias = Subcategorias::select('id', 'nome', 'id_categoria')
                        ->where('ativo','=',true)
                        ->orderBy('nome', 'asc')
                        ->get();

            $categorias = Categorias::select('id', 'nome')
                ->where('ativo', true)
                ->orderBy('nome')
                ->get();

            return Inertia::render('Administradores/Produtos/Produtos', [
                'produtos' => $produtos,
                'subcategorias' => $subcategorias,
                'categorias' => $categorias,
                'filtros' => null]);
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
        //pode se usar Usar FormRequest: php artisan make:request StoreCategoriaRequest
         $data = $request->validate([
                    'nome' => 'required|string|max:255',
                    'descricao' => 'nullable|string',
                    'valor' => 'required|numeric|min:0',
                    'estoque_disponivel' => 'required|integer|min:0',
                    'id_subcategoria' => 'required|exists:subcategorias,id',
                    'marca' => 'nullable|string|max:255',
                    'modelo' => 'nullable|string|max:255',
                    'linha' => 'nullable|string|max:255',
                    'cor' => 'nullable|string|max:100',
                    'tamanho' => 'nullable|string|max:50',
                    'material' => 'nullable|string|max:100',
                    'data_fabricacao' => 'nullable|date',
                    'data_vencimento' => 'nullable|date|after_or_equal:data_fabricacao',
                    'genero' => 'nullable|string|max:50',
                    'idade' => 'nullable|string|max:50',
                    'conteudo_embalagem' => 'nullable|string',
                    'condicoes' => 'nullable|string',
                    'tamanhos' => 'nullable|string',
                    'peso' => 'nullable|numeric|min:0',
                    'etiqueta' => 'nullable|string|max:255',
                ],[
            'nome.required' => 'O nome do produto é obrigatório.',
            'nome.max' => 'O nome da subcategoria pode ter no máximo 255 caracteres.',
            'nome.required' => 'A subcategoria é obrigatório.',
            'after_or_equal' =>'Data de vencimento não pode ser aterior à de fabricação'
        ]);
        try{

            Produtos::create($data);

            return redirect()->back()
                ->with('success', 'Categoria criada com sucesso!');

        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Erro!');
        }
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
        //pode se usar Usar FormRequest: php artisan make:request StoreCategoriaRequest
         $data = $request->validate(
            [
                'nome' => 'required|string|max:255',
                'descricao' => 'nullable|string',
                'valor' => 'required|numeric|min:0',
                'estoque_disponivel' => 'required|min:0',
                'id_subcategoria' => 'required|exists:subcategorias,id',
                'marca' => 'nullable|string|max:255',
                'modelo' => 'nullable|string|max:255',
                'linha' => 'nullable|string|max:255',
                'cor' => 'nullable|string|max:100',
                'tamanho' => 'nullable|string|max:50',
                'material' => 'nullable|string|max:100',
                'data_fabricacao' => 'nullable|date',
                'data_vencimento' => 'nullable|date|after_or_equal:data_fabricacao',
                'genero' => 'nullable|string|max:50',
                'idade' => 'nullable|string|max:50',
                'conteudo_embalagem' => 'nullable|string',
                'condicoes' => 'nullable|string|max:50',
                'tamanhos' => 'nullable|string|max:50',
                'peso' => 'nullable|numeric|min:0',
                'etiqueta' => 'nullable|string|max:255',
            ],
            [
                'nome.required' => 'O nome do produto é obrigatório.',
                'nome.max' => 'O nome do produto pode ter no máximo 255 caracteres.',

                'valor.required' => 'O valor é obrigatório.',
                'valor.numeric' => 'O valor deve ser numérico.',

                'estoque_disponivel.required' => 'O estoque é obrigatório.',

                'id_subcategoria.required' => 'A subcategoria é obrigatória.',
                'id_subcategoria.exists' => 'Subcategoria inválida.',

                'data_vencimento.after_or_equal' =>
                    'A data de vencimento não pode ser anterior à data de fabricação.',
            ]
        );

        try {
            $produto = Produtos::findOrFail($id);
            $produto->update($data);

            return redirect()
                ->back()
                ->with('success', 'Produto atualizado com sucesso!');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->with('error', 'Erro ao salvar o produto.');
        }

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function situacao(Produtos $produto)
    {
        try{
            $produto->update([
                'ativo' => ! $produto->ativo
            ]);


            return response()->json([
                'success' => true,
                'ativo' => $produto->ativo,
                'message' => 'Situação do produto alterada com sucesso!',
            ]);

        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->with('error', 'Erro ao salvar o produto.');
        }
    }

    public function filtros($filtros = null)
    {
        try {

            $produtos = DB::table('produtos')
            ->join('subcategorias', 'produtos.id_subcategoria', '=', 'subcategorias.id')
            ->join('categorias', 'subcategorias.id_categoria', '=', 'categorias.id')
            ->select(
                // PRODUTO
                'produtos.id as produto_id',
                'produtos.nome as produto_nome',
                'produtos.descricao as produto_descricao',
                'produtos.valor as produto_valor',
                'produtos.estoque_disponivel as produto_estoque_disponivel',
                'produtos.id_subcategoria as produto_id_subcategoria',
                'produtos.marca as produto_marca',
                'produtos.modelo as produto_modelo',
                'produtos.linha as produto_linha',
                'produtos.cor as produto_cor',
                'produtos.tamanho as produto_tamanho',
                'produtos.material as produto_material',
                'produtos.data_fabricacao as produto_data_fabricacao',
                'produtos.data_vencimento as produto_data_vencimento',
                'produtos.genero as produto_genero',
                'produtos.idade as produto_idade',
                'produtos.conteudo_embalagem as produto_conteudo_embalagem',
                'produtos.condicoes as produto_condicoes',
                'produtos.tamanhos as produto_tamanhos',
                'produtos.peso as produto_peso',
                'produtos.desconto as produto_desconto',
                'produtos.etiqueta as produto_etiqueta',
                'produtos.ativo as produto_ativo',

                // SUBCATEGORIA
                'subcategorias.id as subcategoria_id',
                'subcategorias.nome as subcategoria_nome',

                // CATEGORIA
                'categorias.id as categoria_id',
                'categorias.nome as categoria_nome'
            )->when($filtros, function ($q) use ($filtros) {
                $q->where(function ($q) use ($filtros) {
                    $q->where('produtos.nome', 'like', "%{$filtros}%")
                    ->orWhere('produtos.descricao', 'like', "%{$filtros}%")
                    ->orWhere('produtos.marca', 'like', "%{$filtros}%")
                    ->orWhere('produtos.linha', 'like', "%{$filtros}%")
                    ->orWhere('produtos.modelo', 'like', "%{$filtros}%")
                    ->orWhere('produtos.tamanho', 'like', "%{$filtros}%")
                    ->orWhere('produtos.cor', 'like', "%{$filtros}%")
                    ->orWhere('produtos.material', 'like', "%{$filtros}%")
                    ->orWhere('produtos.genero', 'like', "%{$filtros}%")
                    ->orWhere('produtos.idade', 'like', "%{$filtros}%")
                    ->orWhere('produtos.etiqueta', 'like', "%{$filtros}%")
                    ->orWhere('subcategorias.nome', 'like', "%{$filtros}%")
                    ->orWhere('categorias.nome', 'like', "%{$filtros}%");
                });
            })
            ->orderBy('produtos.ativo', 'desc')
            ->orderBy('produtos.nome', 'asc')
            ->paginate(5);

            $subcategorias = Subcategorias::select('id', 'nome', 'id_categoria')
                        ->where('ativo','=',true)
                        ->orderBy('nome', 'asc')
                        ->get();

            $categorias = Categorias::select('id', 'nome')
                ->where('ativo', true)
                ->orderBy('nome')
                ->get();

            return Inertia::render('Administradores/Produtos/Produtos', [
                'produtos' => $produtos,
                'subcategorias' => $subcategorias,
                'categorias' => $categorias,
                'filtros' => $filtros]);
        } catch (\Exception $e) {
           return redirect()->back()
                ->with('error', 'Erro!');
        }
    }

}
