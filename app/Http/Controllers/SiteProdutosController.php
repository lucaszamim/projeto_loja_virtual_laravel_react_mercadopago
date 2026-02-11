<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Produtos;
use App\Models\Categorias;
use App\Models\Subcategorias;
use App\Models\GaleriaProdutos;
use Illuminate\Support\Facades\DB;

class SiteProdutosController extends Controller
{
    //
     public function index()
    {
        try{

            $produtos = Produtos::select('id', 'nome', 'valor')
                ->where('ativo', true)
                ->where('estoque_disponivel', '>', 0)
                ->orderBy('nome')
                ->paginate(15);


           return Inertia::render('Site/Produtos', [
                'produtos' => $produtos,
                'filtros' => null,
            ]);

        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Erro!');
        }
    }

    public function show($id)
    {
        try{

            $produto = DB::table('produtos')
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
            ->where('produtos.id','=',$id)
            ->first();

            $galeria = GaleriaProdutos::where('id_produto', $id)->orderBy('principal','desc')->get();


           return Inertia::render('Site/Produto', [
                'produto' => $produto,
                'galeria' => $galeria,
                'filtros' => null
            ]);

        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Erro!');
        }
    }

    public function categoriasMenu()
    {
        try{

            $categorias = Categorias::with('subcategorias')->orderBy('nome', 'asc')->get();
            return response()->json($categorias);

        } catch (\Exception $e) {
             return response()->json([
                'message' => 'Erro ao definir imagem principal',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    //botão buscar
    public function listarBuscar($filtros = null)
    {
        try {

            $produtos = DB::table('produtos')
            ->join('subcategorias', 'produtos.id_subcategoria', '=', 'subcategorias.id')
            ->join('categorias', 'subcategorias.id_categoria', '=', 'categorias.id')
            ->select(
                // PRODUTO
                'produtos.id as id',
                'produtos.nome as nome',
                'produtos.valor as valor',
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
            ->where('produtos.ativo', true)
            ->where('produtos.estoque_disponivel', '>', 0)
            ->orderBy('produtos.nome')
            ->paginate(9);

            return Inertia::render('Site/Produtos', [
                'produtos' => $produtos,
                'filtros' => $filtros]);

        } catch (\Exception $e) {
           return redirect()->back()
                ->with('error', 'Erro!');
        }
    }

    public function listarSubcategoria($id = null)
    {
        try {

            $produtos = DB::table('produtos')
            ->join('subcategorias', 'produtos.id_subcategoria', '=', 'subcategorias.id')
            ->join('categorias', 'subcategorias.id_categoria', '=', 'categorias.id')
            ->select(
                // PRODUTO
                'produtos.id as id',
                'produtos.nome as nome',
                'produtos.valor as valor'
            )->where('produtos.id_subcategoria','=', $id)
            ->where('produtos.ativo', true)
            ->where('produtos.estoque_disponivel', '>', 0)
            ->orderBy('produtos.nome')
            ->paginate(9);

            $filtros = DB::table('subcategorias')->where('id', $id)->value('nome');

            return Inertia::render('Site/Produtos', [
                'produtos' => $produtos,
                'filtros' => $filtros]);

        } catch (\Exception $e) {
           return redirect()->back()
                ->with('error', 'Erro!');
        }
    }
}
