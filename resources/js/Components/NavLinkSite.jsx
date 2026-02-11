import { Link, usePage } from "@inertiajs/react";

export default function NavLink({ href, active, children }) {
    return (
        <Link
            href={href}
            className={`relative text-white hover:text-indigo-100 transition ${
                active
                    ? "font-semibold text-indigo-50"
                    : ""
            }`}
        >
            {children}
        </Link>
    );
}
