import Navbar from "@/Components/Navbar";
import { Head } from "@inertiajs/react";
import { useState } from "react";
import ImagemPadraoProduto from "@/assets/produto.JPG";
import AddCarrinho from "@/Components/AddCarrinho";
import Footer from "@/Components/FooterSite";

export default function Produto({ produto, galeria = [] }) {
    const imagemPadrao = ImagemPadraoProduto;

    const [imagemAtiva, setImagemAtiva] = useState(
        galeria?.length ? galeria[0].link_imagem : imagemPadrao,
    );

    const [quantidade, setQuantidade] = useState(1);
    const [zoom, setZoom] = useState(false);
    const [posicao, setPosicao] = useState({ x: 50, y: 50 });

    const handleMouseMove = (e) => {
        const { left, top, width, height } =
            e.currentTarget.getBoundingClientRect();

        setPosicao({
            x: ((e.clientX - left) / width) * 100,
            y: ((e.clientY - top) / height) * 100,
        });
    };

    function formatarMoeda(valor) {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(Number(valor));
    }

    return (
        <>
            <Head title={produto.produto_nome} />
            <Navbar />

            {/* BARRA TOPO */}
            <section className="py-4 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 text-sm text-gray-600">
                    <a href="/site/produtos" className="hover:underline">
                        Produtos
                    </a>{" "}
                    &gt; {produto.produto_nome}
                </div>
            </section>

            {/* CONTEÚDO */}
            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* GALERIA */}
                    <div className="flex gap-4 h-[420px]">
                        {/* MINIATURAS */}
                        <div className="flex flex-col gap-2 w-20 h-[280px] overflow-y-auto pr-1">
                            {galeria?.length ? (
                                galeria.map((img) => (
                                    <img
                                        key={img.id}
                                        src={img.link_imagem}
                                        onClick={() =>
                                            setImagemAtiva(img.link_imagem)
                                        }
                                        onError={(e) =>
                                            (e.target.src = imagemPadrao)
                                        }
                                        className={`
                    ml-1 mt-1 w-10 h-10
                    object-cover
                    rounded-md
                    shrink-0
                    cursor-pointer
                    transition-all
                    ${
                        imagemAtiva === img.link_imagem
                            ? "ring-2 ring-green-600 scale-105"
                            : "ring-1 ring-gray-300 hover:ring-gray-400"
                    }
                `}
                                    />
                                ))
                            ) : (
                                <img
                                    src={imagemPadrao}
                                    className="ml-1 mt-1 w-10 h-10 object-cover rounded-md ring-1 ring-gray-300"
                                />
                            )}
                        </div>

                        {/* IMAGEM PRINCIPAL */}
                        <div
                            className="flex-1 bg-gray-50 rounded-xl p-4 overflow-hidden relative"
                            onMouseEnter={() => setZoom(true)}
                            onMouseLeave={() => setZoom(false)}
                            onMouseMove={handleMouseMove}
                        >
                            <img
                                src={imagemAtiva || imagemPadrao}
                                onError={(e) => (e.target.src = imagemPadrao)}
                                className={`
            w-full h-full object-contain
            transition-transform duration-300 ease-out
            ${zoom ? "scale-125 cursor-zoom-in" : "scale-100"}
        `}
                                style={{
                                    transformOrigin: `${posicao.x}% ${posicao.y}%`,
                                }}
                            />
                        </div>
                    </div>

                    {/* INFORMAÇÕES */}
                    <div>
                        <h1 className="text-2xl font-semibold">
                            {produto.produto_nome}
                        </h1>

                        <p className="text-sm text-gray-500 mt-1">
                            Categoria: {produto.categoria_nome} •{" "}
                            {produto.subcategoria_nome}
                        </p>

                        <div className="mt-4 text-sm space-y-1">
                            <p>Cor: {produto.produto_cor}</p>
                            <p>Tamanho: {produto.produto_tamanho}</p>
                        </div>

                        {/* PREÇO */}
                        <div className="mt-6">
                            <p className="text-sm text-gray-500">Por:</p>
                            <p className="text-green-600 text-2xl font-bold">
                                {formatarMoeda(produto.produto_valor)}
                            </p>
                        </div>

                        {/* QUANTIDADE */}
                        <div className="mt-6 flex items-center gap-4">
                            <span className="font-medium">Quantidade</span>
                            <div className="flex border rounded overflow-hidden">
                                <button
                                    disabled={quantidade === 1}
                                    onClick={() =>
                                        setQuantidade((q) => Math.max(1, q - 1))
                                    }
                                    className="px-3 py-2 disabled:opacity-40"
                                >
                                    −
                                </button>
                                <span className="px-4 py-2">{quantidade}</span>
                                <button
                                    onClick={() => setQuantidade((q) => q + 1)}
                                    className="px-3 py-2"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* BOTÃO */}
                        <AddCarrinho produtoId={produto.produto_id} quantidade={quantidade} className="
                                mt-8
                                w-full md:w-auto
                                py-4 px-16
                                rounded-lg
                                bg-green-600
                                text-white
                                font-semibold
                                hover:bg-green-700
                                active:scale-95
                                transition
                            " />
                    </div>
                </div>
            </main>

            {/* DESCRIÇÃO */}
            <section className="bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4">
                    <h3 className="font-semibold mb-2">Descrição</h3>
                    <div className="bg-white p-4 leading-relaxed text-gray-700 rounded">
                        {produto.produto_descricao}
                    </div>
                </div>
            </section>

            {/* CARACTERÍSTICAS */}
            <section className="py-8">
                <div className="max-w-7xl mx-auto px-4">
                    <h3 className="font-semibold mb-4">
                        Características gerais
                    </h3>

                    <div className="overflow-x-auto bg-white rounded">
                        <table className="min-w-[900px] w-full text-sm">
                            <tbody>
                                {[
                                    ["Marca", produto.produto_marca],
                                    ["Modelo", produto.produto_modelo],
                                    ["Tamanho", produto.produto_tamanho],
                                    ["Linha", produto.produto_linha],
                                    ["Cor", produto.produto_cor],
                                    ["Material", produto.produto_material],
                                    [
                                        "Data de Fabricação",
                                        produto.produto_data_fabricacao,
                                    ],
                                    [
                                        "Data de Vencimento",
                                        produto.produto_data_vencimento,
                                    ],
                                    [
                                        "Categoria",
                                        `${produto.categoria_nome} > ${produto.subcategoria_nome}`,
                                    ],
                                    ["Dimensões", produto.produto_tamanhos],
                                    [
                                        "Conteúdo da embalagem",
                                        produto.produto_conteudo_embalagem,
                                    ],
                                ].map(([label, value], index) => (
                                    <tr
                                        key={index}
                                        className={
                                            index % 2 === 0
                                                ? "bg-white"
                                                : "bg-slate-50"
                                        }
                                    >
                                        <td className="px-4 py-2 font-medium">
                                            {label}
                                        </td>
                                        <td className="px-4 py-2">{value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}
