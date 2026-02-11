import Navbar from "@/Components/Navbar";
import { Head, Link, router, usePage } from "@inertiajs/react";
import CategoriaLista from "@/Components/Categorias/CategoriaLista";
import Buscar from "@/Components/Buscar";
import { IMaskInput } from "react-imask";
import { useState, useEffect } from "react";
import Footer from "@/Components/FooterSite";

export default function Checkout({ carrinho, user, enderecos }) {
    const { errors } = usePage().props;
    const itens = Object.values(carrinho);
    const filtros = null;
    function formatarMoeda(valor) {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(Number(valor));
    }

    const [enderecoSelecionado, setEnderecoSelecionado] = useState(null);

    useEffect(() => {
        if (enderecos && enderecos.length > 0) {
            setEnderecoSelecionado(enderecos[0].id);
        }
    }, [enderecos]);

    const [formaPagamento, setFormaPagamento] = useState("pix");
    const [observacao, setObservacao] = useState("");
    const submit = (e) => {
        e.preventDefault();

        router.post(route("checkout.finalizar"), {
            endereco_id: enderecoSelecionado,
            forma_pagamento: formaPagamento,
            cpf: cpf,
            observacao_entrega: observacao,
        });
    };

    {
        /* VALIDAR CPF*/
    }
    function validarCPF(cpf) {
        cpf = cpf.replace(/\D/g, "");

        if (cpf.length !== 11) return false;
        if (/^(\d)\1+$/.test(cpf)) return false;

        let soma = 0;
        let resto;

        for (let i = 1; i <= 9; i++) {
            soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
        }

        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.substring(9, 10))) return false;

        soma = 0;
        for (let i = 1; i <= 10; i++) {
            soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
        }

        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;

        return resto === parseInt(cpf.substring(10, 11));
    }
    const [cpf, setCpf] = useState("");
    const [cpfValido, setCpfValido] = useState(true);

    return (
        <>
            <Navbar />
            <Head title="Checkout, pagamento" />
            {/* BARRA TOPO */}
            <section className="py-4 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 text-sm text-gray-600">
                    <a
                        href={route("carrinho.index")}
                        className="hover:underline"
                    >
                        Carrinho
                    </a>{" "}
                    &gt; Checkout
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
                                        Checkout
                                    </h1>

                                    <div>
                                        {Object.values(errors).length > 0 && (
                                            <div className="mt-2 mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
                                                <ul className="list-disc pl-5">
                                                    {Object.values(errors).map(
                                                        (error, index) => (
                                                            <li key={index}>
                                                                {error}
                                                            </li>
                                                        ),
                                                    )}
                                                </ul>
                                            </div>
                                        )}
                                    </div>

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
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {itens.map((item) => (
                                                    <tr
                                                        key={item.id}
                                                        className="border-b text-sm"
                                                    >
                                                        <td className="py-3">
                                                            {item.nome}
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
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="mt-4 flex justify-end">
                                        <div className="text-right">
                                            <p className="text-sm text-gray-600">
                                                Total
                                            </p>
                                            <p className="text-lg font-bold">
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
                                        </div>
                                    </div>

                                    <form onSubmit={submit}>
                                        {/* Dados do comprador */}
                                        <div className="mt-6 rounded-lg border bg-white p-5">
                                            <h3 className="mb-4 text-sm font-bold text-gray-700">
                                                Dados do comprador
                                            </h3>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                {/* Nome */}
                                                <div>
                                                    <label className="block mb-1 font-medium text-gray-600">
                                                        Nome completo
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={user.name}
                                                        disabled
                                                        className="w-full rounded border bg-gray-100 px-3 py-2 text-gray-700"
                                                    />
                                                </div>

                                                {/* Email */}
                                                <div>
                                                    <label className="block mb-1 font-medium text-gray-600">
                                                        E-mail
                                                    </label>
                                                    <input
                                                        type="email"
                                                        value={user.email}
                                                        disabled
                                                        className="w-full rounded border bg-gray-100 px-3 py-2 text-gray-700"
                                                    />
                                                </div>

                                                {/* CPF */}
                                                <div>
                                                    <label className="block mb-1 font-medium text-gray-600">
                                                        CPF{" "}
                                                        <span className="text-red-500">
                                                            *
                                                        </span>
                                                    </label>

                                                    <IMaskInput
                                                        mask="000.000.000-00"
                                                        name="cpf"
                                                        placeholder="000.000.000-00"
                                                        value={cpf}
                                                        onAccept={(value) => {
                                                            setCpf(value);

                                                            // valida só quando estiver completo
                                                            if (
                                                                value.replace(
                                                                    /\D/g,
                                                                    "",
                                                                ).length === 11
                                                            ) {
                                                                setCpfValido(
                                                                    validarCPF(
                                                                        value,
                                                                    ),
                                                                );
                                                            } else {
                                                                setCpfValido(
                                                                    true,
                                                                );
                                                            }
                                                        }}
                                                        className={`w-full rounded border px-3 py-2 ${
                                                            !cpfValido
                                                                ? "border-red-500"
                                                                : "border-gray-600"
                                                        }`}
                                                        required
                                                    />

                                                    {!cpfValido && (
                                                        <p className="mt-1 text-xs text-red-600">
                                                            CPF inválido
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Telefone */}
                                                <div>
                                                    <label className="block mb-1 font-medium text-gray-600">
                                                        Telefone{" "}
                                                    </label>
                                                    <IMaskInput
                                                        mask="(00) 00000-0000"
                                                        name="telefone"
                                                        placeholder="(00) 00000-0000"
                                                        className="w-full rounded border bg-gray-100 px-3 py-2 text-gray-700"
                                                        value={user.phone_i}
                                                        disabled
                                                    />
                                                </div>

                                                {/* Observação */}
                                                <div className="md:col-span-2">
                                                    <label className="block mb-1 font-medium text-gray-600">
                                                        Observação do pedido
                                                        (opcional)
                                                    </label>
                                                    <textarea
                                                        name="observacao"
                                                        rows={3}
                                                        value={observacao}
                                                        onChange={(e) =>
                                                            setObservacao(
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="Ex: entregar após as 18h"
                                                        className="w-full rounded border px-3 py-2 resize-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Endereços */}
                                        <div className="mt-8">
                                            <h3 className="mb-3 text-sm font-bold text-gray-700">
                                                Endereço de entrega
                                            </h3>

                                            <div className="space-y-3">
                                                {enderecos?.map((row) => (
                                                    <label
                                                        key={row.id}
                                                        className="flex cursor-pointer gap-3 rounded border p-4 hover:bg-gray-50"
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="endereco"
                                                            value={row.id}
                                                            required
                                                            checked={
                                                                enderecoSelecionado ===
                                                                row.id
                                                            }
                                                            onChange={() =>
                                                                setEnderecoSelecionado(
                                                                    row.id,
                                                                )
                                                            }
                                                            className="mt-1"
                                                        />
                                                        <div>
                                                            <p className="font-semibold">
                                                                {
                                                                    row.endereco_tipo
                                                                }
                                                            </p>
                                                            <p className="text-sm text-gray-700">
                                                                {
                                                                    row.endereco_rua
                                                                }
                                                                ,{" "}
                                                                {
                                                                    row.endereco_numero
                                                                }{" "}
                                                                –{" "}
                                                                {
                                                                    row.endereco_bairro
                                                                }
                                                            </p>
                                                            <p className="text-sm text-gray-600">
                                                                {
                                                                    row.endereco_cidade
                                                                }{" "}
                                                                / {row.uf} ·{" "}
                                                                {
                                                                    row.endereco_cep
                                                                }
                                                            </p>
                                                            {row.endereco_referencia && (
                                                                <p className="text-xs text-gray-500">
                                                                    Ref:{" "}
                                                                    {
                                                                        row.endereco_referencia
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Pagamento */}
                                        <div className="mt-8">
                                            <h3 className="mb-4 text-sm font-bold text-gray-700">
                                                Forma de pagamento
                                            </h3>

                                            <div className="space-y-3">
                                                {/* PIX */}
                                                <label className="flex cursor-pointer items-center gap-4 rounded border p-4 transition hover:bg-gray-100 has-[:checked]:border-green-500 has-[:checked]:bg-green-50">
                                                    <input
                                                        type="radio"
                                                        name="forma_pagamento"
                                                        value="pix"
                                                        checked={
                                                            formaPagamento ===
                                                            "pix"
                                                        }
                                                        onChange={() =>
                                                            setFormaPagamento(
                                                                "pix",
                                                            )
                                                        }
                                                        className="mt-1"
                                                        required
                                                    />

                                                    <div className="flex-1">
                                                        <p className="font-semibold text-gray-800">
                                                            PIX
                                                        </p>
                                                        <p className="text-xs text-gray-600">
                                                            Aprovação imediata
                                                        </p>
                                                    </div>

                                                    <span className="text-xs font-semibold text-green-600">
                                                        Recomendado
                                                    </span>
                                                </label>

                                                {/* BOLETO */}
                                                <label className="flex cursor-pointer items-center gap-4 rounded border p-4 transition hover:bg-gray-100 has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50">
                                                    <input
                                                        type="radio"
                                                        name="forma_pagamento"
                                                        value="boleto"
                                                        checked={
                                                            formaPagamento ===
                                                            "boleto"
                                                        }
                                                        onChange={() =>
                                                            setFormaPagamento(
                                                                "boleto",
                                                            )
                                                        }
                                                        className="mt-1"
                                                    />

                                                    <div className="flex-1">
                                                        <p className="font-semibold text-gray-800">
                                                            Boleto bancário
                                                        </p>
                                                        <p className="text-xs text-gray-600">
                                                            Vencimento em até 2
                                                            dias úteis
                                                        </p>
                                                    </div>
                                                </label>
                                            </div>
                                        </div>

                                        <p className="mt-4 text-xs text-gray-300">
                                            Transação segura, via Mercado pago.
                                        </p>
                                        <p className="mt-0 text-xs text-gray-300">
                                            O seu CPF não fica armazenado em
                                            nenhum lugar do sistema; ele é usado
                                            apenas para gerar o pagamento.
                                        </p>

                                        {/* botões */}
                                        <div className="mt-6 mb-6 flex justify-end gap-4">
                                            <a
                                                href={route("carrinho.index")}
                                                className="inline-block rounded border border-gray-600 bg-white px-6 py-3 font-medium text-gray-600 hover:bg-gray-800 hover:text-white transition-all duration-200"
                                            >
                                                Carrinho
                                            </a>

                                            <button
                                                type="submit"
                                                disabled={!cpfValido}
                                                className={`rounded px-6 py-3 text-white ${
                                                    cpfValido
                                                        ? "border border-green-700 bg-green-600 hover:bg-green-700 transition-all duration-200"
                                                        : "bg-gray-400 cursor-not-allowed"
                                                }`}
                                            >
                                                Confirmar e finalizar a minha
                                                compra
                                            </button>
                                        </div>
                                    </form>
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
