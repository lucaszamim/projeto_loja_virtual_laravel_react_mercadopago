import { useState } from "react";
import Logo from "@/Components/Logo";
import { usePage, Link } from "@inertiajs/react";
import NavLink from "@/Components/NavLinkSite";
import ResponsiveNavLink from "@/Components/ResponsiveNavLinkSite";
import FlashMessage from "@/Components/FlashMessage";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const { auth, cart } = usePage().props;
    const user = auth?.user;
    const cartCount = cart?.count ?? 0;
    const { url } = usePage();
    const isActive = (path) => url.startsWith(path);

    return (
        <>
            <FlashMessage />
            <nav className="bg-96 border-96-dark">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo */}
                        <div className="text-xl font-bold text-white">
                            <NavLink href="/">
                                <Logo />
                            </NavLink>
                        </div>

                        {/* Links Desktop */}
                        <div className="hidden md:flex space-x-6 items-center">
                            <NavLink
                                href={route("home")}
                                active={route().current("home")}
                            >
                                Home
                            </NavLink>

                            <NavLink
                                href={route("produtos.site.index")}
                                active={
                                    route().current("produtos.site.index") ||
                                    route().current("produto.site.show") ||
                                    route().current("produtos.*")
                                }
                            >
                                Produtos
                            </NavLink>

                            {!user && (
                                <>
                                    <NavLink
                                        href={route("login")}
                                        active={
                                            route().current("login") ||
                                            route().current("register")
                                        }
                                    >
                                        Login
                                    </NavLink>
                                </>
                            )}

                            <div className="relative group">
                                {/* Ícone da sacola */}
                                <NavLink
                                    href={route("carrinho.index")}
                                    active={route().current("carrinho.*")}
                                    title="Carrinho de compras"
                                    className="relative"
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
                                            d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z"
                                        />
                                    </svg>

                                    {cartCount > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                            {cartCount}
                                        </span>
                                    )}
                                </NavLink>

                                {/* Dropdown */}
                                <div className="absolute right-0 mt-2 w-48 rounded-md bg-white shadow-lg border border-gray-200 opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-200 z-50">
                                    <Link
                                        href={route("carrinho.index")}
                                        className="m-1 block px-4 py-2 text-sm border bg-gray-50 text-gray-800 hover:bg-gray-100 hover:font-semibold"
                                    >
                                        Ver carrinho
                                    </Link>

                                    <Link
                                        href={route("carrinho.checkout")}
                                        className="m-1 block px-4 py-2 text-sm border bg-gray-50 text-gray-800 hover:bg-gray-100 hover:font-semibold"
                                    >
                                        Finalizar compra
                                    </Link>
                                </div>


                            </div>
                            {user && (
                                <>
                                    <NavLink
                                        href={route("carrinho.checkout")}
                                        active={
                                            route().current("carrinho.checkout") ||
                                            route().current("checkout.*")
                                        }
                                    >
                                        Checkout
                                    </NavLink>

                                    <NavLink
                                        href="/dashboard"
                                        className="text-white hover:text-indigo-100"
                                    >
                                        Dashboard
                                    </NavLink>

                                    <Link
                                        href={route("logout")}
                                        method="post"
                                        as="button"
                                        className="text-white hover:text-indigo-100"
                                    >
                                        Sair
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Botão Mobile */}
                        <button
                            onClick={() => setOpen(!open)}
                            className="md:hidden text-2xl text-white"
                        >
                            ☰
                        </button>
                    </div>
                </div>

                {/* Menu Mobile */}
                {open && (
                    <div className="md:hidden border-96-dark px-4 py-2 space-y-2">
                        <ResponsiveNavLink
                            href={route("home")}
                            active={route().current("home")}
                        >
                            Home
                        </ResponsiveNavLink>

                        <ResponsiveNavLink
                            href={route("produtos.site.index")}
                            active={
                                route().current("produtos.site.index") ||
                                route().current("produto.site.show") ||
                                route().current("produtos.*")
                            }
                        >
                            Produtos
                        </ResponsiveNavLink>

                        {!user && (
                            <>
                                <ResponsiveNavLink
                                    href={route("login")}
                                    active={
                                        route().current("login") ||
                                        route().current("register")
                                    }
                                >
                                    Login
                                </ResponsiveNavLink>
                            </>
                        )}

                        <ResponsiveNavLink
                            href={route("carrinho.index")}
                            active={route().current("carrinho.*")}
                            title="Carrinho de compras"
                        >
                            <div className="relative">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-6 h-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z"
                                    />
                                </svg>

                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full">
                                        {cartCount}
                                    </span>
                                )}
                            </div>

                            <span>Carrinho</span>
                        </ResponsiveNavLink>

                        {user && (
                            <>

                                <ResponsiveNavLink
                                    href={route("carrinho.checkout")}
                                    active={
                                        route().current("carrinho.checkout") ||
                                        route().current("checkout*")
                                    }
                                >
                                    Checkout
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href="/dashboard"
                                    className="block text-white hover:text-indigo-200"
                                >
                                    Dashboard
                                </ResponsiveNavLink>

                                <ResponsiveNavLink
                                    href={route("logout")}
                                    method="post"
                                    as="button"
                                    className="text-white hover:text-indigo-200"
                                >
                                    Sair
                                </ResponsiveNavLink>
                                <hr className="block border-gray-300" />
                                <span className="block font-semibold text-white">
                                    Olá, {user.name}!
                                </span>
                            </>
                        )}
                    </div>
                )}
            </nav>
        </>
    );
}
