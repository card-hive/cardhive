'use client';
import { FlashcardArray } from 'react-quizlet-flashcard';
import { notFound } from 'next/navigation';
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
        frontHTML: (
            <div className={'flex items-center justify-center h-full'}>
                <p className={'text-xl'}>{card.question}</p>
            </div>
        ),
        backHTML: (
            <div className={'flex items-center justify-center h-full'}>
                <p className={'text-xl'}>{card.answer}</p>
            </div>
        ),
    }));

    return (
        <main className={'max-w-4xl mx-auto p-6'}>
            <div className={'flex flex-col items-center justify-start'}>
                <FlashcardArray cards={cards} />
            </div>
        </main>
    );
}
