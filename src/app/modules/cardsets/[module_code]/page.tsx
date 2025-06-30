import { notFound } from 'next/navigation';
import CardSetGrid from '@/components/CardSetGrid';
import { supabase } from '@/lib/supabaseClient';

type Params = { module_code: string };

export default async function CardsetsPage({
    params,
}: {
    params: Promise<Params>;
}) {
    const { module_code: moduleCode } = await params;

    // get UUID of module
    const { data: module, error: moduleError } = await supabase
        .from('modules')
        .select('module_id')
        .eq('code', moduleCode)
        .single();

    if (moduleError || !module) {
        console.error('Module not found:', moduleError);
        return notFound();
    }
    // get all cardsets for the mod
    const { data: cardsets, error: cardsetsError } = await supabase
        .from('flashcard_sets')
        .select('*')
        .overlaps('modules', [module.module_id]);

    if (cardsetsError) {
        console.error('Cardset fetch failed:', cardsetsError);
        return <div>Error fetching cardsets.</div>;
    }

    return (
        <main className="min-h-screen bg-white flex flex-col items-center">
            <div className="w-full max-w-4xl p-6">
                <div className="w-full max-w-4xl p-6">
                    <h2 className="text-3xl font-bold mb-4">{moduleCode}</h2>

                    <input
                        type="text"
                        placeholder="Search for cardset (not implemented yet)..."
                        className="border rounded-md px-4 py-2 w-full mb-6"
                    />

                    <div className="flex justify-end mb-6">
                        <a
                            href={`/modules/cardsets/${moduleCode}/add_cardset`}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition"
                        >
                            + Add Card Set
                        </a>
                    </div>
                </div>
                {/* <input
                    type="text"
                    placeholder="Search for cardset (not implemented yet)..."
                    className="border rounded-md px-4 py-2 w-full mb-6"
                /> */}
                <CardSetGrid cardsets={cardsets || []} />
                <footer className="text-right text-sm text-gray-600 mt-8">
                    Alroy and Damien
                </footer>
            </div>
        </main>
    );
}
