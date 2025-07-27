'use client';

import { useEffect, useState } from 'react';
import CardSetGrid from '@/components/CardSetGrid';
import { supabase } from '@/lib/supabaseClient';

type FlashcardSetRow = {
    cardset_id: string;
    title: string;
    description: string;
    image: string;
    verified: string[];
};

type Verifier = {
    name: string;
    account_type: 'Student' | 'TA' | 'Professor';
};

export default function AllCardSetsPage() {
    const [cardsets, setCardsets] = useState<FlashcardSetRow[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [verifierMap, setVerifierMap] = useState<Record<string, Verifier>>(
        {},
    );

    useEffect(() => {
        async function fetchCardSets() {
            setLoading(true);

            const { data: setsData, error: setsError } = await supabase
                .from('flashcard_sets')
                .select('cardset_id, title, description, image, verified');

            if (setsError) {
                console.error('Error fetching cardsets:', setsError);
                setCardsets([]);
                setLoading(false);
                return;
            }

            setCardsets(setsData || []);

            // 2️⃣ Collect all unique verifier UUIDs from all sets
            const allVerifierUUIDs = [
                ...new Set(setsData.flatMap((s) => s.verified || [])),
            ];

            if (allVerifierUUIDs.length > 0) {
                // 3️⃣ Fetch the verifier accounts in one query
                const { data: accounts, error: accountsError } = await supabase
                    .from('accounts')
                    .select('account_id, name, account_type')
                    .in('account_id', allVerifierUUIDs);

                if (accountsError) {
                    console.error(
                        'Error fetching verifier accounts:',
                        accountsError,
                    );
                    setVerifierMap({});
                } else {
                    const map: Record<string, Verifier> = {};
                    accounts.forEach((acc) => {
                        map[acc.account_id] = {
                            name: acc.name,
                            account_type: acc.account_type,
                        };
                    });
                    setVerifierMap(map);
                }
            }

            setLoading(false);
        }

        fetchCardSets();
    }, []);

    const filteredSets = cardsets.filter((set) =>
        set.title?.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const formattedSets = filteredSets.map((set) => ({
        id: set.cardset_id,
        title: set.title,
        description: set.description || '',
        image: set.image,
        verifiers: (set.verified || [])
            .map((uuid) => verifierMap[uuid])
            .filter(Boolean), // removes undefined in case some UUIDs didn't match
    }));

    return (
        <main className="min-h-screen bg-white flex flex-col items-center">
            <div className="w-full max-w-5xl p-6">
                <h2 className="text-3xl font-bold mb-4">All Card Sets</h2>

                {/* 🔍 Search bar */}
                <div className="flex space-x-2 mb-4">
                    <input
                        type="text"
                        placeholder="Search for card sets..."
                        className="flex-1 border rounded-md px-4 py-2"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {loading ? (
                    <p className="text-gray-500">Loading card sets...</p>
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
