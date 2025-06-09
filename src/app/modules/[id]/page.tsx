// import { notFound } from 'next/navigation';
import CardSet from '@/components/CardSet';

// DB function — replace this with actual DB call
// async function getModuleById(id: string) {
//     console.log(id);
// }

type Props = {
    params: {
        id: string;
    };
};

export default async function ModulePage({ params }: Props) {
    // const mod = await getModuleById(params.id);

    //   if (!mod) return notFound();

    return (
        <main className="min-h-screen bg-white flex flex-col items-center">
            <div className="w-full max-w-4xl p-6">
                <h2 className="text-3xl font-bold mb-4">{params.id}</h2>
                <input
                    type="text"
                    placeholder="Search for Modules (not implemented yet)..."
                    className="border rounded-md px-4 py-2 w-full mb-6"
                />
                <CardSet />
                <footer className="text-right text-sm text-gray-600 mt-8">
                    Alroy and Damien
                </footer>
            </div>
        </main>
    );
}
