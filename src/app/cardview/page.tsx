import { supabase } from '@/lib/supabaseClient';
import { notFound } from 'next/navigation';
import FlashcardRenderer from '@/components/FlashcardRenderer'; // adjust path as needed

export default async function CardView() {
    const setId = '83b83201-e062-4edd-87fb-5d3fba686fa8';
    const { data: rawCards, error } = await supabase
        .from('cards')
        .select('*')
        .eq('cardset_id', setId);
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
