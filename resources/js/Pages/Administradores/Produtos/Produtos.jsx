import AuthenticatedLayout from "@/Layouts/AuthenticatedLayoutAdmin";
import { Head, Link, useForm, router } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import { Transition } from "@headlessui/react";
import { useState, useEffect, Fragment } from "react";
import ImagemPrincipalProduto from "@/Components/ImagemPrincipalProduto";
import Buscar from "@/Components/Buscar";
import Footer from "@/Components/FooterDashboard";

export default function Produtos({
    produtos,
    subcategorias,
    categorias,
    filtros,
}) {
    const [modalEdicaoProduto, setModalEdicaoProduto] = useState(false);
    const [editando, setEditando] = useState(false);

    const {
        data: produto,
        setData: setProduto,
        post,
        patch,
        processing,
        errors,
        reset,
    } = useForm({
        id: null,
        nome: "",
        descricao: "",
        valor: "",
        estoque_disponivel: "",
        id_categoria: "",
        id_subcategoria: "",
        marca: "",
        modelo: "",
        linha: "",
        cor: "",
        tamanho: "",
        material: "",
        data_fabricacao: "",
        data_vencimento: "",
        genero: "",
        idade: "",
        conteudo_embalagem: "",
        condicoes: "",
        tamanhos: "",
        peso: "",
        etiqueta: "",
    });

    {
        /* CADASTRAR PRODUTO */
    }
    const novoProduto = () => {
        reset();
        setEditando(false);
        setModalEdicaoProduto(true);
    };

    {
        /* ATUALIZAR PRODUTO */
    }
    const editar = (row) => {
        setProduto({
            id: row.produto_id ?? "",
            nome: row.produto_nome ?? "",
            descricao: row.produto_descricao ?? "",
            valor: row.produto_valor ?? "",
            estoque_disponivel: row.produto_estoque_disponivel ?? "",
            id_categoria: row.categoria_id ?? "",
            id_subcategoria: row.subcategoria_id ?? "",
            marca: row.produto_marca ?? "",
            modelo: row.produto_modelo ?? "",
            linha: row.produto_linha ?? "",
            cor: row.produto_cor ?? "",
            tamanho: row.produto_tamanho ?? "",
            material: row.produto_material ?? "",
            data_fabricacao: row.produto_data_fabricacao ?? "",
            data_vencimento: row.produto_data_vencimento ?? "",
            genero: row.produto_genero ?? "",
            idade: row.produto_idade ?? "",
            conteudo_embalagem: row.produto_conteudo_embalagem ?? "",
            condicoes: row.produto_condicoes ?? "",
            tamanhos: row.produto_tamanhos ?? "",
            peso: row.produto_peso ?? "",
            etiqueta: row.produto_etiqueta ?? "",
        });

        setEditando(true);
        setModalEdicaoProduto(true);
    };

    {
        /* DELETAR */
    }
    const deletar = (id) => {
        if (confirm("ATENÇÃO: Deseja realmente excluir esta categoria?")) {
            router.delete(route("produtos.destroy", id), {
                preserveScroll: true,
            });
        }
    };

    {
        /* FORMATA EM MOEDA R$ E NUMEROS */
    }
    const formatarReal = (valor) => {
        if (valor === null || valor === undefined || valor === "")
            return "R$ 0,00";

        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(valor);
    };

    const formatarNumeroBR = (valor) => {
        if (valor === null || valor === undefined) return "0";

        return Number(valor).toLocaleString("pt-BR");
    };

    {
        /* SELEÇÃO DINAMICA DE SUBCATEGORIA */
    }
    const subcategoriasFiltradas = subcategorias.filter(
        (sub) => sub.id_categoria == produto.id_categoria,
    );

    {
        /* AÇÃO */
    }
    const salvarProduto = () => {
        if (editando) {
            patch(route("produtos.update", produto.id), {
                preserveScroll: true,
                onSuccess: () => {
                    setModalEdicaoProduto(false);
                    reset();
                    setEditando(false);
                },
            });
        } else {
            post(route("produtos.store"), {
                preserveScroll: true,
                onSuccess: () => {
                    setModalEdicaoProduto(false);
                    reset();
                },
            });
        }
    };

    {
        /*esc*/
    }

    useEffect(() => {
        const esc = (e) => {
            if (e.key === "Escape") {
                setModalEdicaoProduto(false);
            }
        };

        window.addEventListener("keydown", esc);

        return () => {
            window.removeEventListener("keydown", esc);
        };
    }, []);

    {
        /* GALERIA */
    }
    const [refreshImagem, setRefreshImagem] = useState(0);
    const [modalGaleria, setModalGaleria] = useState(false);
    const [imagensProduto, setImagensProduto] = useState([]);
    const [produtoSelecionadoGaleria, setProdutoSelecionadoGaleria] =
        useState(null);
    const abrirModalGaleria = async (produto) => {
        setProdutoSelecionadoGaleria(produto);
        setModalGaleria(true);

        try {
            const response = await axios.get(
                route("produtos.imagens", produto.produto_id),
            );
            setImagensProduto(response.data);
        } catch (error) {
            console.error("Erro ao carregar imagens:", error);
        }
    };

    const [novasImagens, setNovasImagens] = useState([]);
    const [imagemPrincipal, setImagemPrincipal] = useState(null);
    const [uploading, setUploading] = useState(false);
    const handleSelecionarImagens = (e) => {
        const files = Array.from(e.target.files);
        setNovasImagens(files);
    };

    const enviarImagens = async () => {
        if (novasImagens.length === 0) return;

        const formData = new FormData();
        novasImagens.forEach((file, index) => {
            formData.append("imagens[]", file);
        });

        if (imagemPrincipal !== null)
            formData.append("imagem_principal", imagemPrincipal);
        formData.append("produto_id", produtoSelecionadoGaleria.produto_id);

        try {
            setUploading(true);
            const response = await axios.post(
                route("galeria.store"),
                formData,
                { headers: { "Content-Type": "multipart/form-data" } },
            );

            setImagensProduto(response.data);
            setNovasImagens([]);
            setImagemPrincipal(null);
            setRefreshImagem((prev) => prev + 1);
        } catch (error) {
            console.error("Erro ao enviar imagens:", error);
        } finally {
            setUploading(false);
        }
    };

    const excluirImagem = async (id) => {
        if (!confirm("Deseja realmente excluir esta imagem?")) return;

        try {
            await axios.delete(route("galeria.destroy", id));
            setImagensProduto((prev) => prev.filter((img) => img.id !== id));
        } catch (error) {
            console.error("Erro ao excluir imagem:", error);
        }
    };

    const definirPrincipalExistente = async (id) => {
        try {
            await axios.post(route("galeria.definir.principal", id));
            setImagensProduto((prev) =>
                prev.map((img) => ({
                    ...img,
                    principal: img.id === id,
                })),
            );
            setRefreshImagem((prev) => prev + 1);
        } catch (error) {
            console.error("Erro ao definir imagem principal:", error);
        }
    };

    {
        /* ALTERAR SITUAÇÃO DO PRODUTO */
    }
    const situacao = async (id) => {
        try {
            await axios.patch(route("produtos.situacao", id));
            router.reload({ only: ["produtos"] });
        } catch (error) {
            console.error("Erro ao alterar situação:", error);
        }
    };

    return (
        <>
            <Head title="Produtos" />

            {/* MODAL PRODUTO */}
            <Transition show={modalEdicaoProduto} as={Fragment} appear>
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
                    {/* BACKDROP */}
                    <Transition.Child
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div
                            className="fixed inset-0 bg-black/60"
                            onClick={() => setModalEdicaoProduto(false)}
                        />
                    </Transition.Child>

                    {/* MODAL */}
                    <Transition.Child
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-10 scale-95"
                        enterTo="opacity-100 translate-y-0 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 scale-100"
                        leaveTo="opacity-0 translate-y-10 scale-95"
                    >
                        <div className="relative w-full sm:max-w-6xl h-[95vh] sm:h-[90vh] bg-white rounded-t-2xl sm:rounded-2xl shadow-xl flex flex-col">
                            {/* HEADER FIXO */}
                            <div className="flex items-center justify-between px-6 py-4 border-b bg-white rounded-t-2xl">
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                                    {editando
                                        ? `Editar produto: ${produto.nome}`
                                        : "Novo Produto"}
                                </h2>

                                <button
                                    onClick={() => setModalEdicaoProduto(false)}
                                    className="text-gray-500 hover:text-red-600 text-2xl leading-none"
                                >
                                    ×
                                </button>
                            </div>

                            {/* CONTEÚDO */}
                            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-10">
                                {Object.values(errors).length > 0 && (
                                    <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
                                        <ul className="list-disc pl-5">
                                            {Object.values(errors).map(
                                                (error, index) => (
                                                    <li key={index}>{error}</li>
                                                ),
                                            )}
                                        </ul>
                                    </div>
                                )}

                                {/* INFORMAÇÕES PRINCIPAIS */}
                                <section>
                                    <h3 className="mb-4 text-sm font-semibold text-gray-500 uppercase">
                                        Informações principais
                                    </h3>

                                    <div className="bg-slate-50">
                                        <div className="m-4">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <div className="md:col-span-2  mt-4">
                                                    <label className="text-sm font-medium">
                                                        Nome
                                                    </label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={produto.nome}
                                                        placeholder="Digite o nome do produto..."
                                                        onChange={(e) =>
                                                            setProduto(
                                                                "nome",
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="mt-1 w-full rounded-lg border-gray-300 focus:border-cyan-700 focus:ring-cyan-700"
                                                    />
                                                </div>

                                                <div className="mt-4">
                                                    <label className="text-sm font-medium">
                                                        Etiqueta
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={produto.etiqueta}
                                                        placeholder="Etiqueta ou código de barras"
                                                        onChange={(e) =>
                                                            setProduto(
                                                                "etiqueta",
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="mt-1 w-full rounded-lg border-gray-300 focus:border-cyan-700 focus:ring-cyan-700"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="text-sm font-medium text-gray-700">
                                                        Categoria
                                                    </label>

                                                    <select
                                                        value={
                                                            produto.id_categoria
                                                        }
                                                        onChange={(e) => {
                                                            setProduto(
                                                                "id_categoria",
                                                                e.target.value,
                                                            );
                                                            setProduto(
                                                                "id_subcategoria",
                                                                "",
                                                            ); // limpa subcategoria
                                                        }}
                                                        className="mt-1 w-full rounded-lg border-gray-300 bg-white px-3 py-2"
                                                    >
                                                        <option value="">
                                                            Selecione
                                                        </option>

                                                        {categorias.map(
                                                            (cat) => (
                                                                <option
                                                                    key={cat.id}
                                                                    value={
                                                                        cat.id
                                                                    }
                                                                >
                                                                    {cat.nome}
                                                                </option>
                                                            ),
                                                        )}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="text-sm font-medium text-gray-700">
                                                        Subcategoria
                                                    </label>

                                                    <select
                                                        required
                                                        value={
                                                            produto.id_subcategoria
                                                        }
                                                        onChange={(e) =>
                                                            setProduto(
                                                                "id_subcategoria",
                                                                e.target.value,
                                                            )
                                                        }
                                                        disabled={
                                                            !produto.id_categoria
                                                        }
                                                        className="mt-1 w-full rounded-lg border-gray-300 bg-white px-3 py-2 disabled:bg-gray-100"
                                                    >
                                                        <option value="">
                                                            {produto.id_categoria
                                                                ? "Selecione"
                                                                : "Selecione uma categoria primeiro"}
                                                        </option>

                                                        {subcategoriasFiltradas.map(
                                                            (sub) => (
                                                                <option
                                                                    key={sub.id}
                                                                    value={
                                                                        sub.id
                                                                    }
                                                                >
                                                                    {sub.nome}
                                                                </option>
                                                            ),
                                                        )}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="mt-6">
                                                <label className="text-sm font-medium">
                                                    Descrição
                                                </label>
                                                <textarea
                                                    rows="5"
                                                    value={produto.descricao}
                                                    placeholder="Digite a descrição do produto..."
                                                    onChange={(e) =>
                                                        setProduto(
                                                            "descricao",
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="mt-1 w-full rounded-lg border-gray-300"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* PREÇO E ESTOQUE */}
                                <section>
                                    <h3 className="mb-4 text-sm font-semibold text-gray-500 uppercase">
                                        Preço & Estoque
                                    </h3>
                                    <div className="bg-slate-50">
                                        <div className="m-4">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <div>
                                                    <label className="text-sm font-medium">
                                                        Valor
                                                    </label>
                                                    <input
                                                        type="number"
                                                        required
                                                        value={produto.valor}
                                                        placeholder="Digite o valor de venda..."
                                                        onChange={(e) =>
                                                            setProduto(
                                                                "valor",
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="mt-1 w-full rounded-lg border-gray-300"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="text-sm font-medium">
                                                        Estoque
                                                    </label>
                                                    <input
                                                        type="number"
                                                        required
                                                        value={
                                                            produto.estoque_disponivel
                                                        }
                                                        placeholder="Digite a quantidade disponível..."
                                                        onChange={(e) =>
                                                            setProduto(
                                                                "estoque_disponivel",
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="mb-4 mt-1 w-full rounded-lg border-gray-300"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* CARACTERÍSTICAS */}
                                <section>
                                    <h3 className="mb-4 text-sm font-semibold text-gray-500 uppercase">
                                        Características
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">
                                                Genero
                                            </label>

                                            <select
                                                value={produto.genero}
                                                onChange={(e) =>
                                                    setProduto(
                                                        "genero",
                                                        e.target.value,
                                                    )
                                                }
                                                className="mt-1 w-full rounded-lg border-gray-300"
                                            >
                                                <option value="">
                                                    Selecione ...
                                                </option>
                                                <option value="Masculino">
                                                    Masculino
                                                </option>
                                                <option value="Feminino">
                                                    Feminino
                                                </option>
                                                <option value="Unissex">
                                                    Unissex
                                                </option>
                                                <option value="Outro">
                                                    Outro
                                                </option>
                                                <option value="Todos">
                                                    Todos
                                                </option>
                                            </select>

                                            <InputError
                                                message={errors.genero}
                                            />
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-gray-700">
                                                Condições
                                            </label>

                                            <select
                                                value={produto.condicoes}
                                                onChange={(e) =>
                                                    setProduto(
                                                        "condicoes",
                                                        e.target.value,
                                                    )
                                                }
                                                className="mt-1 w-full rounded-lg border-gray-300"
                                            >
                                                <option value="">
                                                    Selecione ...
                                                </option>
                                                <option value="Novo">
                                                    Novo
                                                </option>
                                                <option value="Recondicionado">
                                                    Recondicionado
                                                </option>
                                                <option value="Usado">
                                                    Usado
                                                </option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-gray-700">
                                                Para
                                            </label>

                                            <select
                                                value={produto.idade}
                                                onChange={(e) =>
                                                    setProduto(
                                                        "idade",
                                                        e.target.value,
                                                    )
                                                }
                                                className="mt-1 w-full rounded-lg border-gray-300"
                                            >
                                                <option value="">
                                                    Selecione ...
                                                </option>
                                                <option value="Infantil">
                                                    Infantil
                                                </option>
                                                <option value="Joven">
                                                    Joven
                                                </option>
                                                <option value="Adulto">
                                                    Adulto
                                                </option>
                                                <option value="Todos">
                                                    Todos
                                                </option>
                                            </select>
                                        </div>

                                        {[
                                            ["Marca", "marca"],
                                            ["Modelo", "modelo"],
                                            ["Linha", "linha"],
                                            ["Cor", "cor"],
                                            ["Tamanho", "tamanho"],
                                            ["Material", "material"],
                                        ].map(([label, field]) => (
                                            <div key={field}>
                                                <label className="text-sm font-medium">
                                                    {label}
                                                </label>
                                                <input
                                                    type="text"
                                                    value={produto[field]}
                                                    placeholder="Informação opcional ..."
                                                    onChange={(e) =>
                                                        setProduto(
                                                            field,
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="mt-1 w-full rounded-lg border-gray-300"
                                                />
                                            </div>
                                        ))}

                                        <div>
                                            <label className="text-sm font-medium">
                                                Data de fabricação
                                            </label>
                                            <input
                                                type="date"
                                                value={produto.data_fabricacao}
                                                placeholder="Informação opcional ..."
                                                onChange={(e) =>
                                                    setProduto(
                                                        "data_fabricacao",
                                                        e.target.value,
                                                    )
                                                }
                                                className="mt-1 w-full rounded-lg border-gray-300"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium">
                                                Data de vencimento
                                            </label>
                                            <input
                                                type="date"
                                                value={produto.data_vencimento}
                                                placeholder="Informação opcional ..."
                                                onChange={(e) =>
                                                    setProduto(
                                                        "data_vencimento",
                                                        e.target.value,
                                                    )
                                                }
                                                className="mt-1 w-full rounded-lg border-gray-300"
                                            />
                                        </div>
                                    </div>
                                </section>

                                {/* CARACTERÍSTICAS */}
                                <section>
                                    <h3 className="mb-4 text-sm font-semibold text-gray-500 uppercase">
                                        Envio
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-sm font-medium">
                                                Peso em gramas
                                            </label>
                                            <input
                                                type="number"
                                                value={produto.peso}
                                                placeholder="Informação opcional ..."
                                                onChange={(e) =>
                                                    setProduto(
                                                        "peso",
                                                        e.target.value,
                                                    )
                                                }
                                                className="mt-1 w-full rounded-lg border-gray-300"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium">
                                                Tamanhos - altura x largura x
                                                comprimento em cm
                                            </label>
                                            <input
                                                type="text"
                                                value={produto.tamanhos}
                                                placeholder="Informação opcional ..."
                                                onChange={(e) =>
                                                    setProduto(
                                                        "tamanhos",
                                                        e.target.value,
                                                    )
                                                }
                                                className="mt-1 w-full rounded-lg border-gray-300"
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-6">
                                        <label className="text-sm font-medium">
                                            Conteúdo da embalagem
                                        </label>
                                        <textarea
                                            rows="4"
                                            value={produto.conteudo_embalagem}
                                            placeholder="Informação opcional ..."
                                            onChange={(e) =>
                                                setProduto(
                                                    "conteudo_embalagem",
                                                    e.target.value,
                                                )
                                            }
                                            className="mt-1 w-full rounded-lg border-gray-300"
                                        />
                                    </div>
                                </section>
                            </div>

                            {/* FOOTER FIXO */}
                            <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
                                <button
                                    onClick={() => setModalEdicaoProduto(false)}
                                    className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
                                >
                                    Cancelar
                                </button>

                                <button
                                    disabled={processing}
                                    onClick={salvarProduto}
                                    className="px-6 py-2 rounded-lg bg-cyan-900 text-white hover:bg-cyan-800 disabled:opacity-50"
                                >
                                    Salvar
                                </button>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Transition>

            {/* MODAL GALERIA */}
            <Transition appear show={modalGaleria} as={Fragment}>
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* BACKDROP */}
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div
                            className="fixed inset-0 bg-black/60"
                            onClick={() => setModalGaleria(false)}
                        />
                    </Transition.Child>

                    {/* CONTEÚDO DO MODAL */}
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-10 scale-95"
                        enterTo="opacity-100 translate-y-0 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 scale-100"
                        leaveTo="opacity-0 translate-y-10 scale-95"
                    >
                        <div className="relative w-full sm:max-w-4xl max-h-[80vh] bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden">
                            {/* HEADER */}
                            <div className="flex justify-between items-center px-6 py-4 border-b">
                                <h2 className="text-lg font-semibold text-gray-800">
                                    Galeria:{" "}
                                    {produtoSelecionadoGaleria?.produto_nome}
                                </h2>
                                <button
                                    onClick={() => setModalGaleria(false)}
                                    className="text-gray-500 hover:text-red-600 text-2xl leading-none"
                                >
                                    ×
                                </button>
                            </div>

                            {/* UPLOAD DE NOVAS IMAGENS */}
                            <div className="flex-1 overflow-y-auto p-6">
                                <div className="mb-6">
                                    <h3 className="text-gray-700 font-semibold mb-2">
                                        Enviar novas imagens
                                    </h3>

                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleSelecionarImagens}
                                        className="mb-4"
                                    />

                                    {novasImagens.length > 0 && (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-2">
                                            {novasImagens.map((file, index) => (
                                                <div
                                                    key={index}
                                                    className={`relative border rounded overflow-hidden ${
                                                        imagemPrincipal ===
                                                        index
                                                            ? "border-4 border-cyan-700"
                                                            : "border-gray-300"
                                                    }`}
                                                >
                                                    <img
                                                        src={URL.createObjectURL(
                                                            file,
                                                        )}
                                                        alt="Pré-visualização"
                                                        className="w-full h-32 object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        className="absolute top-1 right-1 bg-white/80 rounded-full p-1 text-red-600"
                                                        onClick={() =>
                                                            setNovasImagens(
                                                                novasImagens.filter(
                                                                    (_, i) =>
                                                                        i !==
                                                                        index,
                                                                ),
                                                            )
                                                        }
                                                    >
                                                        ×
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="absolute bottom-1 left-1 bg-cyan-700 text-white text-xs px-2 py-0.5 rounded"
                                                        onClick={() =>
                                                            setImagemPrincipal(
                                                                index,
                                                            )
                                                        }
                                                    >
                                                        {imagemPrincipal ===
                                                        index
                                                            ? "Principal"
                                                            : "Definir como principal"}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <button
                                        disabled={
                                            uploading ||
                                            novasImagens.length === 0
                                        }
                                        onClick={enviarImagens}
                                        className="px-4 py-2 bg-cyan-800 text-white rounded hover:bg-cyan-950 disabled:opacity-50"
                                    >
                                        {uploading
                                            ? "Enviando..."
                                            : "Enviar imagens"}
                                    </button>
                                </div>

                                <hr className="my-4 border-gray-300" />

                                {/* GALERIA EXISTENTE COM OPÇÃO DE EXCLUIR E DEFINIR PRINCIPAL */}
                                {imagensProduto.length > 0 ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                        {imagensProduto.map((img) => (
                                            <div
                                                key={img.id}
                                                className="relative border rounded overflow-hidden"
                                            >
                                                <img
                                                    src={img.link_imagem}
                                                    alt={
                                                        produtoSelecionadoGaleria?.produto_nome
                                                    }
                                                    className="w-full h-32 object-cover"
                                                />
                                                {/* IMAGEM PRINCIPAL */}
                                                {img.principal ? (
                                                    <span className="absolute top-1 left-1 bg-cyan-700 text-white text-xs px-2 py-0.5 rounded">
                                                        Principal
                                                    </span>
                                                ) : (
                                                    <button
                                                        className="absolute top-1 left-1 bg-white text-cyan-700 text-xs px-2 py-0.5 rounded"
                                                        onClick={() =>
                                                            definirPrincipalExistente(
                                                                img.id,
                                                            )
                                                        }
                                                    >
                                                        Definir como principal
                                                    </button>
                                                )}

                                                {/* BOTÃO DE EXCLUIR */}
                                                <button
                                                    title="Deletar"
                                                    className="absolute top-1 right-1 bg-white/80 rounded-full p-1 text-red-600"
                                                    onClick={() =>
                                                        excluirImagem(img.id)
                                                    }
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
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-gray-500">
                                        Nenhuma imagem encontrada.
                                    </p>
                                )}
                            </div>

                            {/* FOOTER */}
                            <div className="px-6 py-4 border-t flex justify-end">
                                <button
                                    onClick={() => setModalGaleria(false)}
                                    className="px-4 py-2 bg-cyan-800 text-white rounded hover:bg-cyan-950"
                                >
                                    Fechar
                                </button>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Transition>

            <AuthenticatedLayout
                header={
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        {filtros != null ? (
                            <>
                                <a
                                    href={route("produtos.index")}
                                    className="text-indigo-600"
                                >
                                    Produtos
                                </a>{" "}
                                {">"} Filtros {">"} {filtros}
                            </>
                        ) : (
                            "Produtos"
                        )}{" "}
                    </h2>
                }
            >
                <div className="py-12">
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <div className="m-2">
                            <div className="flex items-stretch justify-between gap-3">
                                <button
                                    onClick={novoProduto}
                                    className="bg-green-700 hover:bg-green-800 text-white h-10 px-12 rounded flex items-center justify-center"
                                >
                                    NOVO
                                </button>

                                <div className="flex-1">
                                    <Buscar
                                        rota="produtos.filtros"
                                        filtro={filtros}
                                        placeholder={
                                            "Buscar produtos..." || filtros
                                        }
                                    />
                                </div>
                            </div>

                            {/*cadastrados*/}
                            <div className="mt-2 space-y-6">
                                <div className="w-full overflow-x-auto">
                                    <table className="min-w-[900px] w-full border-collapse border border-gray-300 text-sm">
                                        <thead className="bg-gray-100"></thead>
                                        <tbody>
                                            {produtos.data.map((row, index) => (
                                                <tr
                                                    key={row.produto_id}
                                                    className={`
                                                hover:bg-sky-50
                                                ${
                                                    !row.produto_ativo
                                                        ? "bg-orange-50"
                                                        : index % 2 === 0
                                                          ? "bg-slate-50"
                                                          : "bg-white"
                                                }
                                            `}
                                                >
                                                    <td className="border border-gray-300 px-4 py-2">
                                                        <ImagemPrincipalProduto
                                                            key={`${row.produto_id}-${refreshImagem}`}
                                                            id={row.produto_id}
                                                            className="w-14 h-14 rounded-full object-cover mx-auto"
                                                        />
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2">
                                                        <h4 className="font-bold text-xs">
                                                            {row.produto_ativo ? (
                                                                <span className="text-xs">
                                                                    Produto
                                                                </span>
                                                            ) : (
                                                                <span className="text-orange-700 font-semibold uppercase text-xs">
                                                                    Produto
                                                                    desativado
                                                                </span>
                                                            )}
                                                        </h4>
                                                        <h4 className="font-bold text-lg">
                                                            {row.produto_nome}
                                                        </h4>
                                                        <h4>
                                                            Marca:{" "}
                                                            {row.produto_marca}{" "}
                                                            |{" "}
                                                            {row.produto_modelo}
                                                        </h4>
                                                        <h4>
                                                            Características:{" "}
                                                            {
                                                                row.produto_tamanho
                                                            }{" "}
                                                            | {row.produto_cor}
                                                        </h4>
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2">
                                                        <h4>
                                                            Estoque:{" "}
                                                            {formatarNumeroBR(
                                                                row.produto_estoque_disponivel,
                                                            )}
                                                        </h4>
                                                        <h4>
                                                            Valor:{" "}
                                                            {formatarReal(
                                                                row.produto_valor,
                                                            )}
                                                        </h4>
                                                        <h4>
                                                            Categoria:{" "}
                                                            {row.categoria_nome}
                                                            {" > "}
                                                            {
                                                                row.subcategoria_nome
                                                            }
                                                        </h4>
                                                        <h4>
                                                            Etiqueta:{" "}
                                                            {
                                                                row.produto_etiqueta
                                                            }
                                                        </h4>
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2">
                                                        {/* AÇÕES */}
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() =>
                                                                    editar(row)
                                                                }
                                                                className="text-indigo-600 hover:text-indigo-800"
                                                                title="Editar"
                                                            >
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    strokeWidth={
                                                                        1.5
                                                                    }
                                                                    stroke="currentColor"
                                                                    className="size-6"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                                                    />
                                                                </svg>
                                                            </button>

                                                            <button
                                                                onClick={() =>
                                                                    abrirModalGaleria(
                                                                        row,
                                                                    )
                                                                }
                                                                className="text-cyan-800 hover:text-cyan-950"
                                                                title="Galeria"
                                                            >
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    strokeWidth={
                                                                        1.5
                                                                    }
                                                                    stroke="currentColor"
                                                                    className="size-6"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                                                                    />
                                                                </svg>
                                                            </button>

                                                            <button
                                                                onClick={() =>
                                                                    deletar(
                                                                        row.produto_id,
                                                                    )
                                                                }
                                                                className="text-red-600 hover:text-red-800"
                                                                title="Excluir"
                                                            >
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    strokeWidth={
                                                                        1.5
                                                                    }
                                                                    stroke="currentColor"
                                                                    className="size-6"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                                                    />
                                                                </svg>
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    situacao(
                                                                        row.produto_id,
                                                                    )
                                                                }
                                                                className={`transition ${
                                                                    !row.produto_ativo
                                                                        ? "text-orange-600 hover:text-orange-800"
                                                                        : "text-green-600 hover:text-green-800"
                                                                }`}
                                                                title={
                                                                    row.produto_ativo
                                                                        ? "Desativar produto"
                                                                        : "Ativar produto"
                                                                }
                                                            >
                                                                {!row.produto_ativo ? (
                                                                    // ÍCONE DESATIVAR (olho cortado)
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        fill="none"
                                                                        viewBox="0 0 24 24"
                                                                        strokeWidth={
                                                                            1.5
                                                                        }
                                                                        stroke="currentColor"
                                                                        className="size-6"
                                                                    >
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                                                                        />
                                                                    </svg>
                                                                ) : (
                                                                    // ÍCONE ATIVAR (olho)
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        fill="none"
                                                                        viewBox="0 0 24 24"
                                                                        strokeWidth={
                                                                            1.5
                                                                        }
                                                                        stroke="currentColor"
                                                                        className="size-6"
                                                                    >
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                                                                        />
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                                                        />
                                                                    </svg>
                                                                )}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Paginação */}
                                <div className="ml-12 flex flex-wrap gap-2">
                                    {produtos.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || "#"}
                                            preserveScroll
                                            className={`px-3 py-1 rounded border text-sm ${
                                                link.active
                                                    ? "bg-sky-950 text-white"
                                                    : "bg-white hover:bg-gray-100"
                                            } ${!link.url && "opacity-50 pointer-events-none"}`}
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
            <Footer />
        </>
    );
}
