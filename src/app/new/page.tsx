'use client';

import { useEffect, useState } from 'react';
import ModuleGrid from '@/components/ModuleGrid';
import { supabase } from '@/lib/supabaseClient';

export default function NewCardSetModulePage() {
    const [modules, setModules] = useState<{ code: string; image: string }[]>(
        [],
    );
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchModules = async () => {
            const { data, error } = await supabase
                .from('modules')
                .select('code, image');

            if (error) {
                console.error('Error fetching modules:', error);
            } else {
                setModules(data || []);
            }
            setLoading(false);
        };

        fetchModules();
    }, []);

    // Filter modules based on search query
    const filteredModules = modules.filter((mod) =>
        mod.code.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    return (
        <main className="min-h-screen bg-white flex flex-col items-center">
            <div className="w-full max-w-4xl p-6">
                <div className="bg-blue-100 border border-blue-300  px-6 py-4 rounded-xl mb-6 shadow-sm">
                    <h1 className="text-2xl font-semibold">
                        Assign this card set to at least one module.
                    </h1>
                </div>
                <input
                    type="text"
                    placeholder="Search for Modules..."
                    className="border rounded-md px-4 py-2 w-full mb-6"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                {loading ? (
                    <p>Loading modules...</p>
                ) : filteredModules.length > 0 ? (
                    <ModuleGrid modules={filteredModules} add_cardset={true} />
                ) : (
                    <p className="text-gray-500">
                        No modules match your search.
                    </p>
                )}

                <footer className="text-right text-sm text-gray-600 mt-8">
                    Alroy and Damien
                </footer>
            </div>
        </main>
    );
}
