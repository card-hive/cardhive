'use client';

import { useState } from 'react';

type TestCard = {
    id: string;
    question: string;
    options: string[];
    correctAnswer: string;
};

export default function FlashcardTest({ cards }: { cards: TestCard[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [submitted, setSubmitted] = useState(false);

    const handleOptionClick = (selected: string) => {
        setAnswers((prev) => ({
            ...prev,
            [cards[currentIndex].id]: selected,
        }));
        setCurrentIndex((prev) => (prev < cards.length - 1 ? prev + 1 : prev));
    };

    const handleSubmit = () => {
        setSubmitted(true);
    };

    if (submitted) {
        const correctCount = cards.filter(
            (card) => answers[card.id] === card.correctAnswer,
        ).length;

        return (
            <div className="space-y-6">
                <h2 className="text-2xl font-bold">Your Results</h2>
                <p>
                    You scored {correctCount} out of {cards.length}
                </p>
                <ul className="space-y-4">
                    {cards.map((card, index) => {
                        const userAnswer = answers[card.id];
                        const isCorrect = userAnswer === card.correctAnswer;

                        return (
                            <li
                                key={card.id}
                                className={`border p-4 rounded ${
                                    isCorrect
                                        ? 'bg-green-50 border-green-300'
                                        : 'bg-red-50 border-red-300'
                                }`}
                            >
                                <p className="font-semibold">
                                    {index + 1}. {card.question}
                                </p>
                                <p>
                                    Your answer:{' '}
                                    <span
                                        className={
                                            isCorrect
                                                ? 'text-green-700'
                                                : 'text-red-700'
                                        }
                                    >
                                        {userAnswer}
                                    </span>
                                </p>
                                {!isCorrect && (
                                    <p>
                                        Correct answer:{' '}
                                        <span className="text-green-700">
                                            {card.correctAnswer}
                                        </span>
                                    </p>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    }

    const card = cards[currentIndex];

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">
                Question {currentIndex + 1} of {cards.length}
            </h2>
            <p className="text-lg">{card.question}</p>
            <div className="grid grid-cols-1 gap-3">
                {card.options.map((option, idx) => (
                    <button
                        key={idx}
                        className="p-3 border rounded hover:bg-gray-100"
                        onClick={() => handleOptionClick(option)}
                    >
                        {option}
                    </button>
                ))}
            </div>
            {currentIndex === cards.length - 1 && (
                <button
                    className="mt-6 px-4 py-2 bg-blue-600 text-white rounded"
                    onClick={handleSubmit}
                    disabled={!answers[card.id]}
                >
                    Submit
                </button>
            )}
        </div>
    );
}
