'use client';
import { FlashcardArray } from 'react-quizlet-flashcard';
import { useParams, notFound } from 'next/navigation';
import cardSets from '@/data/cardSets';

export default function CardView() {
    // const { setId } = useParams();
    const setId = 'geography';
    const rawCards = cardSets[setId as keyof typeof cardSets];

    if (!rawCards) {
        return notFound();
    }

    const cards = rawCards.map((card) => ({
        id: card.id,
        frontHTML: <div>{card.question}</div>,
        backHTML: <div>{card.answer}</div>,
    }));

    return (
        <div>
            <FlashcardArray cards={cards} />
        </div>
    );
}
