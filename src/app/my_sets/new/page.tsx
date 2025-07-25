'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function NewCardSetPage() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    // const [modules, setModules] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            alert('You must be logged in');
            return;
        }

        let imageUrl: string | null = null;

        if (imageFile) {
            const filePath = `${user.id}/${crypto.randomUUID()}-${imageFile.name}`;
            const { error: uploadError } = await supabase.storage
                .from('cardset-images/')
                .upload(filePath, imageFile);

            if (uploadError) {
                alert('Image upload failed');
                setSubmitting(false);
                return;
            }

            const { data: urlData } = await supabase.storage
                .from('cardset-images')
                .getPublicUrl(filePath);

            imageUrl = urlData?.publicUrl || null;
        }

        const { error: insertError } = await supabase
            .from('flashcard_sets')
            .insert({
                title: title,
                description: description,
                public: isPublic,
                // modules: modules.split(',').map((m) => m.trim()),
                image: imageUrl,
                owner: user.id,
            });

        if (insertError) {
            alert('Failed to create set');
        } else {
            router.push('/my_sets');
        }

        setSubmitting(false);
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Create New Card Set</h1>
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

                {/* <div>
                    <label className="block text-sm font-medium">
                        Modules (comma-separated)
                    </label>
                    <input
                        type="text"
                        className="w-full border rounded px-4 py-2"
                        value={modules}
                        onChange={(e) => setModules(e.target.value)}
                    />
                </div> */}

                <div>
                    <label className="block text-sm font-medium">
                        Cover Image (optional)
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            if (e.target.files?.[0]) {
                                setImageFile(e.target.files[0]);
                            }
                        }}
                    />
                </div>

                <button
                    type="submit"
                    disabled={submitting}
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                    {submitting ? 'Creating...' : 'Create Set'}
                </button>
            </form>
        </div>
    );
}
