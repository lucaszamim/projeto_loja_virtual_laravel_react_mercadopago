import { Link } from "@inertiajs/react";

export default function ResponsiveNavLink({
    active = false,
    className = "",
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={`
                relative
                flex w-full items-center gap-3
                px-3 py-2 rounded-md
                transition-all duration-150 ease-in-out
                focus:outline-none focus:ring-2 focus:ring-indigo-400
                ${
                    active
                        ? "bg-slate-300 text-indigo-900 font-semibold"
                        : "bg-96-dark text-white hover:bg-slate-700 hover:text-indigo-100"
                }
                ${className}
            `}
        >
            {children}
        </Link>
    );
}

