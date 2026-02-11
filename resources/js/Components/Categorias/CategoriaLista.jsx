import { useEffect, useState } from "react";
import axios from "axios";
import CategoriaItem from "./CategoriaItem";

export default function CategoriaLista() {
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(false);

    useEffect(() => {
        let ativo = true;

        const carregarCategorias = async () => {
            try {
                const res = await axios.get(
                    "/site/produtos/categorias-menu"
                );

                if (ativo) {
                    setCategorias(res.data);
                }
            } catch (error) {
                console.error("Erro ao carregar categorias", error);
                if (ativo) setErro(true);
            } finally {
                if (ativo) setLoading(false);
            }
        };

        carregarCategorias();

        return () => {
            ativo = false;
        };
    }, []);

    if (loading) {
        return (
            <div className="space-y-4 animate-pulse">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-5 bg-gray-200 rounded" />
                ))}
            </div>
        );
    }

    if (erro) {
        return (
            <p className="text-sm text-red-500">
                Não foi possível carregar as categorias.
            </p>
        );
    }

    if (!categorias.length) {
        return (
            <p className="text-sm text-gray-400">
                Nenhuma categoria encontrada.
            </p>
        );
    }

    return (
        <div className="space-y-2">
            {categorias.map((categoria) => (
                <CategoriaItem
                    key={categoria.id}
                    categoria={categoria}
                />
            ))}
        </div>
    );
}
