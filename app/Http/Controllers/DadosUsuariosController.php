<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\DadosUsuarios;
use App\Models\Estados;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;


class DadosUsuariosController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
       // try{

            $id = Auth::id();
            $dados = DB::table('dados_usuarios')
            ->join('estados', 'dados_usuarios.endereco_id_estado', '=', 'estados.id')
            ->select(
                // DADOS
                'dados_usuarios.id as id',
                'dados_usuarios.id_usuario as id_usuario',
                'dados_usuarios.endereco_tipo as endereco_tipo',
                'dados_usuarios.endereco_rua as endereco_rua',
                'dados_usuarios.endereco_numero as endereco_numero',
                'dados_usuarios.endereco_bairro as endereco_bairro',
                'dados_usuarios.endereco_complemento as endereco_complemento',
                'dados_usuarios.endereco_referencia as endereco_referencia',
                'dados_usuarios.endereco_cidade as endereco_cidade',
                'dados_usuarios.endereco_cep as endereco_cep',
                'dados_usuarios.endereco_id_estado as endereco_id_estado',

                // ESATDOS
                'estados.id as id_estado',
                'estados.uf as uf',
            )
            ->orderBy('endereco_tipo', 'asc')
            ->paginate(5);

            $estados = Estados::select('id', 'uf')
            ->orderBy('uf', 'asc')
            ->get();

            return Inertia::render('Clientes/Dados/Enderecos', [
                'dados' => $dados,
                'estados' => $estados,
                ]);

       // } catch (\Exception $e) {
         //  return redirect()->back()
           //     ->with('error', 'Erro!');
       // }
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
                    'endereco_tipo' => 'required|string|max:255',
                    'endereco_rua' => 'required|string|max:255',
                    'endereco_numero' => 'required|string|max:255',
                    'endereco_bairro' => 'required|string|max:255',
                    'endereco_complemento' => 'required|string|max:255',
                    'endereco_referencia' => 'nullable|string|max:255',
                    'endereco_cidade' => 'required|string|max:255',
                    'endereco_cep' => 'required|string|max:255',
                    'endereco_id_estado' => 'required|exists:estados,id',

                ]);
        try{
            $data['id_usuario'] = auth()->id();
            DadosUsuarios::create($data);

            return redirect()->back()
                ->with('success', 'Endereço salvo com sucesso!');

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

         $data = $request->validate(
            [
                'endereco_rua' => 'required|string|max:255',
                'endereco_numero' => 'required|string|max:255',
                'endereco_bairro' => 'required|string|max:255',
                'endereco_complemento' => 'required|string|max:255',
                'endereco_referencia' => 'nullable|string|max:255',
                'endereco_cidade' => 'required|string|max:255',
                'endereco_cep' => 'required|string|max:255',
                'endereco_id_estado' => 'required|exists:estados,id',

            ]
        );

        try {
            $produto = DadosUsuarios::findOrFail($id);
            $produto->update($data);

            return redirect()
                ->back()
                ->with('success', 'Endereço atualizado com sucesso!');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->with('error', 'Erro ao salvar o endereço.');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DadosUsuarios $endereco)
    {
        try{
            $endereco->delete();
            return back()->with('success', 'Endereço removido.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Erro!');
        }
    }
}
