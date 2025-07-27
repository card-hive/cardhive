'use client';

import { useEffect, useState } from 'react';
import { FlashcardArray } from 'react-quizlet-flashcard';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { redirect } from 'next/navigation';

interface Flashcard {
    id: number;
    frontHTML: React.ReactNode;
    backHTML: React.ReactNode;
    front: string;
    back: string;
}

interface SetItem {
    cardset_id: string;
    title: string;
}

interface FlashcardRendererProps {
    cards: Flashcard[];
    cardsetId: string;
    ownerId: string;
}

export default function FlashcardRenderer({
    cards,
    cardsetId,
    ownerId,
}: FlashcardRendererProps) {
    const supabase = createClient();
    const [showMenu, setShowMenu] = useState(false);
    const [availableSets, setAvailableSets] = useState<SetItem[]>([]);
    const [selectedCardIds, setSelectedCardIds] = useState<number[]>([]);
    const [selectedSetIds, setSelectedSetIds] = useState<string[]>([]);
    const [currentUser, setCurrentUser] = useState<string | null>(null);
    const [isSaved, setIsSaved] = useState<boolean>(false);

    useEffect(() => {
        async function fetchData() {
            const {
                data: { user },
                error: userError,
            } = await supabase.auth.getUser();

            if (userError || !user) redirect('/login');
            setCurrentUser(user.id);

            // Get available sets owned by the user
            const { data: ownedSets } = await supabase
                .from('flashcard_sets')
                .select('cardset_id, title')
                .eq('owner', user.id);

            setAvailableSets(ownedSets || []);

            // ✅ Check if this set is already saved by the user
            const { data: account } = await supabase
                .from('accounts')
                .select('saved_sets')
                .eq('account_id', user.id)
                .single();

            if (account?.saved_sets?.includes(cardsetId)) {
                setIsSaved(true);
            }
        }
        fetchData();
    }, [cardsetId]);

    const toggleCard = (id: number) => {
        setSelectedCardIds((prev) =>
            prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
        );
    };

    const toggleSet = (id: string) => {
        setSelectedSetIds((prev) =>
            prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
        );
    };

    const handleAdd = async () => {
        for (const cardId of selectedCardIds) {
            for (const setId of selectedSetIds) {
                const { error } = await supabase.rpc('append_card_to_set', {
                    set_id_input: setId,
                    card_id_input: cardId,
                });

                if (error) console.error('Failed to append card:', error);
            }
        }

        alert('Cards added to selected sets!');
        setShowMenu(false);
        setSelectedCardIds([]);
        setSelectedSetIds([]);
    };

    const handleToggleSave = async () => {
        if (!currentUser) return;

        const { data: account, error: fetchError } = await supabase
            .from('accounts')
            .select('saved_sets')
            .eq('account_id', currentUser)
            .single();

        if (fetchError || !account) {
            console.error('Error fetching account', fetchError);
            return;
        }

        const savedSets = account.saved_sets || [];

        let updatedSets;
        if (isSaved) {
            // Remove from saved
            updatedSets = savedSets.filter((id: string) => id !== cardsetId);
        } else {
            // Add to saved
            updatedSets = [...savedSets, cardsetId];
        }

        const { error: updateError } = await supabase
            .from('accounts')
            .update({ saved_sets: updatedSets })
            .eq('account_id', currentUser);

        if (updateError) {
            console.error('Error updating saved sets', updateError);
            return;
        }

        setIsSaved(!isSaved);
    };

    return (
        <div className="flex flex-col items-center justify-start space-y-6">
            <FlashcardArray cards={cards} />

            {/* Add Cards Button (only if owner) */}
            {ownerId !== '' && (
                <button
                    className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                    onClick={() => setShowMenu(true)}
                >
                    Add Cards to Sets
                </button>
            )}

            <button
                className={`mt-4 px-6 py-2 rounded text-white transition ${
                    isSaved
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-blue-600 hover:bg-blue-700'
                }`}
                onClick={handleToggleSave}
            >
                {isSaved ? 'Unsave Card Set' : 'Save Card Set'}
            </button>

            {currentUser === ownerId && (
                <Link
                    href={`/cardview/${cardsetId}/edit`}
                    className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                >
                    Edit Cardset
                </Link>
            )}

            {showMenu && (
                <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full space-y-4">
                        <h2 className="text-xl font-semibold">Select Cards</h2>
                        <div className="max-h-48 overflow-y-auto space-y-2">
                            {cards.map((card) => (
                                <label key={card.id} className="block">
                                    <input
                                        type="checkbox"
                                        checked={selectedCardIds.includes(
                                            card.id,
                                        )}
                                        onChange={() => toggleCard(card.id)}
                                        className="mr-2"
                                    />
                                    <span className="font-medium">
                                        Front: {card.front}, Back: {card.back}
                                    </span>
                                </label>
                            ))}
                        </div>

                        <h2 className="text-xl font-semibold mt-4">
                            Select Sets
                        </h2>
                        <div className="max-h-48 overflow-y-auto space-y-2">
                            {availableSets.length === 0 && (
                                <div>
                                    No sets of my own. Add one{' '}
                                    <Link
                                        href="/my_sets"
                                        className="text-blue-600 hover:underline hover:text-blue-800 transition-colors"
                                    >
                                        here
                                    </Link>
                                </div>
                            )}
                            {availableSets.map((set) => (
                                <label key={set.cardset_id} className="block">
                                    <input
                                        type="checkbox"
                                        checked={selectedSetIds.includes(
                                            set.cardset_id,
                                        )}
                                        onChange={() =>
                                            toggleSet(set.cardset_id)
                                        }
                                        className="mr-2"
                                    />
                                    {set.title}
                                </label>
                            ))}
                        </div>

                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                onClick={() => setShowMenu(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                onClick={handleAdd}
                                disabled={
                                    selectedCardIds.length === 0 ||
                                    selectedSetIds.length === 0
                                }
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
