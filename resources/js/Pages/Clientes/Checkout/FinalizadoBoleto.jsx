import { useState } from "react";
import Navbar from "@/Components/Navbar.jsx";
import { Head } from "@inertiajs/react";

export default function FinalizadoBoleto({ venda, status }) {

    const [copiado, setCopiado] = useState(false);

    function formatarMoeda(valor) {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(Number(valor));
    }

    const copiarCodigo = () => {
        navigator.clipboard.writeText(venda.payment_barcode);
        setCopiado(true);
        setTimeout(() => setCopiado(false), 2000);
    };

    const statusCor = {
        pending: "text-yellow-600",
        approved: "text-green-600",
        cancelled: "text-red-600",
    };

    return (
        <>
            <Navbar />
            <Head title="Pagamento por Boleto" />

            {/* Breadcrumb */}
            <section className="py-4 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 text-sm text-gray-600">
                    <a
                        href={route("carrinho.index")}
                        className="hover:underline"
                    >
                        Carrinho
                    </a>{" "}
                    &gt; Checkout &gt; Pagamento por boleto
                </div>
            </section>

            <div className="max-w-3xl mx-auto py-10 px-4">

                {/* Cabeçalho */}
                <div className="bg-white shadow rounded-lg p-6 mb-6">
                    <h1 className="text-2xl font-bold text-green-600">
                        Pedido criado com sucesso!
                    </h1>

                    <p className="mt-2 text-gray-600">
                        Pedido: <strong>#000{venda.id}</strong>
                    </p>

                    <p className="mt-1 text-gray-600">
                        Valor: <strong>{formatarMoeda(venda.valor_final)}</strong>
                    </p>

                    <p className="mt-2">
                        Status:{" "}
                        <span className={`font-semibold ${statusCor[status]}`}>
                            {status}
                        </span>
                    </p>
                </div>

                {/* Card BOLETO */}
                {venda.payment_status === "pending" && (
                    <div className="bg-white shadow rounded-lg p-6 text-center">

                        <h2 className="text-xl font-semibold mb-4">
                            Pague com Boleto Bancário
                        </h2>

                        <p className="text-sm text-gray-600 mb-4">
                            O boleto pode levar até 3 dias úteis para compensação.
                        </p>

                        {/* Botão visualizar boleto */}
                        <a
                            href={venda.payment_boleto_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded hover:bg-indigo-700 transition mb-6"
                        >
                            Visualizar / Imprimir Boleto
                        </a>

                        {/* Código de barras */}
                        <div className="mb-4 text-center">
                            <textarea
                                readOnly
                                value={venda.payment_barcode ?? ""}
                                className="w-full border rounded p-3 text-sm text-center"
                                rows={3}
                            />
                        </div>

                        <button
                            onClick={copiarCodigo}
                            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                        >
                            {copiado ? "Código copiado!" : "Copiar código de barras"}
                        </button>

                        <p className="mt-4 text-sm text-gray-500">
                            Após o pagamento, a confirmação pode levar até 72h.
                        </p>
                    </div>
                )}

                {/* Se aprovado */}
                {status === "approved" && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center mt-6">
                        <h2 className="text-xl font-bold text-green-600 mb-2">
                            Pagamento confirmado!
                        </h2>
                        <p className="text-gray-600">
                            Seu pedido já está sendo processado.
                        </p>
                    </div>
                )}

                {/* Se cancelado */}
                {status === "cancelled" && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center mt-6">
                        <h2 className="text-xl font-bold text-red-600 mb-2">
                            Pagamento cancelado
                        </h2>
                        <p className="text-gray-600">
                            O boleto venceu ou foi cancelado.
                        </p>
                    </div>
                )}

            </div>
        </>
    );
}
