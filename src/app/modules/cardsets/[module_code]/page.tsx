import { notFound } from 'next/navigation';
import CardSetGrid from '@/components/CardSetGrid';
import { supabase } from '@/lib/supabaseClient';

type Params = { module_code: string };
type SearchParams = { q?: string };

export default async function CardsetsPage({
    params,
    searchParams,
}: {
    params: Promise<Params>;
    searchParams?: Promise<SearchParams>;
}) {
    const { module_code: moduleCode } = await params;
    const searchQuery = (await searchParams)?.q?.toLowerCase() || '';

    const { data: module, error: moduleError } = await supabase
        .from('modules')
        .select('module_id')
        .eq('code', moduleCode)
        .single();

    if (moduleError || !module) {
        console.error('Module not found:', moduleError);
        return notFound();
    }

    const { data: cardsets, error: cardsetsError } = await supabase
        .from('flashcard_sets')
        .select('*')
        .overlaps('modules', [module.module_id]);

    if (cardsetsError) {
        console.error('Cardset fetch failed:', cardsetsError);
        return <div>Error fetching cardsets.</div>;
    }

    const filteredSets = searchQuery
        ? cardsets?.filter((set) =>
              set.title?.toLowerCase().includes(searchQuery),
          )
        : cardsets;

    return (
        <main className="min-h-screen bg-white flex flex-col items-center">
            <div className="w-full max-w-4xl p-6">
                <h2 className="text-3xl font-bold mb-4">{moduleCode}</h2>

                <form action="" method="get" className="flex space-x-2 mb-6">
                    <input
                        type="text"
                        name="q"
                        placeholder="Search for cardset..."
                        defaultValue={(await searchParams)?.q || ''}
                        className="flex-1 border rounded-md px-4 py-2"
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                        Search
                    </button>
                </form>

                {/* ➕ Add Card Set */}
                <div className="flex justify-end mb-6">
                    <a
                        href={`/modules/cardsets/${moduleCode}/add_cardset`}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition"
                    >
                        + Add Card Set
                    </a>
                </div>

                {filteredSets && filteredSets.length > 0 ? (
                    <CardSetGrid cardsets={filteredSets} />
                ) : (
                    <p className="text-gray-500">No cardsets found.</p>
                )}

                <footer className="text-right text-sm text-gray-600 mt-8">
                    Alroy and Damien
                </footer>
            </div>
        </main>
    );
}
