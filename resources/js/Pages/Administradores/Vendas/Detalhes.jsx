import AuthenticatedLayout from "@/Layouts/AuthenticatedLayoutAdmin";
import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import Footer from "@/Components/FooterDashboard";

export default function Detalhes({ venda = [], produtos = [], cliente = [] }) {
    const formatarMoeda = (valor) =>
        new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(Number(valor));

    const statusClass = (status) => {
        switch (status) {
            case "pago":
                return "bg-green-100 text-green-700";
            case "pendente":
                return "bg-yellow-100 text-yellow-700";
            case "cancelado":
                return "bg-red-100 text-red-700";
            case "enviado":
                return "bg-blue-100 text-blue-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const Label = ({ title, value }) => (
        <p className="text-sm text-gray-600">
            <span className="font-medium text-gray-700">{title}:</span>{" "}
            {value || "-"}
        </p>
    );

    const cancelarVenda = (id) => {
        if (!confirm("Tem certeza que deseja cancelar esta venda?")) {
            return;
        }

        router.post(
            route("mp.cancelar"),
            {
                id: id,
                origem: "cliente",
            },
            {
                preserveScroll: true,
            },
        );
    };

    const [vendaAberta, setVendaAberta] = useState(null);
    const [modalAberto, setModalAberto] = useState(false);
    const [vendaSelecionada, setVendaSelecionada] = useState(null);

    const [form, setForm] = useState({
        meio_envio: "",
        codigo_rastreio: "",
    });

    const abrirModal = (venda) => {
        setVendaSelecionada(venda);
        setForm({
            meio_envio: venda.meio_envio ?? "",
            codigo_rastreio: venda.codigo_rastreio ?? "",
        });
        setModalAberto(true);
    };

    const salvarEnvio = () => {
        router.patch(
            route("vendas.envio", vendaSelecionada.id),
            {
                id: vendaSelecionada.id,
                meio_envio: form.meio_envio,
                codigo_rastreio: form.codigo_rastreio,
                status: "enviado",
            },
            {
                preserveScroll: true,
                onSuccess: () => setModalAberto(false),
            },
        );
    };

    const estornarVenda = (id) => {
        if (!confirm("Tem certeza que deseja estornar esta venda?")) {
            return;
        }

        router.post(
            route("mp.estornar"),
            {
                id: id,
                origem: "cliente",
            },
            {
                preserveScroll: true,
            },
        );
    };

    return (
        <>
            <Head title="Detalhes da venda" />

            <AuthenticatedLayout
                header={
                    <h2 className="text-xl font-semibold text-gray-800">
                        <a
                            href={route("vendas.index")}
                            className="text-indigo-600"
                        >
                            Vendas
                        </a>{" "}
                        &gt; Detalhes da venda
                    </h2>
                }
            >
                <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
                    {venda?.map((row) => (
                        <div key={row.id} className="space-y-8">
                            {/* HEADER */}
                            <div className="bg-white border rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <p className="text-xl font-semibold text-gray-800">
                                        Venda #{row.id}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Realizada em {row.data_venda}
                                    </p>
                                </div>

                                <div className="flex flex-col items-start md:items-end gap-3">
                                    {/* STATUS */}
                                    <span
                                        className={`px-4 py-1 rounded-full text-sm font-semibold ${statusClass(
                                            row.status,
                                        )}`}
                                    >
                                        {row.status}
                                    </span>

                                    {/* AÇÕES */}
                                    <div className="flex gap-2">
                                        {/* CANCELAR */}
                                        {(row.status === "pendente" ||
                                            row.status === "pago") && (
                                            <button
                                                onClick={() =>
                                                    cancelarVenda(row.id)
                                                }
                                                className="px-3 py-1 text-sm rounded-lg border border-red-300 text-red-600 hover:bg-red-50"
                                            >
                                                Cancelar
                                            </button>
                                        )}

                                        {/* ESTORNAR */}
                                        {row.status === "pago" && (
                                            <button
                                                onClick={() =>
                                                    estornarVenda(row.id)
                                                }
                                                className="px-3 py-1 text-sm rounded-lg border border-yellow-300 text-yellow-700 hover:bg-yellow-50"
                                            >
                                                Estornar
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* INFORMAÇÕES */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* VENDA */}
                                <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-3">
                                    <h3 className="font-semibold text-gray-700">
                                        Informações da venda
                                    </h3>

                                    <Label
                                        title="Valor cobrado"
                                        value={
                                            <span className="font-semibold text-gray-800">
                                                {formatarMoeda(row.valor_final)}
                                            </span>
                                        }
                                    />
                                    <Label
                                        title="Envio"
                                        value={row.meio_envio}
                                    />
                                    <Label
                                        title="Código de rastreio"
                                        value={row.codigo_rastreio}
                                    />
                                    {cliente?.map((cli) => (
                                        <>
                                            <Label
                                                title="Cliente"
                                                value={cli.name}
                                            />
                                        </>
                                    ))}
                                    <Label
                                        title="Endereço de entrega"
                                        value={row.endereco_envio}
                                    />
                                    <Label
                                        title="Observações"
                                        value={row.observacao_entrega}
                                    />

                                    {(row.status === "pago" ||
                                        row.status === "enviado") && (
                                        <button
                                            onClick={() => abrirModal(row)}
                                            className="px-2 py-1 text-xs font-medium text-white bg-indigo-600 rounded hover:font-semibold hover:bg-indigo-700"
                                        >
                                            Editar envio
                                        </button>
                                    )}
                                </div>

                                {/* MERCADO PAGO */}
                                <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-3">
                                    <h3 className="font-semibold text-gray-700">
                                        Mercado Pago
                                    </h3>

                                    <Label
                                        title="Payment ID"
                                        value={row.payment_id}
                                    />
                                    <Label
                                        title="Método"
                                        value={row.payment_method}
                                    />
                                    <Label
                                        title="Status"
                                        value={row.payment_status}
                                    />
                                    <Label
                                        title="Referência"
                                        value={row.payment_external_reference}
                                    />
                                </div>

                                {/* RESUMO */}
                                <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 space-y-3">
                                    <h3 className="font-semibold text-indigo-700">
                                        Resumo
                                    </h3>

                                    <p className="text-sm text-indigo-700">
                                        Total de itens:{" "}
                                        <span className="font-semibold">
                                            {produtos.length}
                                        </span>
                                    </p>

                                    <p className="text-sm text-indigo-700">
                                        Valor da venda:{" "}
                                        <span className="font-semibold">
                                            {formatarMoeda(row.valor_total)}
                                        </span>
                                    </p>

                                    <p className="text-sm text-indigo-700">
                                        Descontos:{" "}
                                        <span className="font-semibold">
                                            {row.desconto != null
                                                ? formatarMoeda(row.desconto)
                                                : formatarMoeda(0)}
                                        </span>
                                    </p>

                                    <p className="text-sm text-indigo-700">
                                        Valor final:{" "}
                                        <span className="font-semibold">
                                            {formatarMoeda(row.valor_final)}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            {/* PRODUTOS */}
                            <div className="bg-white border rounded-2xl p-6 shadow-sm">
                                <h3 className="font-semibold text-gray-700 mb-4">
                                    Produtos do pedido
                                </h3>

                                <ul className="space-y-4">
                                    {produtos?.map((produto, index) => (
                                        <li
                                            key={index}
                                            className="flex justify-between items-center p-4 border rounded-xl hover:bg-gray-50 transition"
                                        >
                                            <div>
                                                <p className="font-medium text-gray-800">
                                                    {produto.produto_nome}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Quantidade:{" "}
                                                    {produto.quantidade}
                                                </p>
                                            </div>

                                            <p className="font-semibold text-gray-800">
                                                {formatarMoeda(produto.valor)}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </AuthenticatedLayout>

            {/* MODAL EDITAR ENVIO */}
            {modalAberto && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800">
                            Editar envio #{vendaSelecionada.id}
                        </h3>

                        <hr className="my-6 border-gray-200" />

                        {/* <div>
                            <label className="text-sm font-medium text-gray-700">
                                Status
                            </label>
                            <select
                                value={form.status}
                                name="status"
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        status: e.target.value,
                                    })
                                }
                                className="mt-1 w-full border rounded-lg px-3 py-2"
                            >
                                <option value="enviado">Enviado</option>
                                <option value="pago">Pago</option>
                            </select>
                        </div>*/}

                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Meio de envio
                            </label>
                            <select
                                value={form.meio_envio}
                                name="meio_envio"
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        status: e.target.value,
                                    })
                                }
                                className="mt-1 w-full border rounded-lg px-3 py-2"
                            >
                                <option value="correios">Correios</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Código de rastreio
                            </label>
                            <input
                                type="text"
                                value={form.codigo_rastreio}
                                name="codigo_rastreio"
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        codigo_rastreio: e.target.value,
                                    })
                                }
                                className="mt-1 w-full border rounded-lg px-3 py-2"
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                onClick={() => setModalAberto(false)}
                                className="px-4 py-2 border rounded-lg text-gray-600"
                            >
                                Cancelar
                            </button>

                            <button
                                onClick={salvarEnvio}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                            >
                                Salvar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </>
    );
}
