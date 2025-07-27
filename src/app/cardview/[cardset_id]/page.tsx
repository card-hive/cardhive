import { notFound, redirect } from 'next/navigation';
import FlashcardRenderer from '@/components/FlashcardRenderer';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';

type Params = { cardset_id: string };

export default async function CardView({
    params,
}: {
    params: Promise<Params>;
}) {
    const { cardset_id: cardsetId } = await params;
    const supabase = await createClient();
    let myAccountType = 'none';

    const { data: cardsetNameData, error: nameError } = await supabase
        .from('flashcard_sets')
        .select('title')
        .eq('cardset_id', cardsetId)
        .single();
    if (nameError || !cardsetNameData) {
        console.error('Failed to load cardset name:', nameError);
        return notFound();
    }

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();
    if (user) {
        const { data, error } = await supabase
            .from('accounts')
            .select('account_type')
            .eq('account_id', user.id)
            .single();

        if (error) {
            console.error('Failed to fetch account type:', error);
        } else {
            myAccountType = data.account_type;
        }
    }
    if (userError) redirect('/login');
    if (user == null) redirect('/login');

    const { data: cardset, error: setError } = await supabase
        .from('flashcard_sets')
        .select('cards, owner, verified')
        .eq('cardset_id', cardsetId)
        .single();

    if (setError || !cardset) {
        console.error('Failed to load cardset:', setError);
        return notFound();
    }

    if (cardset.cards.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center mt-12">
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 shadow-md max-w-md text-center">
                    <p className="text-lg text-gray-700 mb-6">
                        The cardset {cardsetNameData?.title} is empty.
                    </p>

                    {user.id === cardset.owner && (
                        <Link
                            href={`/cardview/${cardsetId}/edit`}
                            className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700 transition"
                        >
                            Add Cards to Set
                        </Link>
                    )}
                </div>
            </div>
        );
    }

    const { data: rawCards, error: cardsError } = await supabase
        .from('cards')
        .select('*')
        .in('card_id', cardset.cards);

    if (cardsError || !rawCards) {
        return notFound();
    }

    const cards = rawCards.map((card) => ({
        id: card.card_id,
        frontHTML: (
            <div className="flex items-center justify-center h-full p-6">
                <p className="text-xl">{card.front}</p>
            </div>
        ),
        backHTML: (
            <div className="flex items-center justify-center h-full p-6">
                <p className="text-xl">{card.back}</p>
            </div>
        ),
        front: card.front,
        back: card.back,
    }));

    const hasVerified = cardset.verified?.includes(user.id);

    async function handleVerify() {
        'use server';
        const supabaseServer = await createClient();

        await supabaseServer.rpc('append_verifier_to_set', {
            set_id_input: cardsetId,
            verifier_id_input: user ? user.id : '',
        });
        redirect(`/cardview/${cardsetId}`);
    }

    return (
        <main className="max-w-4xl mx-auto p-6">
            <FlashcardRenderer
                cards={cards}
                cardsetId={cardsetId}
                ownerId={cardset.owner}
            />

            {user.id !== cardset.owner && (
                <form action={handleVerify}>
                    <button
                        type="submit"
                        disabled={hasVerified}
                        className={`mt-4 px-6 py-2 rounded-md transition ${
                            hasVerified
                                ? 'bg-green-400 cursor-not-allowed'
                                : 'bg-green-600 hover:bg-green-700 text-white cursor-pointer'
                        }`}
                    >
                        {hasVerified
                            ? 'Already Verified ✅'
                            : `Verify This Card Set as ${myAccountType}`}
                    </button>
                </form>
            )}

            <Link
                className="inline-block mt-6 px-6 py-3 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition"
                href={`/cardview/${cardsetId}/testview`}
            >
                Test Yourself!
            </Link>
        </main>
    );
}
