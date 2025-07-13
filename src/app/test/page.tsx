'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function DebugSessionPage() {
    useEffect(() => {
        supabase.auth.getSession().then(({ data, error }) => {
            console.log('getSession:', data, error);
        });

        supabase.auth.getUser().then(({ data, error }) => {
            console.log('getUser:', data, error);
        });
    }, []);

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Debug Page</h2>
            <p>Check your console for session and user info.</p>
        </div>
    );
}
