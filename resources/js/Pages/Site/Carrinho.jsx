import Navbar from "@/Components/Navbar";
import { Head, Link, router } from "@inertiajs/react";
import CategoriaLista from "@/Components/Categorias/CategoriaLista";
import ImagemPrincipalProduto from "@/Components/ImagemPrincipalProduto";
import Buscar from "@/Components/Buscar";
import Footer from "@/Components/FooterSite";

export default function Checkout({ carrinho }) {
    const itens = Object.values(carrinho);
    const filtros = null;
    function formatarMoeda(valor) {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(Number(valor));
    }

    return (
        <>
            <Navbar />
            <Head title="Meu carrinho" />
            {/* BARRA TOPO */}
            <section className="py-4 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 text-sm text-gray-600">
                    <a href="/site/produtos" className="hover:underline">
                        Produtos
                    </a>{" "}
                    &gt; Carrinho de compras
                </div>
            </section>

            <main>
                <section className="mt-4 max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                                {/* GRID DE PRODUTOS NO CARRINHO*/}

                                <div className="max-w-4xl mx-auto p-6">
                                    <h1 className="text-lg font-bold mb-4 text-gray-600">
                                        Meu carrinho
                                    </h1>
                                    <div className="overflow-x-auto md:overflow-visible">
                                        <table className="min-w-[700px] md:min-w-full border-collapse">
                                            <thead>
                                                <tr className="border-b text-left text-sm text-gray-600">
                                                    <th className="py-2">
                                                        Produto
                                                    </th>
                                                    <th className="py-2 text-center">
                                                        Quant
                                                    </th>
                                                    <th className="py-2 text-right">
                                                        Preço
                                                    </th>
                                                    <th className="py-2 text-right">
                                                        Subtotal
                                                    </th>
                                                    <th className="py-2 text-center">
                                                        #
                                                    </th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {itens.map((item) => (
                                                    <tr
                                                        key={item.id}
                                                        className="border-b text-sm"
                                                    >
                                                        <td className="py-3">
                                                            <Link
                                                                href={route(
                                                                    "produto.site.show",
                                                                    item.id,
                                                                )}
                                                                className="block"
                                                            >
                                                                {item.nome}
                                                            </Link>
                                                        </td>

                                                        {/* Quantidade */}
                                                        <td className="py-3 text-center">
                                                            <div className="flex items-center justify-center gap-2">
                                                                <button
                                                                    onClick={() =>
                                                                        router.post(
                                                                            route(
                                                                                "carrinho.diminuir",
                                                                            ),
                                                                            {
                                                                                produto_id:
                                                                                    item.id,
                                                                            },
                                                                        )
                                                                    }
                                                                    className="px-2 py-1 border rounded hover:bg-gray-100"
                                                                >
                                                                    −
                                                                </button>

                                                                <span className="w-6 text-center">
                                                                    {
                                                                        item.quantidade
                                                                    }
                                                                </span>

                                                                <button
                                                                    onClick={() =>
                                                                        router.post(
                                                                            route(
                                                                                "carrinho.aumentar",
                                                                            ),
                                                                            {
                                                                                produto_id:
                                                                                    item.id,
                                                                            },
                                                                        )
                                                                    }
                                                                    className="px-2 py-1 border rounded hover:bg-gray-100"
                                                                >
                                                                    +
                                                                </button>
                                                            </div>
                                                        </td>

                                                        {/* Preço unitário */}
                                                        <td className="py-3 text-right">
                                                            {formatarMoeda(
                                                                item.preco,
                                                            )}
                                                        </td>

                                                        {/* Subtotal */}
                                                        <td className="py-3 text-right font-semibold">
                                                            {formatarMoeda(
                                                                item.preco *
                                                                    item.quantidade,
                                                            )}
                                                        </td>

                                                        {/* Remover */}
                                                        <td className="py-3 text-center">
                                                            <button
                                                                onClick={() =>
                                                                    router.post(
                                                                        route(
                                                                            "remover.carrinho",
                                                                        ),
                                                                        {
                                                                            produto_id:
                                                                                item.id,
                                                                        },
                                                                    )
                                                                }
                                                                title="Remover item"
                                                                className="text-red-600 hover:underline"
                                                            >
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    viewBox="0 0 16 16"
                                                                    fill="currentColor"
                                                                    className="size-4"
                                                                >
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5a.75.75 0 0 1 .786-.711Z"
                                                                        clipRule="evenodd"
                                                                    />
                                                                </svg>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="mt-6 flex justify-end">
                                        <div className="text-right">
                                            <p className="text-sm text-gray-600">
                                                Total
                                            </p>
                                            <p className="text-2xl font-bold">
                                                {formatarMoeda(
                                                    itens.reduce(
                                                        (total, item) =>
                                                            total +
                                                            item.preco *
                                                                item.quantidade,
                                                        0,
                                                    ),
                                                )}
                                            </p>

                                            <Link
                                                href={route(
                                                    "carrinho.checkout",
                                                )}
                                                className="mt-4 inline-block rounded bg-green-600 px-6 py-3 text-white hover:bg-green-700"
                                            >
                                                Finalizar compra
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
