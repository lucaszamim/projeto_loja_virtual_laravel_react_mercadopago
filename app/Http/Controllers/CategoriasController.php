<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Categorias;
use App\Models\Subcategorias;

class CategoriasController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
         $categorias = Categorias::select('id', 'nome', 'descricao')
            ->where('ativo', true)
            ->orderBy('nome')
            ->paginate(3);

        return Inertia::render('Administradores/Categorias/Categorias', ['categorias' => $categorias]);
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

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $data = $request->validate([
                    'nome' => 'required|string|max:255|unique:categorias,nome',
                    'descricao' => 'nullable|string',
                ],[
            'nome.required' => 'O nome da subcategoria é obrigatório.',
            'nome.max' => 'O nome da subcategoria pode ter no máximo 255 caracteres.',
            'nome.unique' => 'Já existe uma categoria com esse nome.'
        ]);
        try{
            //pode se usar Usar FormRequest: php artisan make:request StoreCategoriaRequest
            Categorias::create([
                'nome' => $data['nome'],
                'descricao' => $data['descricao'],
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
        //atualiza ID a ser atualizado será ignorado na validação
        $data = $request->validate([
            'nome' => 'required|string|max:255|unique:categorias,nome,' . $id,
            'descricao' => 'nullable|string',
        ],[
            'nome.required' => 'O nome da subcategoria é obrigatório.',
            'nome.max' => 'O nome da subcategoria pode ter no máximo 255 caracteres.',
            'nome.unique' => 'Já existe uma categoria com esse nome.'
        ]);

        try{
            $produto = Categorias::findOrFail($id);
            $produto->update([
                'nome'        => $data['nome'],
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
    public function destroy(Categorias $categoria)
    {
        try{
            $categoria->delete();
            return back()->with('success', 'Categoria removida.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Erro!');
        }
    }
}
