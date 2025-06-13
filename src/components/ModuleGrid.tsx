'use client';

import ModuleCard from './ModuleCard';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface Module {
    code: string;
    image: string;
}

export default function ModuleGrid() {
    const [modules, setModules] = useState<Module[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchModules = async () => {
            const { data, error } = await supabase
                .from('modules')
                .select('code, image');

            if (error) {
                console.error('Error fetching modules:', error);
            } else {
                setModules(data);
            }

            setLoading(false);
        };

        fetchModules();
    }, []);

    if (loading) return <p>Loading modules...</p>;

    console.log(modules);

    return (
        <section className="grid grid-cols-3 gap-6 justify-items-center">
            {modules.map((mod) => (
                <ModuleCard key={mod.code} {...mod} />
            ))}
        </section>
    );
}
