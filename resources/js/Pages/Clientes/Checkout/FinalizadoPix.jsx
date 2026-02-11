import { useState } from "react";
import Navbar from "@/Components/Navbar.jsx";
import { Head } from "@inertiajs/react";

export default function FinalizadoPix({ venda, status }) {

    const [copiado, setCopiado] = useState(false);

    function formatarMoeda(valor) {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(Number(valor));
    }

    const copiarCodigo = () => {
        navigator.clipboard.writeText(venda.payment_qr_code);
        setCopiado(true);
        setTimeout(() => setCopiado(false), 2000);
    };

    return (
        <>
            <Navbar />
            <Head title="Pagamento por PIX" />
            {/* BARRA TOPO */}
            <section className="py-4 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 text-sm text-gray-600">
                    <a
                        href={route("carrinho.index")}
                        className="hover:underline"
                    >
                        Carrinho
                    </a>{" "}
                    &gt; Checkout &gt; Pagamento por PIX
                </div>
            </section>

            <div className="max-w-3xl mx-auto py-10 px-4">

                {/* Cabeçalho */}
                <div className="bg-white shadow rounded-lg p-6 mb-6">
                    <h1 className="text-2xl font-bold text-green-600">
                        Pedido realizado com sucesso!
                    </h1>

                    <p className="mt-2 text-gray-600">
                        Pedido: <strong>#000{venda.id}</strong>
                    </p>

                    <p className="mt-1 text-gray-600">
                        Valor: <strong>{formatarMoeda(venda.valor_final)}</strong>
                    </p>

                    <p className="mt-2">
                        Status:{" "}
                        <span className="font-semibold text-yellow-600">
                            {venda.payment_status}
                        </span>
                    </p>
                </div>

                {/* Card PIX */}
                <div className="bg-white shadow rounded-lg p-6 text-center">

                    <h2 className="text-xl font-semibold mb-4">
                        Pague com PIX
                    </h2>

                    {/* QR Code */}
                    <div className="flex justify-center mb-6">
                        <img
                            src={`data:image/png;base64,${venda.payment_qr_code_base64}`}
                            alt="QR Code PIX"
                            className="w-64 h-64"
                        />
                    </div>

                    {/* Código copia e cola */}
                    <div className="mb-4 text-center">
                        <textarea
                            readOnly
                            value={venda.payment_qr_code ?? ""}
                            className="w-full border rounded p-3 text-sm text-center"
                            rows={4}
                        />
                    </div>

                    <button
                        onClick={copiarCodigo}
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                    >
                        {copiado ? "Código copiado!" : "Copiar código PIX"}
                    </button>

                    <p className="mt-4 text-sm text-gray-500">
                        Após o pagamento, a confirmação pode levar alguns minutos.
                    </p>

                </div>

            </div>
        </>
    );
}
