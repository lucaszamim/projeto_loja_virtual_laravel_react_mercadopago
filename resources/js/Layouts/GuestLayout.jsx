import Logo from '@/Components/Logo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex flex-col mt-4 items-center pt-4 sm:justify-center sm:pt-0">

            <div className="mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-xl border sm:max-w-md sm:rounded-lg">
                 {/* Logo */}
                <div className="mb-4 flex justify-center">
                    <Logo cor="preto" />
                </div>
                {children}
            </div>
        </div>
    );
}
