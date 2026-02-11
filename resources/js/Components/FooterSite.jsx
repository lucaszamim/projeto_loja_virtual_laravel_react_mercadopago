import { Link } from "@inertiajs/react";

export default function FooterSite() {
    return (
        <footer className="mt-20 bg-96-dark text-gray-300">
            <div className="mx-auto max-w-7xl px-4 py-12">
                <div className="grid gap-10 md:grid-cols-3">
                    {/* Sobre */}
                    <div>
                        <h3 className="mb-4 text-lg font-semibold text-white">
                            Minha Loja
                        </h3>
                        <p className="text-sm leading-relaxed text-gray-400">
                            Loja virtual desenvolvida com Laravel, Inertia e
                            React, oferecendo praticidade e segurança para suas
                            compras online.
                        </p>
                    </div>

                    {/* Links */}
                    <nav aria-label="Links rápidos">
                        <h3 className="mb-4 text-lg font-semibold text-white">
                            Links rápidos
                        </h3>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <Link
                                    href={route("produtos.site.index")}
                                    className="transition hover:text-white"
                                >
                                    Produtos
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={route("carrinho.index")}
                                    className="transition hover:text-white"
                                >
                                    Carrinho
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={route("carrinho.checkout")}
                                    className="transition hover:text-white"
                                >
                                    Checkout
                                </Link>
                            </li>
                        </ul>
                    </nav>

                    {/* Contato */}
                    <div>
                        <h3 className="mb-4 text-lg font-semibold text-white">
                            Contato
                        </h3>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li>
                                <span className="font-medium text-gray-300">
                                    Email:
                                </span>{" "}
                                contato@minhaloja.com
                            </li>
                            <li>
                                <span className="font-medium text-gray-300">
                                    WhatsApp:
                                </span>{" "}
                                (00) 00000-0000
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Rodapé inferior */}
                <div className="mt-12 border-t border-white/10 pt-6 text-center text-sm text-gray-400">
                    <div className="mt-6">© {new Date().getFullYear()}{" "}
                    <span className="font-medium text-gray-300">
                        e-loja
                    </span>
                    . Todos os direitos reservados.
                    </div>
                </div>
            </div>
        </footer>
    );
}
