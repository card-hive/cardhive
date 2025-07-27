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

    // 1. Fetch card ids from the cardset
    const { data: cardset, error: setError } = await supabase
        .from('flashcard_sets')
        .select('cards, owner')
        .eq('cardset_id', cardsetId)
        .single();

    if (setError || !cardset) {
        console.error('Failed to load cardset:', setError);
        return notFound();
    }

    if (cardset.cards.length == 0) {
        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();
        if (userError || !user) redirect('/login');
        return (
            <div className="flex flex-col items-center justify-center mt-12">
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 shadow-md max-w-md text-center">
                    <p className="text-lg text-gray-700 mb-6">
                        This set doesn’t have any cards yet.
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

    // 2. Fetch the actual cards
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

    return (
        <main className="max-w-4xl mx-auto p-6">
            <FlashcardRenderer
                cards={cards}
                cardsetId={cardsetId}
                ownerId={cardset.owner}
            />
            <Link
                className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                href={`/cardview/${cardsetId}/testview`}
            >
                Start Test
            </Link>
        </main>
    );
}
