import { supabase } from '@/lib/supabaseClient';
import { notFound } from 'next/navigation';
import FlashcardTest from '@/components/FlashcardTest';

type Params = { cardset_id: string };

export default async function TestView({
    params,
}: {
    params: Promise<Params>;
}) {
    const { cardset_id: cardsetId } = await params;

    const { data: cardset, error: setError } = await supabase
        .from('flashcard_sets')
        .select('cards')
        .eq('cardset_id', cardsetId)
        .single();

    if (setError || !cardset) {
        console.error('Failed to load cardset:', setError);
        return notFound();
    }

    const { data: rawCards, error: cardsError } = await supabase
        .from('cards')
        .select('*')
        .in('card_id', cardset.cards);

    if (cardsError || !rawCards || rawCards.length === 0) {
        return notFound();
    }

    const testCards = rawCards.map((card) => ({
        id: card.card_id,
        question: card.front,
        options: card.options || [], // assume options is an array column
        correctAnswer: card.correct_answer,
    }));

    return (
        <main className="max-w-4xl mx-auto p-6">
            <FlashcardTest cards={testCards} cardsetId={cardsetId} />
        </main>
    );
}
