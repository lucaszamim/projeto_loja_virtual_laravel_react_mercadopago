import AuthenticatedLayout from "@/Layouts/AuthenticatedLayoutCliente";
import { Head, Link, useForm, router } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Transition } from "@headlessui/react";
import { useState } from "react";
import Footer from "@/Components/FooterDashboard";

export default function Enderecos({ dados, estados }) {
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
        id_usuario: "",
        endereco_tipo: "",
        endereco_rua: "",
        endereco_numero: "",
        endereco_bairro: "",
        endereco_complemento: "",
        endereco_referencia: "",
        endereco_cidade: "",
        endereco_cep: "",
        endereco_id_estado: "",
    });

    const [editando, setEditando] = useState(null);

    const submit = (e) => {
        e.preventDefault();

        if (editando) {
            patch(route("enderecos.update", editando), {
                onSuccess: () => {
                    reset();
                    setEditando(null);
                },
            });
        } else {
            post(route("enderecos.store"), {
                onSuccess: () => reset(),
            });
        }
    };

    const deletar = (id) => {
        if (confirm("ATENÇÃO: Deseja realmente excluir?")) {
            router.delete(route("enderecos.destroy", id), {
                preserveScroll: true,
            });
        }
    };

    const editar = (row) => {
        setEditando(row.id);
        setData({
            id_usuario: row.id_usuario || "",
            endereco_tipo: row.endereco_tipo || "",
            endereco_rua: row.endereco_rua || "",
            endereco_numero: row.endereco_numero || "",
            endereco_bairro: row.endereco_bairro || "",
            endereco_complemento: row.endereco_complemento || "",
            endereco_referencia: row.endereco_referencia || "",
            endereco_cidade: row.endereco_cidade || "",
            endereco_cep: row.endereco_cep || "",
            endereco_id_estado: row.endereco_id_estado || "",
        });
    };

    return (
        <>
            <Head title="Endereços" />

            <AuthenticatedLayout
                header={
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Endereços
                    </h2>
                }
            >
                <div className="py-12">
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="ml-2 p-2 text-gray-900">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="... ">
                                        <form
                                            onSubmit={submit}
                                            className="mt-2 space-y-6 rounded-lg bg-slate-50 p-6 border"
                                        >
                                            <h3 className="text-lg font-semibold text-gray-700">
                                                {editando
                                                    ? "Editar endereço"
                                                    : "Novo endereço"}
                                            </h3>

                                            {/* erros */}
                                            {Object.values(errors).length >
                                                0 && (
                                                <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
                                                    <ul className="list-disc pl-5">
                                                        {Object.values(
                                                            errors,
                                                        ).map(
                                                            (error, index) => (
                                                                <li key={index}>
                                                                    {error}
                                                                </li>
                                                            ),
                                                        )}
                                                    </ul>
                                                </div>
                                            )}

                                            {/* Tipo */}
                                            <div>
                                                <InputLabel value="Tipo de endereço*" />
                                                <TextInput
                                                    value={data.endereco_tipo}
                                                    onChange={(e) =>
                                                        setData(
                                                            "endereco_tipo",
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="mt-1 block w-full"
                                                    placeholder="Casa, Trabalho..."
                                                    required
                                                    autoFocus
                                                />
                                                <InputError
                                                    message={
                                                        errors.endereco_tipo
                                                    }
                                                />
                                            </div>

                                            {/* Rua + Número */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <InputLabel value="Rua*" />
                                                    <TextInput
                                                        value={
                                                            data.endereco_rua
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                "endereco_rua",
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="mt-1 block w-full"
                                                        placeholder="Rua..."
                                                        required
                                                    />
                                                    <InputError
                                                        message={
                                                            errors.endereco_rua
                                                        }
                                                    />
                                                </div>

                                                <div>
                                                    <InputLabel value="Número*" />
                                                    <TextInput
                                                        value={
                                                            data.endereco_numero
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                "endereco_numero",
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="mt-1 block w-full"
                                                        placeholder="Número..."
                                                        required
                                                    />
                                                    <InputError
                                                        message={
                                                            errors.endereco_numero
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <InputLabel value="Bairro*" />
                                                    <TextInput
                                                        value={
                                                            data.endereco_bairro
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                "endereco_bairro",
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="mt-1 block w-full"
                                                        placeholder="Bairro..."
                                                        required
                                                    />
                                                    <InputError
                                                        message={
                                                            errors.endereco_numero
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <InputLabel value="Complemento*" />
                                                    <TextInput
                                                        value={
                                                            data.endereco_complemento
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                "endereco_complemento",
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="mt-1 block w-full"
                                                        placeholder="Complemento..."
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            {/* Cidade + Estado */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <InputLabel value="Cidade*" />
                                                    <TextInput
                                                        value={
                                                            data.endereco_cidade
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                "endereco_cidade",
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="mt-1 block w-full"
                                                        placeholder="Cidade..."
                                                        required
                                                    />
                                                </div>

                                                <div>
                                                    <InputLabel value="Estado*" />

                                                    <select
                                                        required
                                                        value={
                                                            data.endereco_id_estado
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                "endereco_id_estado",
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="mt-1 block w-full"
                                                    >
                                                        <option value="">
                                                            Selecione
                                                        </option>

                                                        {estados.map((sub) => (
                                                            <option
                                                                key={sub.id}
                                                                value={sub.id}
                                                            >
                                                                {sub.uf}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            {/* CEP */}

                                            {/* Complemento + Referência */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <InputLabel value="CEP*" />
                                                    <TextInput
                                                        value={
                                                            data.endereco_cep
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                "endereco_cep",
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="mt-1 block w-full"
                                                        placeholder="00000-000"
                                                        required
                                                    />
                                                    <InputError
                                                        message={
                                                            errors.endereco_cep
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <InputLabel value="Referência" />
                                                    <TextInput
                                                        value={
                                                            data.endereco_referencia
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                "endereco_referencia",
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="mt-1 block w-full"
                                                        placeholder="Referência..."
                                                    />
                                                </div>
                                            </div>

                                            {/* AÇÕES – intactas */}
                                            <div className="flex items-center gap-4 pt-4">
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
                                                        className="text-sm text-gray-500 hover:text-gray-700"
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
                                    <div className="col-span-1 mt-2 space-y-6">
                                        <ul className="ml-12 space-y-4">
                                            {dados.data.map((row) => (
                                                <li
                                                    key={row.id}
                                                    className="rounded-lg border bg-white p-4 shadow-sm hover:shadow transition"
                                                >
                                                    <div className="flex items-start justify-between gap-4">
                                                        {/* CONTEÚDO */}
                                                        <div className="space-y-1">
                                                            {/* Tipo */}
                                                            <h3 className="text-base font-semibold text-gray-800">
                                                                {
                                                                    row.endereco_tipo
                                                                }
                                                            </h3>

                                                            {/* Endereço */}
                                                            <p className="text-sm text-gray-700">
                                                                {
                                                                    row.endereco_rua
                                                                }
                                                                ,{" "}
                                                                {
                                                                    row.endereco_numero
                                                                },{" "}
                                                                {
                                                                    row.endereco_bairro
                                                                }
                                                                {row.endereco_complemento &&
                                                                    ` - ${row.endereco_complemento}`}
                                                            </p>



                                                            {/* Cidade / Estado / CEP */}
                                                            <p className="text-sm text-gray-600">
                                                                {
                                                                    row.endereco_cidade
                                                                }{" "}
                                                                – {row.uf} ·{" "}
                                                                {
                                                                    row.endereco_cep
                                                                }
                                                            </p>

                                                            {/* Referência */}
                                                            {row.endereco_referencia && (
                                                                <p className="text-sm text-gray-500">
                                                                    Ref:{" "}
                                                                    {
                                                                        row.endereco_referencia
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>

                                                        {/* AÇÕES – INTACTAS */}
                                                        <div className="flex gap-2 shrink-0">
                                                            <button
                                                                onClick={() =>
                                                                    editar(row)
                                                                }
                                                                className="text-indigo-600 hover:text-indigo-800"
                                                                title="Editar"
                                                            >
                                                                {/* ÍCONE EDITAR (igual) */}
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
                                                                {/* ÍCONE EXCLUIR (igual) */}
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
                                            {dados.links.map((link, index) => (
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
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
            <Footer/>
        </>
    );
}
