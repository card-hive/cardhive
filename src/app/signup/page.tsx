'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function Signup() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        //TODO: atmoise the signup

        const { data: signupData, error: signupError } =
            await supabase.auth.signUp({
                email,
                password,
            });

        if (signupError) {
            console.error('Signup error:', signupError.message);
            setError(signupError.message);
        }
        if (!signupData || !signupData.user) {
            return;
        }

        const { error: insertError } = await supabase.from('accounts').insert([
            {
                account_id: signupData.user.id,
                email,
            },
        ]);

        if (signupError) {
            console.error('Signup error:', signupError.message);
            setError(signupError.message);
        } else if (insertError) {
            console.error(insertError.message);
            setError(insertError.message);
        } else {
            setSuccess(true);
            setError(null);
            setTimeout(() => router.push('/'), 2000); // Redirect after 2s
        }
    };

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <br />
            <div>
                <form
                    onSubmit={handleSignup}
                    className="bg-[#b2acff] p-6 rounded-lg shadow-md"
                >
                    <p>Email: </p>
                    <input
                        type="email"
                        className="rounded-lg shadow-md"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <p>Password: </p>
                    <input
                        type="password"
                        className="rounded-lg shadow-md"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <br />
                    <button
                        type="submit"
                        className="bg-[#b3adff] p-3 rounded-lg shadow-md mt-4"
                    >
                        Sign Up
                    </button>
                </form>

                {error && (
                    <p className="text-red-600 mt-4 text-center">{error}</p>
                )}
                {success && (
                    <p className="text-green-600 mt-4 text-center">
                        Signup successful! Redirecting...
                    </p>
                )}

                <div className="mt-4 text-center">
                    <a href="/login" className="block underline">
                        Already have an account? Log in
                    </a>
                </div>
            </div>
            <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center"></footer>
        </div>
    );
}
