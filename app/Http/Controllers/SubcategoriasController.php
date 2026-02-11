<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use App\Models\Categorias;
use App\Models\Subcategorias;

class SubcategoriasController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(int $id)
    {
        try{
            $subcategorias = null;
            $categoria = null;

            if($id>0 && $id!=null){
                $subcategorias = Subcategorias::where('ativo','=',true)
                ->where('id_categoria','=',$id)
                ->orderBy('nome', 'asc')
                ->paginate(3);

                $categoria = Categorias::where('id', $id)->value('nome');

            } else {
                $subcategorias = Subcategorias::where('ativo','=',true)
                ->orderBy('nome', 'asc')
                ->paginate(5);
            }

            return Inertia::render('Administradores/Categorias/Subcategorias', [
                'subcategorias' => $subcategorias,
                'id_cat' => $id,
                'categoria' => $categoria
            ]);
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
             'nome' => [
                'required',
                'string',
                'max:255',
                Rule::unique('subcategorias', 'nome')
                    ->where('id_categoria', $request->id_categoria),
            ],
            'descricao' => 'nullable|string',
            'id_categoria' => 'required|integer|exists:categorias,id',
        ],
        [
            'nome.required' => 'O nome da subcategoria é obrigatório.',
            'nome.max' => 'O nome da subcategoria pode ter no máximo 255 caracteres.',
            'nome.unique' => 'Já existe uma subcategoria com esse nome nesta categoria.',
            'id_categoria.required' => 'A categoria é obrigatória.',
            'id_categoria.exists' => 'A categoria selecionada não é válida.',
        ]);
        try{
            Subcategorias::create([
                'nome' => $data['nome'],
                'descricao' => $data['descricao'],
                'id_categoria' => $data['id_categoria'],
            ]);

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
        $subcategoria = Subcategorias::findOrFail($id);
        //atualiza permitindo o mesmo nome desde que seja de id_categoria diferente
        $data = $request->validate([
            'nome' => [
                    'required',
                    'string',
                    'max:255',
                    Rule::unique('subcategorias', 'nome')
                        ->where('id_categoria', $request->id_categoria)
                        ->ignore($subcategoria->id),
                ],

            'descricao' => 'nullable|string',
        ],[
            'nome.required' => 'O nome da subcategoria é obrigatório.',
            'nome.max' => 'O nome da subcategoria pode ter no máximo 255 caracteres.',
            'nome.unique' => 'Já existe uma subcategoria com esse nome nesta categoria.',
        ]);

        try{
            $subcategoria->update([
                'nome' => $data['nome'],
                'descricao' => $data['descricao']
            ]);

            return redirect()->back()->with('success', 'Produto atualizado com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Erro!');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Subcategorias $subcategoria)
    {
        try{
            $subcategoria->delete();
            return back()->with('success', 'Categoria removida.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Erro!');
        }
    }
}
