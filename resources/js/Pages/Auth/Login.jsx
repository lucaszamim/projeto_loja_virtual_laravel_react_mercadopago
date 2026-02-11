import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import Navbar from "@/Components/Navbar";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import Logo from "@/Components/Logo";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <>
            <Head title="Login" />
            <Navbar />

            <section className="py-4 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 text-sm text-gray-600">
                    Login &gt; Acessar o sistema
                </div>
            </section>

            <GuestLayout>


                {/* Status */}
                {status && (
                    <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-700">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-4">
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
                            isFocused
                            required
                            onChange={(e) => setData("email", e.target.value)}
                        />
                        <InputError message={errors.email} className="mt-1" />
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
                            autoComplete="current-password"
                            required
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                        />
                        <InputError
                            message={errors.password}
                            className="mt-1"
                        />
                    </div>

                    {/* Lembrar + Recuperar senha */}
                    <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2">
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                onChange={(e) =>
                                    setData("remember", e.target.checked)
                                }
                            />
                            <span className="text-sm text-gray-600">
                                Lembrar acesso
                            </span>
                        </label>

                        {canResetPassword && (
                            <Link
                                href={route("password.request")}
                                className="text-sm text-indigo-600 hover:underline"
                            >
                                Esqueceu a senha?
                            </Link>
                        )}
                    </div>

                    {/* Ações */}
                    <div className="flex flex-col gap-3 pt-2">
                        <PrimaryButton
                            className="w-full justify-center"
                            disabled={processing}
                        >
                            {processing ? "Entrando..." : "Acessar"}
                        </PrimaryButton>

                        <Link href={route("register")}>
                            <SecondaryButton className="w-full justify-center">
                                Criar conta
                            </SecondaryButton>
                        </Link>
                    </div>
                </form>
            </GuestLayout>
        </>
    );
}
