'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const supabase = await createClient();

    // Authenticate
    const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (loginError || !data.user) {
        throw new Error('Invalid email or password.');
    }

    // Check accounts table
    const { data: accountData, error: accountError } = await supabase
        .from('accounts')
        .select('*')
        .eq('account_id', data.user.id)
        .single();

    if (accountError || !accountData) {
        throw new Error('Login succeeded, but account not found.');
    }

    // All good
    redirect('/modules');
}
