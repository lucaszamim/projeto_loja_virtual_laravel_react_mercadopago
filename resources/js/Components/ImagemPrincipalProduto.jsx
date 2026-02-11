import { useEffect, useState } from "react";
import axios from "axios";
import ImagemPadraoProduto from '@/assets/produto.JPG';

export default function ImagemPrincipalProduto({ id, className = "" }) {
    const [imagem, setImagem] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        axios
            .get(`/get/galeria/produto/${id}/imagem-principal`)
            .then((res) => {
                setImagem(res.data.link_imagem);
            })
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return <div className="animate-pulse bg-gray-200 h-32 w-32 rounded" />;
    }

    if (!imagem) {
        return (
            <img
                src={ImagemPadraoProduto}
                alt="Sem imagem"
                className={className}
            />
        );
    }

    return (
        <img
            src={imagem}
            alt="Imagem principal do produto"
            className={className}
        />
    );
}
