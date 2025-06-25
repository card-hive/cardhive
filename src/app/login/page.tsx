'use client';

import { useState } from 'react';
import { login } from './actions';

export default function LoginPage() {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleFormAction(formData: FormData) {
        setLoading(true);
        setError(null);
        try {
            await login(formData);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || 'Something went wrong.');
            } else {
                setError('Something went wrong.');
            }
            setLoading(false);
        }
    }

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <br />
            <div>
                <form
                    action={handleFormAction}
                    className="bg-[#b2acff] p-6 rounded-lg shadow-md"
                >
                    <p>Email: </p>
                    <input
                        name="email"
                        type="text"
                        className="rounded-lg shadow-md"
                        required
                    />
                    <p>Password: </p>
                    <input
                        name="password"
                        type="password"
                        className="rounded-lg shadow-md"
                        required
                    />
                    <br />
                    <button
                        type="submit"
                        className="bg-[#b3adff] p-3 rounded-lg shadow-md mt-4"
                    >
                        Login
                    </button>
                </form>

                <div className="mt-4 text-center">
                    {error && (
                        <p className="text-red-600 text-center mt-2">{error}</p>
                    )}
                    {loading && (
                        <p className="text-red-600 text-center mt-2">
                            Loading....
                        </p>
                    )}
                    <a href="/forgot" className="block underline">
                        Forgot password/email
                    </a>
                    <a href="/signup" className="block underline mt-2">
                        Sign up
                    </a>
                </div>
            </div>
            <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center"></footer>
        </div>
    );
}
