import AuthenticatedLayout from "@/Layouts/AuthenticatedLayoutAdmin";
import { Head, Link } from "@inertiajs/react";

export default function UsersRegistereds({ users }) {
    return (
        <>
            <Head title="Usuários cadastrados" />
            <AuthenticatedLayout
                header={
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Clientes
                    </h2>
                }
            >
                <div className="py-12">
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="ml-6 mt-6 text-gray-700 font-semibold">
                                Lista de clientes registrados
                            </div>
                            <ul className="m-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                                {users.data.map((user) => (
                                    <li
                                        key={user.id}
                                        className="rounded-lg border bg-gray-50 p-4 shadow-sm transition hover:shadow-md"
                                    >
                                        {/* Nome */}
                                        <div className="mb-3 flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-sky-700">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={1.5}
                                                    stroke="currentColor"
                                                    className="h-6 w-6"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                                    />
                                                </svg>
                                            </div>

                                            <div>
                                                <p className="text-sm text-gray-500">
                                                    Cliente
                                                </p>
                                                <p className="font-semibold text-gray-900">
                                                    {user.name}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Email */}
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className="h-5 w-5"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                                                />
                                            </svg>

                                            <span className="text-sm break-all">
                                                {user.email}
                                            </span>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            {/* Paginação */}
                            <div className="m-12 flex gap-2 mt-4">
                                {users.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || "#"}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                        className={`px-3 py-1 border rounded ${
                                            link.active
                                                ? "bg-sky-900 text-white"
                                                : "bg-white"
                                        } ${!link.url && "text-gray-400 cursor-not-allowed"}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}
