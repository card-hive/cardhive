'use client';

import Link from 'next/link';
import { use, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function ManageCardsetPage({
    params,
}: {
    params: Promise<{ cardset_id: string }>;
}) {
    const { cardset_id } = use(params);
    const supabase = createClient();
    const [cardsetName, setCardsetName] = useState('');

    useEffect(() => {
        // find cardset by id and get its name
        async function fetchCardsetName() {
            const { data, error } = await supabase
                .from('flashcard_sets')
                .select('title')
                .eq('cardset_id', cardset_id)
                .single();

            if (error) {
                console.error('Error fetching cardset:', error);
                return;
            }

            setCardsetName(data?.title || 'Unknown Cardset');
        }
        fetchCardsetName();
    }, [cardset_id, supabase]);

    return (
        <main className="max-w-2xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6">Manage Card Set</h1>
            <p className="mb-4">
                You are managing the card set: <strong>{cardsetName}</strong>
            </p>
            <ul className="space-y-4">
                <li>
                    <Link
                        href={`/cardview/${cardset_id}/edit/cards`}
                        className="block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Add/Remove/Reorder Cards
                    </Link>
                </li>

                <li>
                    <Link
                        href={`/cardview/${cardset_id}/edit/details`}
                        className="block px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                    >
                        Modify Set Details
                    </Link>
                </li>
            </ul>
        </main>
    );
}
