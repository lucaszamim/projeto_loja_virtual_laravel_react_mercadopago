import Navbar from "@/Components/Navbar";
import { Head, Link, router } from "@inertiajs/react";
import Buscar from "@/Components/Buscar";
import { React } from "react";
import CategoriaLista from "@/Components/Categorias/CategoriaLista";
import ImagemPrincipalProduto from "@/Components/ImagemPrincipalProduto";
import AddCarrinho from "@/Components/AddCarrinho";
import Footer from "@/Components/FooterSite";

export default function Produtos({ produtos, filtros }) {
    const quantidade = 1;
    function formatarMoeda(valor) {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(Number(valor));
    }
    return (
        <>
            <Head title="Produtos" />
            <Navbar />

            <section className="py-4 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 text-sm text-gray-600">
                    {filtros != null ? (
                        <>
                            <a
                                href={route("produtos.site.index")}
                                className="hover:underline"
                            >
                                Produtos
                            </a>{" "}
                            {">"} Filtros {">"} {filtros}
                        </>
                    ) : (
                        "Produtos > Todos os produtos"
                    )}
                </div>
            </section>

            <main>
                <section className="mt-4 max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                        {/* MENU */}
                        <div className="bg-gray-50">
                            {/* margem */}
                            <div className="m-6">
                                <span className="text-xs font-bold">
                                    Buscar produtos
                                </span>
                                <div className="mt-6">
                                    <Buscar
                                        rota="produtos.buscar.listar"
                                        filtro={filtros ?? ""}
                                        placeholder={
                                            "Buscar produtos..." || filtros
                                        }
                                    />
                                </div>

                                <div className="max-w-4xl mx-auto">
                                    <CategoriaLista />
                                </div>
                            </div>
                        </div>

                        {/* PRODUTOS */}
                        <div className="col-span-2">
                            {/* margem */}
                            <div className="ml-10">
                                {/* GRID DE PRODUTOS */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                    {produtos?.data?.map((produto) => (
                                        <div
                                            key={produto.id}
                                            className="border rounded-lg bg-white shadow hover:shadow-lg transition p-4 flex flex-col"
                                        >
                                            <Link
                                                href={route(
                                                    "produto.site.show",
                                                    produto.id,
                                                )}
                                                className="block"
                                            >
                                                {/* Imagem */}
                                                <div className="flex justify-center mb-4">
                                                    <ImagemPrincipalProduto
                                                        key={produto.id}
                                                        id={produto.id}
                                                    />
                                                </div>

                                                {/* Nome */}
                                                <h3 className="text-sm font-medium text-gray-800 mb-2 line-clamp-2">
                                                    {produto.nome}
                                                </h3>
                                            </Link>

                                            {/* Preço */}
                                            <div className="mt-auto">
                                                <span className="text-sm text-gray-500">
                                                    Por:
                                                </span>
                                                <p className="text-lg font-bold text-gray-900">
                                                    {formatarMoeda(
                                                        produto.valor,
                                                    )}
                                                </p>
                                            </div>

                                            {/* Botão */}
                                            <AddCarrinho
                                                produtoId={produto.id}
                                                quantidade={quantidade}
                                                className="mt-4 bg-green-600 hover:bg-green-700 text-white text-center py-2 rounded"
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/* PAGINAÇÃO */}
                                <div className="mt-8 flex justify-center gap-2">
                                    {produtos?.links?.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || ""}
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                            className={`px-3 py-1 border rounded ${
                                                link.active
                                                    ? "bg-gray-800 text-white"
                                                    : "bg-white text-gray-700"
                                            } ${!link.url && "opacity-50 cursor-not-allowed"}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer/>
        </>
    );
}
