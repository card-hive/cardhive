'use client';

import { use, useState } from 'react';
import { submitCardSet } from './action';
import FlashcardRenderer from '@/components/FlashcardRenderer';

type Flashcard = {
    front: string;
    back: string;
};

export default function CreateCardSetPage({
    params,
}: {
    params: Promise<{ module_code: string }>;
}) {
    const { module_code } = use(params);
    const [title, setTitle] = useState('');
    const [front, setFront] = useState('');
    const [back, setBack] = useState('');
    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleAddFlashcard = () => {
        if (front.trim() === '' || back.trim() === '') return;
        setFlashcards([...flashcards, { front, back }]);
        setFront('');
        setBack('');
    };

    const handleDragEnd = (fromIndex: number, toIndex: number) => {
        const updated = [...flashcards];
        const [moved] = updated.splice(fromIndex, 1);
        updated.splice(toIndex, 0, moved);
        setFlashcards(updated);
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        try {
            await submitCardSet(module_code, title, flashcards);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || 'Submission failed');
            } else {
                setError('Submission failed due to unknown error.');
            }
        }
        setLoading(false);
    };

    const rendererCards = flashcards.map((card, index) => ({
        id: index,
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
        front: card.front as unknown as string,
        back: card.back as unknown as string,
    }));

    const handleDelete = (index: number) => {
        const updated = [...flashcards];
        updated.splice(index, 1);
        setFlashcards(updated);
    };

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">
                Create Card Set for {module_code}
            </h1>

            <input
                type="text"
                placeholder="Set Title"
                className="border rounded px-4 py-2 w-full mb-4"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleAddFlashcard();
                }}
                className="mb-6"
            >
                <input
                    type="text"
                    placeholder="Front (term/question)"
                    className="border rounded px-4 py-2 mr-2"
                    value={front}
                    onChange={(e) => setFront(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Back (definition/answer)"
                    className="border rounded px-4 py-2 mr-2"
                    value={back}
                    onChange={(e) => setBack(e.target.value)}
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Add
                </button>
            </form>

            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">
                    Flashcard Preview
                </h2>
                {flashcards.length > 0 ? (
                    <FlashcardRenderer
                        cards={rendererCards}
                        ownerId={''}
                        cardsetId={''}
                    />
                ) : (
                    <p className="text-gray-500">No flashcards yet.</p>
                )}
            </div>

            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Reorder Cards</h2>
                <ul>
                    {flashcards.map((card, index) => (
                        <li
                            key={index}
                            className="border p-3 mb-2 flex items-center justify-between bg-white rounded shadow"
                        >
                            <div>
                                <div>
                                    <strong>Front:</strong> {card.front}
                                </div>
                                <div>
                                    <strong>Back:</strong> {card.back}
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                {index > 0 && (
                                    <button
                                        onClick={() =>
                                            handleDragEnd(index, index - 1)
                                        }
                                        className="text-blue-600"
                                    >
                                        ↑
                                    </button>
                                )}
                                {index < flashcards.length - 1 && (
                                    <button
                                        onClick={() =>
                                            handleDragEnd(index, index + 1)
                                        }
                                        className="text-blue-600"
                                    >
                                        ↓
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDelete(index)}
                                    className="text-red-600"
                                >
                                    ✕
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <button
                onClick={handleSubmit}
                disabled={loading || !title || flashcards.length === 0}
                className="bg-green-600 text-white px-6 py-3 rounded disabled:bg-green-300"
            >
                {loading ? 'Saving...' : 'Save Card Set'}
            </button>

            {error && <p className="mt-4 text-red-600">{error}</p>}
        </div>
    );
}
