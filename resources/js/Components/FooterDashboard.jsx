export default function FooterDashboard() {
    return (
        <footer className="">
            <div className="mx-auto max-w-7xl px-4 py-12">
                {/* Rodapé inferior */}
                <div className="text-center text-sm text-gray-500">
                    <div className="">© {new Date().getFullYear()}{" "}
                    <span className="font-medium text-gray-600">
                        e-loja
                    </span>
                    . Todos os direitos reservados.
                    </div>
                </div>
            </div>
        </footer>
    );
}
