import { router } from "@inertiajs/react";
import { useState } from "react";

export default function AdicionarCarrinho({
    produtoId,
    quantidade = 1,
    className = "",
    texto = "Comprar",
}) {
    const [loading, setLoading] = useState(false);

    const adicionar = () => {
        setLoading(true);

        router.post(
            route("adicionar.carrinho"),
            { produto_id: produtoId,
              quantidade : quantidade,
             },
            {
                preserveScroll: true,
                preserveState: true,
                onFinish: () => setLoading(false),
            }
        );
    };

    return (
        <button
            type="button"
            onClick={adicionar}
            disabled={loading}
            className={`
                mt-4 flex items-center justify-center gap-2
                rounded bg-green-600 py-2 text-sm font-semibold text-white
                transition hover:bg-green-700
                disabled:cursor-not-allowed disabled:opacity-70
                ${className}
            `}
        >
            {loading && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            )}
            {loading ? "Adicionando..." : texto}
        </button>
    );
}
