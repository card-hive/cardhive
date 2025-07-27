'use client';

import { use, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import FlashcardRenderer from '@/components/FlashcardRenderer';
import { v4 as uuidv4 } from 'uuid';

type DBCard = { card_id: string; front: string; back: string };

type Flashcard = {
    id: string; // UUID: real for existing, temp for new
    front: string;
    back: string;
    isNew?: boolean; // true if it's not in DB yet
};

export default function AddCardsPage({
    params,
}: {
    params: Promise<{ cardset_id: string }>;
}) {
    const { cardset_id } = use(params);
    const supabase = createClient();

    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const [front, setFront] = useState('');
    const [back, setBack] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // ✅ Load existing cards on mount
    useEffect(() => {
        async function loadExistingCards() {
            const { data: cardset, error: setError } = await supabase
                .from('flashcard_sets')
                .select('cards')
                .eq('cardset_id', cardset_id)
                .single();

            if (setError || !cardset) {
                console.error('Error loading cardset:', setError);
                return;
            }

            if (!cardset.cards || cardset.cards.length === 0) {
                setFlashcards([]);
                return;
            }

            const { data: existingCards, error: cardsError } = await supabase
                .from('cards')
                .select('card_id, front, back')
                .in('card_id', cardset.cards);

            if (cardsError) {
                console.error(cardsError);
                return;
            }

            // Preserve original order
            const ordered = cardset.cards
                .map((id: string) =>
                    existingCards.find((c) => c.card_id === id),
                )
                .filter((c: DBCard) => !!c);

            setFlashcards(
                ordered.map((c: DBCard) => ({
                    id: c.card_id,
                    front: c.front,
                    back: c.back,
                    isNew: false,
                })),
            );
        }

        loadExistingCards();
    }, [cardset_id, supabase]);

    // ✅ Add a new card (only locally)
    const handleAddFlashcard = () => {
        if (front.trim() === '' || back.trim() === '') return;

        setFlashcards([
            ...flashcards,
            {
                id: uuidv4(),
                front,
                back,
                isNew: true,
            },
        ]);

        setFront('');
        setBack('');
    };

    // ✅ Reorder locally
    const handleDragEnd = (fromIndex: number, toIndex: number) => {
        const updated = [...flashcards];
        const [moved] = updated.splice(fromIndex, 1);
        updated.splice(toIndex, 0, moved);
        setFlashcards(updated);
    };

    // ✅ Delete (only locally for new, also remove from DB if old)
    const handleDelete = async (index: number) => {
        const cardToDelete = flashcards[index];

        if (!cardToDelete.isNew) {
            await supabase
                .from('cards')
                .delete()
                .eq('card_id', cardToDelete.id);
        }

        const updated = [...flashcards];
        updated.splice(index, 1);
        setFlashcards(updated);
    };

    // ✅ Save cards + order
    const handleSave = async () => {
        setSaving(true);

        // Separate new & existing
        const newCards = flashcards.filter((c) => c.isNew);

        // Insert new cards if any
        let insertedIds: string[] = [];
        if (newCards.length > 0) {
            const { data: inserted, error } = await supabase
                .from('cards')
                .insert(newCards.map((c) => ({ front: c.front, back: c.back })))
                .select('card_id');

            if (error) {
                console.error(error);
                setError('Failed to insert new cards');
                setSaving(false);
                return;
            }
            insertedIds = inserted.map((i) => i.card_id);
        }

        // Map all cards in final order, swapping temp UUIDs for DB UUIDs
        let newIdIndex = 0;
        const finalOrderedIds = flashcards.map((card) => {
            if (card.isNew) {
                return insertedIds[newIdIndex++];
            }
            return card.id;
        });

        // ✅ Update the flashcard_sets table with the final ordered array
        const { error: updateError } = await supabase
            .from('flashcard_sets')
            .update({ cards: finalOrderedIds })
            .eq('cardset_id', cardset_id);

        if (updateError) {
            console.error(updateError);
            setError('Failed to update cardset order');
        } else {
            setError(null);
            alert('Cards saved & order updated!');
            // Clear "isNew" flags
            setFlashcards((prev) => prev.map((c) => ({ ...c, isNew: false })));
        }

        setSaving(false);
    };

    // ✅ Convert flashcards to the renderer format
    const rendererCards = flashcards.map((card, index) => ({
        id: index, // ✅ numeric ID for FlashcardRenderer
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
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Add & Manage Cards</h1>

            {/* Add card form */}
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleAddFlashcard();
                }}
                className="mb-6"
            >
                <input
                    type="text"
                    placeholder="Front"
                    className="border rounded px-4 py-2 mr-2"
                    value={front}
                    onChange={(e) => setFront(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Back"
                    className="border rounded px-4 py-2 mr-2"
                    value={back}
                    onChange={(e) => setBack(e.target.value)}
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Add Card
                </button>
            </form>

            {/* Preview */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">
                    Flashcard Preview
                </h2>
                {flashcards.length > 0 ? (
                    <FlashcardRenderer
                        cards={rendererCards}
                        ownerId={''}
                        cardsetId={cardset_id}
                    />
                ) : (
                    <p className="text-gray-500">No cards yet.</p>
                )}
            </div>

            {/* Reorder list */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Reorder Cards</h2>
                <ul>
                    {flashcards.map((card, index) => (
                        <li
                            key={card.id}
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

            {/* Save Button */}
            <button
                onClick={handleSave}
                disabled={saving}
                className="bg-green-600 text-white px-6 py-3 rounded disabled:bg-green-300"
            >
                {saving ? 'Saving...' : 'Save All'}
            </button>

            {error && <p className="mt-4 text-red-600">{error}</p>}
        </div>
    );
}
