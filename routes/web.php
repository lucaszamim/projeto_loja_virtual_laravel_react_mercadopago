<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UsersController;
use App\Http\Controllers\CategoriasController;
use App\Http\Controllers\SubcategoriasController;
use App\Http\Controllers\UsersClientesController;
use App\Http\Controllers\ProdutosController;
use App\Http\Controllers\DadosUsuariosController;
use App\Http\Controllers\GaleriaProdutosController;
use App\Http\Controllers\SiteProdutosController;
use App\Http\Controllers\CarrinhoController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\PedidosController;
use App\Http\Controllers\VendasController;
use App\Http\Controllers\MercadoPagoController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('produtos.site.index');
})->name('home');

//rota que controla qual dashboard mostrar
Route::middleware('auth')->get('/dashboard', function () {
    $user = auth()->user();
    if ($user->role === 'cliente') {
        return redirect()->route('dashboard.cliente');
    }
    return redirect()->route('dashboard.admin');
})->name('dashboard');

//LIVRES
//produtos
Route::get('/site/produtos', [SiteProdutosController::class, 'index'])->name('produtos.site.index');
Route::get('/site/produtos/categorias-menu', [SiteProdutosController::class, 'categoriasMenu']);
Route::get('/site/produto/{id}', [SiteProdutosController::class, 'show'])->name('produto.site.show');
Route::get('/site/produtos/subcategoria/{id}', [SiteProdutosController::class, 'buscarSubcategoria'])->name('produtos.subcategoria');
Route::get('/site/produtos/buscar/{filtros?}', [SiteProdutosController::class, 'listarBuscar'])->name('produtos.buscar.listar');
Route::get('/site/produtos/buscar/subcategorias/{id?}', [SiteProdutosController::class, 'listarSubcategoria'])->name('produtos.subcategorias.listar');
//carrinho
Route::get('/site/carrinho', [CarrinhoController::class, 'index'])->name('carrinho.index');
Route::post('/site/carrinho/adicionar', [CarrinhoController::class, 'adicionar'])->name('adicionar.carrinho');
//Route::post('/site/carrinho/excluir', [CarrinhoController::class, 'excluir'])->name('excluir.carrinho');
Route::post('/site/carrinho/atualizar', [CarrinhoController::class, 'atualizar'])->name('atualizar.carrinho');
Route::post('/site/carrinho/aumentar', [CarrinhoController::class, 'aumentar'])->name('carrinho.aumentar');
Route::post('/site/carrinho/diminuir', [CarrinhoController::class, 'diminuir'])->name('carrinho.diminuir');
Route::post('/site/carrinho/remover', [CarrinhoController::class, 'remover'])->name('remover.carrinho');


