import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import FlashcardBundle from '@/components/FlashcardBundle';
import Link from 'next/link';

export default async function MyCardSetsPage() {
    const supabase = await createClient();

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) redirect('/login');

    const { data: sets, error: setsError } = await supabase
        .from('flashcard_sets')
        .select('cardset_id, title, description, image, verified')
        .eq('owner', user.id)
        .order('date_created', { ascending: false });

    if (setsError || !sets) {
        return (
            <div className="p-6 max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold mb-4">My Card Sets</h1>
                <p className="text-red-600">Failed to load sets.</p>
            </div>
        );
    }

    const verifierIds = sets.flatMap((s) => s.verified || []);
    let verifiersById: Record<string, { name: string; account_type: string }> =
        {};

    if (verifierIds.length > 0) {
        const { data: verifierData } = await supabase
            .from('accounts')
            .select('account_id, name, account_type')
            .in('account_id', verifierIds);

        if (verifierData) {
            verifiersById = verifierData.reduce(
                (acc, v) => {
                    acc[v.account_id] = {
                        name: v.name,
                        account_type: v.account_type,
                    };
                    return acc;
                },
                {} as Record<string, { name: string; account_type: string }>,
            );
        }
    }

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">My Card Sets</h1>
                <Link
                    href="/my_sets/new"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    + New Set
                </Link>
            </div>

            {sets.length === 0 ? (
                <p className="text-gray-500">You don’t have any sets yet.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {sets.map((set) => {
                        const resolvedVerifiers =
                            set.verified
                                ?.map((id: string) => verifiersById[id])
                                .filter(Boolean) || [];

                        return (
                            <FlashcardBundle
                                key={set.cardset_id}
                                cardset_id={set.cardset_id}
                                title={set.title}
                                description={set.description || ''}
                                image={set.image}
                                verifiers={resolvedVerifiers}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
}
