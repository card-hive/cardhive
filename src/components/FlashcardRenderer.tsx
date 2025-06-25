'use client';

import { FlashcardArray } from 'react-quizlet-flashcard';

interface Flashcard {
    id: number;
    frontHTML: React.ReactNode;
    backHTML: React.ReactNode;
}

export default function FlashcardRenderer({ cards }: { cards: Flashcard[] }) {
    return (
        <div className="flex flex-col items-center justify-start">
            <FlashcardArray cards={cards} />
        </div>
    );
}
