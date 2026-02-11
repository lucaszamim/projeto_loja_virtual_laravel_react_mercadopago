import AuthenticatedLayout from "@/Layouts/AuthenticatedLayoutCliente";
import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import Footer from "@/Components/FooterDashboard";
import {
    ChevronDownIcon,
    ChevronUpIcon,
    ShoppingBagIcon,
} from "@heroicons/react/24/outline";

export default function Pedidos({ pedidos = [] }) {
    const [pedidoProdutos, setPedidoProdutos] = useState(null);
    const [itensPedido, setItensPedido] = useState({});
    const [loadingPedido, setLoadingPedido] = useState({});
    const [errorPedido, setErrorPedido] = useState({});

    const abrirProdutos = async (pedidoId) => {
        if (pedidoProdutos === pedidoId) {
            setPedidoProdutos(null);
            return;
        }

        if (itensPedido[pedidoId]) {
            setPedidoProdutos(pedidoId);
            return;
        }

        setLoadingPedido((p) => ({ ...p, [pedidoId]: true }));
        setErrorPedido((p) => ({ ...p, [pedidoId]: null }));

        try {
            const response = await fetch(
                route("pedidos.detalhes.produtos", pedidoId),
            );
            if (!response.ok) throw new Error();

            const data = await response.json();
            setItensPedido((p) => ({
                ...p,
                [pedidoId]: Array.isArray(data) ? data : (data.produtos ?? []),
            }));
            setPedidoProdutos(pedidoId);
        } catch {
            setErrorPedido((p) => ({
                ...p,
                [pedidoId]: "Erro ao carregar produtos.",
            }));
        } finally {
            setLoadingPedido((p) => ({ ...p, [pedidoId]: false }));
        }
    };

    const [copiado, setCopiado] = useState(null);

    const copiarCodigo = async (texto, pedidoId) => {
        if (!texto) return;

        await navigator.clipboard.writeText(texto);
        setCopiado(pedidoId);

        setTimeout(() => setCopiado(null), 1500);
    };

    const moeda = (v) =>
        new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(Number(v));

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

    const cancelarPedido = (row) => {
        if (!confirm("Tem certeza que deseja cancelar este pedido?")) {
            return;
        }

        router.post(
            route("mp.cancelar"),
            {
                id: row.id,
                origem: "cliente",
            },
            {
                preserveScroll: true,
            },
        );
    };

    return (
        <>
            <Head title="Meus Pedidos" />

            <AuthenticatedLayout
                header={
                    <h2 className="text-xl font-semibold text-gray-800">
                        Pedidos
                    </h2>
                }
            >
                <div className="max-w-7xl mx-auto px-4 py-10 space-y-6">
                    {pedidos.length === 0 && (
                        <p className="text-center text-gray-500">
                            Nenhum pedido encontrado.
                        </p>
                    )}

                    {pedidos.map((row) => {
                        const aberto = pedidoProdutos === row.id;
                        const isPix = row.payment_method === "pix";

                        return (
                            <div
                                key={row.id}
                                className="bg-white border rounded-xl shadow-sm hover:shadow-md transition"
                            >
                                {/* HEADER */}
                                <div className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                    {/* INFO */}
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-500">
                                            Pedido
                                        </p>
                                        <h3 className="text-lg font-semibold text-gray-800">
                                            #{row.id}
                                        </h3>

                                        <p className="flex items-center gap-2 text-sm text-gray-500">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                                className="w-4 h-4"
                                            >
                                                <path d="M5.25 12a.75.75 0 0 1 .75-.75h.01a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-.75.75H6a.75.75 0 0 1-.75-.75V12ZM6 13.25a.75.75 0 0 0-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 0 0 .75-.75V14a.75.75 0 0 0-.75-.75H6ZM7.25 12a.75.75 0 0 1 .75-.75h.01a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-.75.75H8a.75.75 0 0 1-.75-.75V12ZM8 13.25a.75.75 0 0 0-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 0 0 .75-.75V14a.75.75 0 0 0-.75-.75H8ZM9.25 10a.75.75 0 0 1 .75-.75h.01a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-.75.75H10a.75.75 0 0 1-.75-.75V10ZM10 11.25a.75.75 0 0 0-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 0 0 .75-.75V12a.75.75 0 0 0-.75-.75H10ZM9.25 14a.75.75 0 0 1 .75-.75h.01a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-.75.75H10a.75.75 0 0 1-.75-.75V14ZM12 9.25a.75.75 0 0 0-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 0 0 .75-.75V10a.75.75 0 0 0-.75-.75H12ZM11.25 12a.75.75 0 0 1 .75-.75h.01a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-.75.75H12a.75.75 0 0 1-.75-.75V12ZM12 13.25a.75.75 0 0 0-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 0 0 .75-.75V14a.75.75 0 0 0-.75-.75H12ZM13.25 10a.75.75 0 0 1 .75-.75h.01a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-.75.75H14a.75.75 0 0 1-.75-.75V10ZM14 11.25a.75.75 0 0 0-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 0 0 .75-.75V12a.75.75 0 0 0-.75-.75H14Z" />
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2Zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75Z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>

                                            <span>{row.data_venda}</span>
                                        </p>

                                        <span
                                            className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${statusClass(
                                                row.status,
                                            )}`}
                                        >
                                            {row.status}
                                        </span>
                                        <p className="text-xs text-gray-500">
                                            {row.payment_status ===
                                                "pending" && (
                                                <button
                                                    onClick={() =>
                                                        cancelarPedido(row)
                                                    }
                                                    className="px-2 py-1 text-xs font-medium text-white bg-red-600 rounded hover:font-semibold hover:bg-red-700"
                                                >
                                                    Cancelar esse pedido?
                                                </button>
                                            )}

                                            {row.status === "enviado" && (
                                                <>
                                                    {" "}
                                                    rastreamento:{" "}
                                                    {row.meio_envio} {">"}{" "}
                                                    {row.codigo_rastreio}
                                                </>
                                            )}
                                        </p>
                                    </div>

                                    {/* TOTAL */}
                                    <div className="text-left lg:text-right">
                                        <p className="text-sm text-gray-500">
                                            Total
                                        </p>
                                        <p className="text-2xl font-bold text-indigo-700">
                                            {moeda(row.valor_final)}
                                        </p>

                                        <button
                                            onClick={() =>
                                                abrirProdutos(row.id)
                                            }
                                            className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:underline"
                                        >
                                            <ShoppingBagIcon className="w-5 h-5" />
                                            Produtos
                                            {aberto ? (
                                                <ChevronUpIcon className="w-4 h-4" />
                                            ) : (
                                                <ChevronDownIcon className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>

                                    {/* PAGAMENTO */}
                                    <div className="flex flex-col items-center gap-3">
                                        {isPix ? (
                                            <img
                                                src={`data:image/png;base64,${row.payment_qr_code_base64}`}
                                                alt="QR Code PIX"
                                                className="w-28 h-28 border rounded-lg"
                                            />
                                        ) : (
                                            <a
                                                href={row.payment_boleto_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-center justify-items-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition text-sm font-medium"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={1.5}
                                                    stroke="currentColor"
                                                    className="size-6"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z"
                                                    />
                                                </svg>
                                                Ver boleto
                                            </a>
                                        )}

                                        <div className="w-64">
                                            <textarea
                                                readOnly
                                                rows={1}
                                                value={
                                                    isPix
                                                        ? (row.payment_qr_code ??
                                                          "")
                                                        : (row.payment_barcode ??
                                                          "")
                                                }
                                                onClick={() =>
                                                    copiarCodigo(
                                                        isPix
                                                            ? row.payment_qr_code
                                                            : row.payment_barcode,
                                                        row.id,
                                                    )
                                                }
                                                className="
            w-full
            resize-none
            cursor-pointer
            rounded-lg
            border
            px-3 py-2
            text-xs
            text-gray-600
            text-center
            truncate
            bg-gray-50
            hover:bg-gray-100
            focus:outline-none
        "
                                            />

                                            {copiado === row.id && (
                                                <p className="mt-1 text-xs text-green-600 text-center">
                                                    Código copiado ✔
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* PRODUTOS */}
                                {aberto && (
                                    <div className="border-t bg-gray-50 p-5">
                                        {loadingPedido[row.id] && (
                                            <p className="text-sm text-gray-500">
                                                Carregando produtos...
                                            </p>
                                        )}

                                        {errorPedido[row.id] && (
                                            <p className="text-sm text-red-500">
                                                {errorPedido[row.id]}
                                            </p>
                                        )}

                                        <ul className="divide-y bg-white border rounded-lg">
                                            {itensPedido[row.id]?.map(
                                                (item) => (
                                                    <li
                                                        key={item.id}
                                                        className="p-4 flex justify-between items-center"
                                                    >
                                                        <div>
                                                            <p className="font-medium text-gray-800">
                                                                {item.produto}
                                                            </p>
                                                            <p className="text-sm text-gray-500">
                                                                Quantidade:{" "}
                                                                {
                                                                    item.quantidade
                                                                }
                                                            </p>
                                                        </div>
                                                        <span className="font-semibold text-gray-800">
                                                            {moeda(item.valor)}
                                                        </span>
                                                    </li>
                                                ),
                                            )}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </AuthenticatedLayout>

            <Footer />
        </>
    );
}
