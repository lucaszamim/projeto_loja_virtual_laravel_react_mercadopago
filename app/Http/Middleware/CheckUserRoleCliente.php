<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckUserRoleCliente
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        $role = Auth::user()->role;

        // Permite apenas admin
        if (in_array($role, ['cli', 'cliente'], true)) {
            return $next($request);
        }

        // Usuário logado, mas sem permissão
        //return abort(403, 'Acesso negado');
        return redirect()->route('dashboard'); //rota que controla qual dashboard mostrar
    }
}
