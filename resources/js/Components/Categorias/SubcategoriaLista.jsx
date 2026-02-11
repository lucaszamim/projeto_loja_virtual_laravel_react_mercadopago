import { Link } from "@inertiajs/react";

export default function SubcategoriaLista({ subcategorias = [] }) {
    if (!subcategorias.length) {
        return (
            <p className="ml-4 mt-2 text-sm text-gray-400">
                Nenhuma subcategoria disponível
            </p>
        );
    }

    return (
        <ul className="ml-4 mt-3 space-y-1">
            {subcategorias.map((sub) => (
                <li key={sub.id}>
                    <Link
                        href={`/site/produtos/buscar/subcategorias/${sub.id}`}
                        className="
                            flex items-center gap-2
                            text-sm text-gray-700
                            hover:text-green-600
                            transition
                        "
                    >
                        <span className="text-green-500">›</span>
                        {sub.nome}
                    </Link>
                </li>
            ))}
        </ul>
    );
}
