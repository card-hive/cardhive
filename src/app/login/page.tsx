'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Example POST request (replace with actual API call)
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (res.ok) {
            router.push('/modules');
        } else {
            console.log(res);
            alert('Wrong email or password');
        }
    };

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <br></br>
            <div>
                <form
                    onSubmit={handleLogin}
                    className="bg-[#b2acff] p-6 rounded-lg shadow-md"
                >
                    <p>Username/Email: </p>
                    <input
                        type="text"
                        className="rounded-lg shadow-md"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <p>Password: </p>
                    <input
                        type="password"
                        className="rounded-lg shadow-md"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
