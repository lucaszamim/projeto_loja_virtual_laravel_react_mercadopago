import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { HomeIcon } from "@heroicons/react/24/solid";

export default function UsersRegistereds({ users }) {
    return (
        <>
            <Head title="Usuários cadastrados" />
            <AuthenticatedLayout
                header={
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Usuários registrados
                    </h2>
                }
            >
                <div className="py-12">
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="ml-6 p-6 text-gray-900">Lista de usuarios cadastrados</div>
                            <ul className="m-12 space-y-6">
                                {users.data.map((user) => (
                                    <li
                                        key={user.id}
                                        className="border p-2 rounded"
                                    >
                                        <p className="flex items-center gap-2">
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
                                                    d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                                />
                                            </svg>

                                            <strong>Nome:</strong> {user.name}
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none" viewBox="0 0 24 24"
                                                 strokeWidth={1.5}
                                                stroke="currentColor"
                                                className="size-6">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"/>
                                            </svg>

                                            <strong>Email:</strong> {user.email}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                            {/* Paginação */}
                            <div className="m-12 flex gap-2 mt-4">
                                {users.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-3 py-1 border rounded ${
                                            link.active ? 'bg-sky-900 text-white' : 'bg-white'
                                        } ${!link.url && 'text-gray-400 cursor-not-allowed'}`}
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
