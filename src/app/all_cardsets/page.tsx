'use client';

import { useEffect, useState } from 'react';
import CardSetGrid from '@/components/CardSetGrid';
import { supabase } from '@/lib/supabaseClient';

type FlashcardSetRow = {
    cardset_id: string;
    title: string;
    image: string;
};

export default function AllCardSetsPage() {
    const [cardsets, setCardsets] = useState<FlashcardSetRow[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCardSets = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('flashcard_sets')
                .select('cardset_id, title, image');

            if (error) {
                console.error('Error fetching cardsets:', error);
                setCardsets([]);
            } else {
                setCardsets(data || []);
            }
            setLoading(false);
        };

        fetchCardSets();
    }, []);

    // Filter sets locally based on the search query
    const filteredSets = cardsets.filter((set) =>
        set.title?.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    // Format data for CardSetGrid props
    const formattedSets = filteredSets.map((set) => ({
        id: set.cardset_id,
        title: set.title,
        image: set.image,
    }));

    return (
        <main className="min-h-screen bg-white flex flex-col items-center">
            <div className="w-full max-w-5xl p-6">
                <h2 className="text-3xl font-bold mb-4">All Card Sets</h2>

                <div className="flex space-x-2 mb-6">
                    <input
                        type="text"
                        placeholder="Search for card sets..."
                        className="flex-1 border rounded-md px-4 py-2"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {loading ? (
                    <p>Loading card sets...</p>
                ) : formattedSets.length > 0 ? (
                    <CardSetGrid cardsets={formattedSets} />
                ) : (
                    <p className="text-gray-500 mt-6">No card sets found.</p>
                )}

                <footer className="text-right text-sm text-gray-600 mt-8">
                    Alroy and Damien
                </footer>
            </div>
        </main>
    );
}
