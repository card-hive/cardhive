import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import FlashcardBundle from '@/components/FlashcardBundle';
import Link from 'next/link';
import { UUID } from 'crypto';

export default async function MyCardSetsPage() {
    const supabase = await createClient();

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) redirect('/login');

    const { data: account, error: accountError } = await supabase
        .from('accounts')
        .select('saved_sets')
        .eq('account_id', user.id)
        .single();

    if (accountError || !account) {
        console.error('No account or saved sets found:', accountError);
        return <p className="p-6 text-red-600">Error loading saved sets.</p>;
    }

    if (!account.saved_sets || account.saved_sets.length === 0) {
        return <p className="p-6">You don’t have any saved sets yet.</p>;
    }

    const { data: sets, error: setsError } = await supabase
        .from('flashcard_sets')
        .select('cardset_id, title, description, image, verified')
        .in('cardset_id', account.saved_sets);

    if (setsError) {
        console.error('Error fetching flashcard sets:', setsError);
        return <p className="p-6 text-red-600">Could not load saved sets.</p>;
    }

    if (!sets || sets.length === 0) {
        return (
            <div className="p-6 max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold mb-4">My Card Sets</h1>
                <p className="text-gray-500">
                    You don’t have any saved sets yet.
                </p>
            </div>
        );
    }

    const allVerifierUUIDs = [
        ...new Set(sets.flatMap((s) => s.verified || [])),
    ];

    const verifierMap: Record<
        string,
        { name: string; account_type: 'Student' | 'TA' | 'Professor' }
    > = {};

    if (allVerifierUUIDs.length > 0) {
        const { data: verifierAccounts, error: verifierError } = await supabase
            .from('accounts')
            .select('account_id, name, account_type')
            .in('account_id', allVerifierUUIDs);

        if (verifierError) {
            console.error('Error fetching verifiers:', verifierError);
        } else {
            verifierAccounts.forEach((v) => {
                verifierMap[v.account_id] = {
                    name: v.name,
                    account_type: v.account_type,
                };
            });
        }
    }

    const formattedSets = sets.map((set) => ({
        id: set.cardset_id,
        title: set.title,
        description: set.description || '',
        image: set.image,
        verifiers: (set.verified || [])
            .map((uuid: UUID) => verifierMap[uuid])
            .filter(Boolean),
    }));

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

            {formattedSets.length === 0 ? (
                <p className="text-gray-500">You don’t have any sets yet.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {formattedSets.map((set) => (
                        <FlashcardBundle
                            key={set.id}
                            cardset_id={set.id}
                            title={set.title}
                            description={set.description}
                            image={set.image}
                            verifiers={set.verifiers}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
