'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useParams } from 'next/navigation';

export default function EditCardSetDetailsPage() {
    const supabase = createClient();
    const params = useParams();
    const cardsetId = params?.cardset_id as string;

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchCardSet = async () => {
            const { data, error } = await supabase
                .from('flashcard_sets')
                .select('title, description, public')
                .eq('cardset_id', cardsetId)
                .single();

            if (error) {
                console.error('Error fetching cardset:', error);
                setMessage('Failed to load card set details.');
            } else if (data) {
                setTitle(data.title);
                setDescription(data.description || '');
                setIsPublic(data.public);
            }
            setLoading(false);
        };
        fetchCardSet();
    }, [cardsetId, supabase]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        const { error } = await supabase
            .from('flashcard_sets')
            .update({
                title,
                description,
                public: isPublic,
            })
            .eq('cardset_id', cardsetId);

        if (error) {
            console.error('Update failed:', error);
            setMessage('Failed to update card set.');
        } else {
            setMessage('Card set updated successfully.');
        }

        setSaving(false);
    };

    if (loading) {
        return <div className="p-6 text-center">Loading...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Edit Card Set</h1>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium">Title</label>
                    <input
                        type="text"
                        className="w-full border rounded px-4 py-2"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">
                        Description
                    </label>
                    <textarea
                        className="w-full border rounded px-4 py-2"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                    />
                </div>

                <div className="flex items-center space-x-3">
                    <input
                        type="checkbox"
                        checked={isPublic}
                        onChange={(e) => setIsPublic(e.target.checked)}
                        id="publicToggle"
                    />
                    <label htmlFor="publicToggle" className="text-sm">
                        Make set public
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={saving}
                    className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                >
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </form>

            {message && (
                <p className="mt-4 text-center text-gray-700">{message}</p>
            )}
        </div>
    );
}
