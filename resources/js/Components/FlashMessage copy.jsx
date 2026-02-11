import { Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";

export default function FlashMessage() {
    const { flash } = usePage().props;

    const [show, setShow] = useState(false);
    const [message, setMessage] = useState(null);
    const [key, setKey] = useState(0);

    {
        /* useEffect(() => {
        const type = flash?.error
            ? "error"
            : flash?.warning
              ? "warning"
              : flash?.success
                ? "success"
                : null;

        if (!type) return;

        setMessage({
            type,
            text: flash[type],
        });

        setKey(Date.now());
        setShow(true);

        const timer = setTimeout(() => setShow(false), 4000);
        return () => clearTimeout(timer);
    }, [flash]);*/
    }
    useEffect(() => {
        if (!flash) return;

        const entries = Object.entries(flash).filter(([_, value]) => value);

        if (!entries.length) return;

        const [type, text] = entries[0];

        setMessage({ type, text });
        setKey(Date.now());
        setShow(true);

        const timer = setTimeout(() => setShow(false), 1000);
        return () => clearTimeout(timer);
    }, [flash]);

    if (!message) return null;

    const styles = {
        success: "bg-green-600",
        error: "bg-red-600",
        warning: "bg-yellow-500 text-black",
    };

    return (
        <Transition
            key={key}
            show={show}
            as={Fragment}
            enter="transition transform duration-300"
            enterFrom="-translate-y-10 opacity-0"
            enterTo="translate-y-0 opacity-100"
            leave="transition transform duration-300"
            leaveFrom="translate-y-0 opacity-100"
            leaveTo="-translate-y-10 opacity-0"
        >
            <div
                className={`fixed top-5 right-5 z-50 w-96 max-w-full rounded-lg px-6 py-4 shadow-lg ${
                    styles[message.type]
                }`}
            >
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{message.text}</span>
                    <button
                        onClick={() => setShow(false)}
                        className="ml-4 text-xl font-bold opacity-70 hover:opacity-100"
                    >
                        ×
                    </button>
                </div>
            </div>
        </Transition>
    );
}
