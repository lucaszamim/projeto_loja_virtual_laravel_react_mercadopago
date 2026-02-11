import { useState } from "react";
import SubcategoriaLista from "./SubcategoriaLista";
import { Link } from "@inertiajs/react";

export default function CategoriaItem({ categoria }) {
    const [aberto, setAberto] = useState(false);

    const temSubcategorias = categoria.subcategorias?.length > 0;

    return (
        <div className="border-b last:border-b-0 pb-2">
            {/* CATEGORIA */}
            <button
                type="button"
                onClick={() => setAberto(!aberto)}
                className="
                    w-full
                    flex items-center justify-between
                    py-2
                    text-left
                    font-semibold
                    text-gray-800
                    hover:text-green-600
                    transition
                "
            >
                <span>{categoria.nome}</span>

                {temSubcategorias && (
                    <span
                        className={`
                            transition-transform
                            ${aberto ? "rotate-90" : ""}
                        `}
                    >
                        ›
                    </span>
                )}
            </button>

            {/* SUBCATEGORIAS */}
            {temSubcategorias && aberto && (
                <SubcategoriaLista
                    subcategorias={categoria.subcategorias}
                />
            )}
        </div>
    );
}
