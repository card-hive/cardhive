import { supabase } from '@/lib/supabaseClient';
import { notFound } from 'next/navigation';
import FlashcardRenderer from '@/components/FlashcardRenderer'; // adjust path as needed

type Params = { cardset_id: string };

export default async function CardView({
    params,
}: {
    params: Promise<Params>;
}) {
    const { cardset_id: cardsetId } = await params;
    const { data: rawCards, error } = await supabase
        .from('cards')
        .select('*')
        .eq('cardset_id', cardsetId);
    // console.log('Fetched cards:', rawCards, 'Error:', error);

    if (error || !rawCards || rawCards.length === 0) {
        return notFound();
    }

    const cards = rawCards.map((card) => ({
        id: card.id,
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
        </main>
    );
}
