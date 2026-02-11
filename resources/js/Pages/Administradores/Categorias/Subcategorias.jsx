import AuthenticatedLayout from "@/Layouts/AuthenticatedLayoutAdmin";
import { Head, Link, useForm, router } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Transition } from "@headlessui/react";
import { useState } from "react";
import Footer from "@/Components/FooterDashboard";

export default function Subcategorias({ subcategorias, id_cat, categoria }) {
    const {
        data,
        setData,
        post,
        patch,
        reset,
        errors,
        processing,
        recentlySuccessful,
    } = useForm({
        nome: "",
        descricao: "",
        id_categoria: id_cat,
    });

    const submit = (e) => {
        e.preventDefault();

        if (editando) {
            patch(route("subcategorias.update", editando), {
                onSuccess: () => {
                    reset();
                    setEditando(null);
                },
            });
        } else {
            post(route("subcategorias.store"), {
                onSuccess: () => reset(),
            });
        }
    };

    const deletar = (id) => {
        if (confirm("ATENÇÃO: Deseja realmente excluir esta subcategoria?")) {
            router.delete(route("subcategorias.destroy", id), {
                preserveScroll: true,
            });
        }
    };

    const [editando, setEditando] = useState(null);

    const editar = (row) => {
        setEditando(row.id);
        setData({
            nome: row.nome,
            descricao: row.descricao || "",
        });
    };

    return (
        <>
            <Head title="Subcategorias" />
            <AuthenticatedLayout
                header={
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        <Link
                            href={route("categorias.index")}
                            className="text-indigo-600"
                        >
                            Categorias
                        </Link>{" "}
                        {">"} Subategorias {categoria && `> ${categoria}`}
                    </h2>
                }
            >
                <div className="py-12">
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="ml-2 p-2 text-gray-900">
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="... ">
                                        <form
                                            onSubmit={submit}
                                            className="mt-2 space-y-6 rounded-lg bg-slate-50 p-6 border"
                                        >
                                            <div>
                                                <InputLabel
                                                    htmlFor="nome"
                                                    value="Subcategoria*"
                                                />

                                                <TextInput
                                                    id="nome"
                                                    name="nome"
                                                    value={data.nome}
                                                    onChange={(e) =>
                                                        setData(
                                                            "nome",
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="mt-1 block w-full"
                                                    required
                                                    isFocused
                                                    autoComplete="nome"
                                                    placeholder="Nome da subcategoria"
                                                />

                                                <InputError
                                                    className="mt-2"
                                                    message={errors.nome}
                                                />

                                                <textarea
                                                    className="w-full mt-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 shadow-xs"
                                                    id="descricao"
                                                    name="descricao"
                                                    rows="5"
                                                    placeholder="Descrição da subcategoria... opcional"
                                                    value={data.descricao}
                                                    onChange={(e) =>
                                                        setData(
                                                            "descricao",
                                                            e.target.value,
                                                        )
                                                    }
                                                ></textarea>

                                                <InputError
                                                    className="mt-2"
                                                    message={errors.descricao}
                                                />
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <PrimaryButton
                                                    disabled={processing}
                                                >
                                                    {editando
                                                        ? "Atualizar"
                                                        : "Salvar"}
                                                </PrimaryButton>

                                                {editando && (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            reset();
                                                            setEditando(null);
                                                        }}
                                                        className="text-sm text-gray-500"
                                                    >
                                                        Cancelar
                                                    </button>
                                                )}

                                                <Transition
                                                    show={recentlySuccessful}
                                                    enter="transition ease-in-out"
                                                    enterFrom="opacity-0"
                                                    leave="transition ease-in-out"
                                                    leaveTo="opacity-0"
                                                >
                                                    <p className="text-sm text-gray-600">
                                                        Salvo.
                                                    </p>
                                                </Transition>
                                            </div>
                                        </form>
                                    </div>

                                    {/*cadastrados*/}
                                    <div className="col-span-2 mt-2 space-y-6">
                                        <ul className="ml-12 space-y-4">
                                            {subcategorias.data.map((row) => (
                                                <li
                                                    key={row.id}
                                                    className="rounded-lg border bg-white p-4 shadow-sm hover:shadow transition"
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div className="">
                                                            <h3 className="flex items-center gap-2 text-base">
                                                                <strong>
                                                                    Nome:
                                                                </strong>{" "}
                                                                {row.nome}
                                                            </h3>

                                                            <h5 className="flex items-center gap-2 text-gray-600 text-sm">
                                                                <strong>
                                                                    Descrição:
                                                                </strong>
                                                                {row.descricao ||
                                                                    "—"}
                                                            </h5>
                                                        </div>

                                                        {/* AÇÕES */}
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() =>
                                                                    editar(row)
                                                                }
                                                                className="text-indigo-600 hover:text-indigo-800"
                                                                title="Editar"
                                                            >
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    strokeWidth={
                                                                        1.5
                                                                    }
                                                                    stroke="currentColor"
                                                                    className="size-6"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                                                    />
                                                                </svg>
                                                            </button>

                                                            <button
                                                                onClick={() =>
                                                                    deletar(
                                                                        row.id,
                                                                    )
                                                                }
                                                                className="text-red-600 hover:text-red-800"
                                                                title="Excluir"
                                                            >
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    strokeWidth={
                                                                        1.5
                                                                    }
                                                                    stroke="currentColor"
                                                                    className="size-6"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                                                    />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                        {/* Paginação */}
                                        <div className="ml-12 flex flex-wrap gap-2">
                                            {subcategorias.links.map(
                                                (link, index) => (
                                                    <Link
                                                        key={index}
                                                        href={link.url || "#"}
                                                        preserveScroll
                                                        className={`px-3 py-1 rounded border text-sm ${
                                                            link.active
                                                                ? "bg-sky-950 text-white"
                                                                : "bg-white hover:bg-gray-100"
                                                        } ${!link.url && "opacity-50 pointer-events-none"}`}
                                                        dangerouslySetInnerHTML={{
                                                            __html: link.label,
                                                        }}
                                                    />
                                                ),
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
            <Footer />
        </>
    );
}
