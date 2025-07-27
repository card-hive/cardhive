import { notFound } from 'next/navigation';
import CardSetGrid from '@/components/CardSetGrid';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

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
        .select('cardset_id, title, description, image, verified')
        .overlaps('modules', [module.module_id]);

    if (cardsetsError) {
        console.error('Cardset fetch failed:', cardsetsError);
        return <div>Error fetching cardsets.</div>;
    }

    const filteredSets = searchQuery
        ? cardsets?.filter(
              (set) =>
                  set.title?.toLowerCase().includes(searchQuery) ||
                  set.description?.toLowerCase().includes(searchQuery),
          )
        : cardsets;

    const enrichedSets = await Promise.all(
        (filteredSets || []).map(async (set) => {
            let verifiers: {
                name: string;
                account_type: 'Student' | 'TA' | 'Professor';
            }[] = [];

            if (Array.isArray(set.verified) && set.verified.length > 0) {
                const { data: verifierData, error: verifierError } =
                    await supabase
                        .from('accounts')
                        .select('name, account_type, account_id')
                        .in('account_id', set.verified);

                if (!verifierError && verifierData) {
                    verifiers = verifierData.map((v) => ({
                        name: v.name || 'Unnamed User',
                        account_type:
                            v.account_type === 'Professor'
                                ? 'Professor'
                                : v.account_type === 'TA'
                                  ? 'TA'
                                  : 'Student',
                    }));
                }
            }

            return {
                id: set.cardset_id,
                title: set.title,
                description: set.description || '',
                image: set.image,
                verifiers,
            };
        }),
    );
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

                <div className="flex justify-end mb-6">
                    <Link
                        href={`/new/${moduleCode}`}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        + New Set with {moduleCode} Content
                    </Link>
                </div>

                {enrichedSets && enrichedSets.length > 0 ? (
                    <CardSetGrid cardsets={enrichedSets} />
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
