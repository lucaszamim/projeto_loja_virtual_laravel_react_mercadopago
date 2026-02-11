import AuthenticatedLayout from "@/Layouts/AuthenticatedLayoutAdmin";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import Footer from "@/Components/FooterDashboard";

export default function Vendas({ vendas = [] }) {
    const [vendaAberta, setVendaAberta] = useState(null);
    const [modalAberto, setModalAberto] = useState(false);
    const [vendaSelecionada, setVendaSelecionada] = useState(null);

    {
        /*status: "",*/
    }
    const [form, setForm] = useState({
        meio_envio: "",
        codigo_rastreio: "",
    });

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
                return "bg-gray-200 text-gray-700";
        }
    };

    {
        /*status: venda.status ?? "",*/
    }
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

    return (
        <>
            <Head title="Vendas" />

            <AuthenticatedLayout
                header={
                    <h2 className="text-xl font-semibold text-gray-800">
                        Vendas
                    </h2>
                }
            >
                <div className="max-w-7xl mx-auto px-4 py-10 space-y-6">
                    {vendas?.data?.length === 0 ? (
                        <p className="text-center text-gray-500">
                            Nenhuma venda encontrada...
                        </p>
                    ) : (
                        <>
                            <ul className="space-y-6">
                                {vendas?.data?.map((row) => (
                                    <li
                                        key={row.id}
                                        className="bg-white border rounded-xl shadow-sm hover:shadow-md transition"
                                    >
                                        {/* HEADER */}
                                        <div className="p-5 flex flex-col md:flex-row justify-between gap-4">
                                            <div className="space-y-1">
                                                <p className="font-semibold text-gray-800">
                                                    Venda #{row.id} -{" "}
                                                    {
                                                        row.payment_external_reference
                                                    }
                                                </p>

                                                <p className="text-sm text-gray-500">
                                                    Data: {row.data_venda}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Transação:{" "}
                                                    <span className="capitalize font-semibold">
                                                        {row.payment_method}
                                                        {" | "}
                                                        {row.payment_status}
                                                    </span>
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Payment:{" "}
                                                    <a
                                                        href={`/dashboard/admin/mercadopago/payment/${row.payment_id}`}
                                                    >
                                                        {row.payment_id}
                                                    </a>
                                                </p>
                                            </div>

                                            <div className="text-right space-y-2">
                                                <span
                                                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusClass(
                                                        row.status,
                                                    )}`}
                                                >
                                                    {row.status}
                                                </span>

                                                <p className="text-sm font-semibold text-gray-800">
                                                    {formatarMoeda(
                                                        row.valor_final,
                                                    )}
                                                </p>

                                                <div className="flex justify-end gap-3">
                                                    <a
                                                        href={`/dashboard/admin/vendas/detalhes/${row.id}`}
                                                        className="px-2 py-1 text-xs font-medium text-indigo-600 border border-indigo-600 bg-white rounded hover:font-semibold hover:bg-indigo-50"
                                                    >
                                                        Ver detalhes
                                                    </a>

                                                    {(row.status === "pago" ||
                                                        row.status ===
                                                            "enviado") && (
                                                        <button
                                                            onClick={() =>
                                                                abrirModal(row)
                                                            }
                                                            className="px-2 py-1 text-xs font-medium text-white bg-indigo-600 rounded hover:font-semibold hover:bg-indigo-700"
                                                        >
                                                            Editar envio
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* DETALHES */}
                                        {vendaAberta === row.id && (
                                            <div className="border-t px-5 py-4">
                                                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                                                    Itens da venda
                                                </h4>

                                                <ul className="space-y-3">
                                                    {row.itens.map((item) => (
                                                        <li
                                                            key={item.id}
                                                            className="flex items-center gap-4"
                                                        >
                                                            <img
                                                                src={
                                                                    item.produto
                                                                        .imagem
                                                                }
                                                                className="w-12 h-12 rounded object-cover border"
                                                            />

                                                            <div className="flex-1">
                                                                <p className="text-sm font-medium text-gray-800">
                                                                    {
                                                                        item
                                                                            .produto
                                                                            .nome
                                                                    }
                                                                </p>

                                                                <p className="text-xs text-gray-500">
                                                                    Quantidade:{" "}
                                                                    {
                                                                        item.quantidade
                                                                    }
                                                                </p>
                                                            </div>

                                                            <p className="text-sm font-semibold text-gray-700">
                                                                {formatarMoeda(
                                                                    item.valor,
                                                                )}
                                                            </p>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>

                            {/* PAGINAÇÃO */}
                            <div className="mt-8 flex justify-center gap-2">
                                {vendas?.links?.map((link, index) => (
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
                                        } ${
                                            !link.url &&
                                            "opacity-50 cursor-not-allowed"
                                        }`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
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
