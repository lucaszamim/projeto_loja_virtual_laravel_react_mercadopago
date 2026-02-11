import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import Navbar from "@/Components/Navbar";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        phone_i: "",
        birth: "",
        password: "",
        password_confirmation: "",
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("register"), {
            onFinish: () =>
                reset("password", "password_confirmation"),
        });
    };

    return (
        <>
            <Navbar />

            <section className="py-4 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 text-sm text-gray-600">
                    <a href="/login" className="hover:underline">
                        Login
                    </a>{" "}
                    &gt; Criar uma conta
                </div>
            </section>

            <GuestLayout>
                <Head title="Criar sua conta" />

                <div className="mb-6">
                    <p className="mt-2 text-sm text-gray-600 text-center">
                        Preencha seus dados para criar sua conta.
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-4">
                    {/* Nome */}
                    <div>
                        <InputLabel htmlFor="name" value="Nome completo" />
                        <TextInput
                            id="name"
                            name="name"
                            value={data.name}
                            className="mt-1 block w-full"
                            autoComplete="name"
                            isFocused
                            onChange={(e) =>
                                setData("name", e.target.value)
                            }
                            required
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    {/* Email */}
                    <div>
                        <InputLabel htmlFor="email" value="E-mail" />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full"
                            autoComplete="username"
                            onChange={(e) =>
                                setData("email", e.target.value)
                            }
                            required
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    {/* Telefone */}
                    <div>
                        <InputLabel htmlFor="phone_i" value="Telefone" />
                        <TextInput
                            id="phone_i"
                            type="tel"
                            name="phone_i"
                            value={data.phone_i}
                            className="mt-1 block w-full"
                            placeholder="(99) 99999-9999"
                            onChange={(e) =>
                                setData("phone_i", e.target.value)
                            }
                            required
                        />
                        <InputError message={errors.phone_i} className="mt-2" />
                    </div>

                    {/* Data de nascimento */}
                    <div>
                        <InputLabel htmlFor="birth" value="Data de nascimento" />
                        <TextInput
                            id="birth"
                            type="date"
                            name="birth"
                            value={data.birth}
                            className="mt-1 block w-full"
                            onChange={(e) =>
                                setData("birth", e.target.value)
                            }
                            required
                        />
                        <InputError message={errors.birth} className="mt-2" />
                    </div>

                    {/* Senha */}
                    <div>
                        <InputLabel htmlFor="password" value="Senha" />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full"
                            autoComplete="new-password"
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            required
                        />
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    {/* Confirmar senha */}
                    <div>
                        <InputLabel
                            htmlFor="password_confirmation"
                            value="Confirmar senha"
                        />
                        <TextInput
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="mt-1 block w-full"
                            autoComplete="new-password"
                            onChange={(e) =>
                                setData(
                                    "password_confirmation",
                                    e.target.value
                                )
                            }
                            required
                        />
                        <InputError
                            message={errors.password_confirmation}
                            className="mt-2"
                        />
                    </div>

                    {/* Ações */}
                    <div className="flex items-center justify-between pt-4">
                        <Link
                            href={route("login")}
                            className="text-sm text-gray-600 underline hover:text-gray-900"
                        >
                            Já possui cadastro?
                        </Link>

                        <PrimaryButton disabled={processing}>
                            Registrar
                        </PrimaryButton>
                    </div>
                </form>
            </GuestLayout>
        </>
    );
}
