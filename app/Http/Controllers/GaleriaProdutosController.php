<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\GaleriaProdutos;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\JsonResponse;

class GaleriaProdutosController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
         $request->validate([
            'produto_id' => 'required|exists:produtos,id',
            'imagens' => 'required|array',
            'imagens.*' => 'image|max:1024|mimes:jpg,jpeg,png,webp',
            'imagem_principal' => 'nullable|integer',
        ]);

        try{
            $imagensSalvas = [];

            foreach ($request->file('imagens', []) as $index => $file) {
                $caminho = $file->store('produtos', 'public');

                $galeria = GaleriaProdutos::create([
                    'id_produto' => $request->produto_id,
                    'link_imagem' => Storage::url($caminho),
                    'principal' => false,
                ]);

                $imagensSalvas[] = $galeria;
            }

            // Definir imagem principal
            if ($request->filled('imagem_principal')) {
                $indexPrincipal = $request->imagem_principal;
                if (isset($imagensSalvas[$indexPrincipal])) {
                    // Primeiro, remover principal de todas as imagens do produto
                    GaleriaProdutos::where('id_produto', $request->produto_id)->update(['principal' => false]);

                    $imagensSalvas[$indexPrincipal]->update(['principal' => true]);
                }
            }

            // Retornar todas as imagens atualizadas do produto
            $galeriaProduto = GaleriaProdutos::where('id_produto', $request->produto_id)->get();
            return response()->json($galeriaProduto);

        } catch (\Exception $e) {
            return response()->json([
            'error' => true,
            'message' => $e->getMessage(),
        ], 500);
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
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(GaleriaProdutos $imagem): JsonResponse
    {
        try {

            $produto_id = $imagem->id_produto;
            $se_principal = $imagem->principal;

            // 🔹 Deletar arquivo físico
            if ($imagem->link_imagem) {
                // /storage/produtos/xxx.webp → produtos/xxx.webp
                $caminho = str_replace('/storage/', '', $imagem->link_imagem);

                if (Storage::disk('public')->exists($caminho)) {
                    Storage::disk('public')->delete($caminho);
                }
            }

            // 🔹 Deletar registro
            $imagem->delete();

            // 🔹 Se era principal, definir outra como principal
            if ($se_principal) {
                $novaPrincipal = GaleriaProdutos::where('id_produto', $produto_id)
                    ->orderBy('id', 'asc')
                    ->first();

                if ($novaPrincipal) {
                    $novaPrincipal->update(['principal' => true]);
                }
            }

            return response()->json([
                'message' => 'Imagem removida com sucesso'
            ]);

        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Erro ao remover imagem',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function imagens($id)
    {
        try{
            $imagens = GaleriaProdutos::where('id_produto','=',$id)
            ->get();

            return response()->json($imagens);

        }catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Erro!');
        }
    }

    public function definirPrincipal(GaleriaProdutos $imagem): JsonResponse
    {
        try {
            GaleriaProdutos::where('id_produto', $imagem->id_produto)
                ->update(['principal' => false]);

            $imagem->update(['principal' => true]);

            return response()->json([
                'message' => 'Imagem definida como principal com sucesso',
                'imagem_id' => $imagem->id,
            ]);

        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Erro ao definir imagem principal',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function getImagemPrincipal($id)
    {
        try{
            $imagen = GaleriaProdutos::where('id_produto','=',$id)
            ->where('principal',true)
            ->first();

            return response()->json($imagen);

        }catch (\Exception $e) {
             return response()->json([
                'message' => 'Erro ao definir imagem principal',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

}