Route::middleware('auth')->group(function () {


    //ADMINISTRADORES
    Route::middleware('check.admin')->group(function () {
        Route::get('/dashboard/admin', function () { return Inertia::render('DashboardAdmin'); })->name('dashboard.admin');

        Route::get('/dashboard/admin/profile/admin', [ProfileController::class, 'editAdmin'])->name('profile.admin.edit');
        Route::patch('/dashboard/admin/profile/admin', [ProfileController::class, 'updateAdmin'])->name('profile.admin.update');
        Route::delete('/dashboard/admin/profile/admin', [ProfileController::class, 'destroy'])->name('profile.admin.destroy');

        Route::get('/dashboard/admin/users/registereds', [UsersController::class, 'index'])->name('users.registereds.list');
        Route::get('/dashboard/admin/users/clientes/resgistrados', [UsersClientesController::class, 'index'])->name('users.clientes.list');

        //categorias e subcategorias
        Route::get('/dashboard/admin/categorias', [CategoriasController::class, 'index'])->name('categorias.index');
        Route::post('/dashboard/admin/categorias/registrar', [CategoriasController::class, 'store'])->name('categorias.store');
        Route::delete('/dashboard/admin/categorias/deletar/{categoria}', [CategoriasController::class, 'destroy'])->name('categorias.destroy');
        Route::patch('/dashboard/admin/categorias/atualizar/{categoria}', [CategoriasController::class, 'update'])->name('categorias.update');
        Route::get('/dashboard/admin/subcategorias/{categoria}', [SubcategoriasController::class, 'index'])->name('subcategorias.index');
        Route::post('/dashboard/admin/subcategorias/registrar', [SubcategoriasController::class, 'store'])->name('subcategorias.store');
        Route::delete('/dashboard/admin/subcategorias/deletar/{subcategoria}', [SubcategoriasController::class, 'destroy'])->name('subcategorias.destroy');
        Route::patch('/dashboard/admin/subcategorias/atualizar/{subcategoria}', [SubcategoriasController::class, 'update'])->name('subcategorias.update');

        //produtos
        Route::get('/dashboard/admin/produtos', [ProdutosController::class, 'index'])->name('produtos.index');
        Route::post('/dashboard/admin/produtos/registrar', [ProdutosController::class, 'store'])->name('produtos.store');
        Route::patch('/dashboard/admin/produtos/atualizar/{produto}', [ProdutosController::class, 'update'])->name('produtos.update');
        Route::patch('/dashboard/admin/produtos/{produto}/alterar/situacao', [ProdutosController::class, 'situacao'])->name('produtos.situacao');
        Route::get('/dashboard/admin/produtos/{filtros?}', [ProdutosController::class, 'filtros'])->name('produtos.filtros');
        //galeria
        Route::get('/dashboard/admin/produtos/{id}/imagens', [GaleriaProdutosController::class, 'imagens'])->name('produtos.imagens');
        Route::post('/dashboard/admin/galeria/produto/registrar', [GaleriaProdutosController::class, 'store'])->name('galeria.store');
        Route::delete('/dashboard/admin/galeria/deletar/{imagem}', [GaleriaProdutosController::class, 'destroy'])->name('galeria.destroy');
        Route::post('/dashboard/admin/galeria/definir-principal/{imagem}',[GaleriaProdutosController::class, 'definirPrincipal'])->name('galeria.definir.principal');
        //vendas
        Route::get('/dashboard/admin/vendas', [VendasController::class, 'index'])->name('vendas.index');
        Route::get('/dashboard/admin/vendas/detalhes/{id}', [VendasController::class, 'show'])->name('vendas.show');
        Route::patch('/dashboard/admin/vendas/editar/envio', [VendasController::class, 'envio'])->name('vendas.envio');
        //mp
        Route::get('/dashboard/admin/transacoes/mercadopago/consultar', [MercadoPagoController::class, 'consultarMP'])->name('mp.consultar.transacoes');
        Route::get('/dashboard/admin/mercadopago/payment/{id}', [MercadoPagoController::class, 'paymentMP']);


     });

     Route::middleware('check.cliente')->group(function () {

        //CLEINTES
        Route::get('/dashboard/cliente', function () { return Inertia::render('DashboardCliente'); })->name('dashboard.cliente');
        Route::get('/dashboard/cliente/profile/cliente', [ProfileController::class, 'editCliente'])->name('profile.cliente.edit');
        Route::patch('/dashboard/cliente/profile/cliente', [ProfileController::class, 'updateCliente'])->name('profile.cliente.update');
        Route::delete('/dashboard/cliente/profile/cliente', [ProfileController::class, 'destroy'])->name('profile.cliente.destroy');

        //dados
        Route::get('/dashboard/cliente/dados-enderecos', [DadosUsuariosController::class, 'index'])->name('enderecos.index');
        Route::post('/dashboard/cliente/dados-enderecos/registrar', [DadosUsuariosController::class, 'store'])->name('enderecos.store');
        Route::delete('/dashboard/cliente/dados-enderecos/deletar/{endereco}', [DadosUsuariosController::class, 'destroy'])->name('enderecos.destroy');
        Route::patch('/dashboard/cliente/dados-enderecos/atualizar/{endereco}', [DadosUsuariosController::class, 'update'])->name('enderecos.update');

        //carrinho checkout
        Route::get('/dashboard/cliente/checkout', [CheckoutController::class, 'index'])->name('carrinho.checkout');
        Route::post('/dashboard/cliente/checkout/finalizar', [CheckoutController::class, 'finalizar'])->name('checkout.finalizar');

        //pedidos
         Route::get('/dashboard/cliente/pedidos', [PedidosController::class, 'index'])->name('pedidos.index');
         Route::get('/dashboard/cliente/pedidos/detalhes/produtos/{pedido}', [PedidosController::class, 'detalhesProdutos'])->name('pedidos.detalhes.produtos');
    });

    //mp
    Route::post('/dashboard/cancelar/pedido/mercadopago', [MercadoPagoController::class, 'cancelarPedidoMP'])->name('mp.cancelar');
    Route::post('/dashboard/estornar/pedido/mercadopago', [MercadoPagoController::class, 'estornarPedidoMP'])->name('mp.estornar');
 });


 Route::get('/get/galeria/produto/{id}/imagem-principal', [GaleriaProdutosController::class, 'getImagemPrincipal']);
 Route::post('/webhooks/mercadopago', [MercadoPagoController::class, 'webhooks']);

 require __DIR__.'/auth.php';

 /*
 //TESTES
 use App\Http\Controllers\TestesController;
 Route::get('/testes/mp/payment/{id}', [TestesController::class, 'testarPaymentIdMP']);

 */

