import { supabase } from '@/lib/supabaseClient';
import { notFound } from 'next/navigation';
import FlashcardRenderer from '@/components/FlashcardRenderer';
import Link from 'next/link';

type Params = { cardset_id: string };

export default async function CardView({
    params,
}: {
    params: Promise<Params>;
}) {
    const { cardset_id: cardsetId } = await params;

    // 1. Fetch card ids from the cardset
    const { data: cardset, error: setError } = await supabase
        .from('flashcard_sets')
        .select('cards')
        .eq('cardset_id', cardsetId)
        .single();

    if (setError || !cardset) {
        console.error('Failed to load cardset:', setError);
        return notFound();
    }

    // 2. Fetch the actual cards
    const { data: rawCards, error: cardsError } = await supabase
        .from('cards')
        .select('*')
        .in('card_id', cardset.cards);

    // console.log('Fetched cards:', rawCards, 'Error:', cardsError);

    if (cardsError || !rawCards || rawCards.length === 0) {
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
    }));

    return (
        <main className="max-w-4xl mx-auto p-6">
            <FlashcardRenderer cards={cards} />
            <Link
                className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                href={`/cardview/${cardsetId}/testview`}
            >
                Start Test
            </Link>
        </main>
    );
}
