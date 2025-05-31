import ModuleGrid from '@/components/ModuleGrid';

export default function Modules() {
    return (
        <main className="min-h-screen bg-white flex flex-col items-center">
            <div className="w-full max-w-4xl p-6">
                <h2 className="text-3xl font-bold mb-4">Modules</h2>
                <input
                    type="text"
                    placeholder="Search for Modules..."
                    className="border rounded-md px-4 py-2 w-full mb-6"
                />
                <ModuleGrid />
                <footer className="text-right text-sm text-gray-600 mt-8">
                    Alroy and Damien
                </footer>
            </div>
        </main>
    );
}
