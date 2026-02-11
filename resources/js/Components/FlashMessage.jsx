import { Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";

export default function FlashMessage() {
    const { flash } = usePage().props;

    const [show, setShow] = useState(false);
    const [message, setMessage] = useState(null);
    const [key, setKey] = useState(0);

    useEffect(() => {
        if (!flash) return;

        const entries = Object.entries(flash).filter(
            ([_, value]) => value
        );

        if (!entries.length) return;

        const [type, text] = entries[0];

        setMessage({ type, text });
        setKey(Date.now());
        setShow(true);

        const timer = setTimeout(() => setShow(false), 1000);
        return () => clearTimeout(timer);
    }, [flash]);

    if (!message) return null;

    const config = {
        success: {
            title: "Sucesso",
            bg: "bg-green-600",
            bar: "bg-green-300",
            icon: (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
            ),
        },
        error: {
            title: "Erro",
            bg: "bg-red-600",
            bar: "bg-red-300",
            icon: (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            ),
        },
        warning: {
            title: "Atenção",
            bg: "bg-yellow-500 text-black",
            bar: "bg-yellow-300",
            icon: (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 4h.01M10.29 3.86l-7.5 13A1.5 1.5 0 0 0 4.09 19h15.82a1.5 1.5 0 0 0 1.3-2.14l-7.5-13a1.5 1.5 0 0 0-2.62 0Z" />
                </svg>
            ),
        },
    };

    const current = config[message.type];

    return (
        <Transition
            key={key}
            show={show}
            as={Fragment}
            enter="transition ease-out duration-300"
            enterFrom="opacity-0 -translate-y-5 scale-95"
            enterTo="opacity-100 translate-y-0 scale-100"
            leave="transition ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 scale-100"
            leaveTo="opacity-0 -translate-y-5 scale-95"
        >
            <div className="fixed top-5 right-5 z-50 w-[360px] max-w-full">
                <div
                    className={`relative overflow-hidden rounded-xl px-5 py-4 shadow-xl backdrop-blur ${current.bg}`}
                >
                    {/* Barra de tempo */}
                    <div
                        className={`absolute bottom-0 left-0 h-1 ${current.bar} animate-[progress_1s_linear_forwards]`}
                    />

                    <div className="flex items-start gap-3 text-white">
                        <div className="mt-1">{current.icon}</div>

                        <div className="flex-1 text-white">
                            <p className="font-semibold">
                                {current.title}
                            </p>
                            <p className="text-sm opacity-90">
                                {message.text}
                            </p>
                        </div>

                        <button
                            onClick={() => setShow(false)}
                            className="text-xl leading-none opacity-80 hover:opacity-100 text-white"
                        >
                            ×
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    );
}
