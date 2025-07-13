'use client';

import { supabase } from '@/lib/supabaseClient';
import { useState } from 'react';

export default function EditForm({
    initialName,
    type,
    email,
    accountId,
}: {
    initialName: string;
    type: string;
    email: string;
    accountId: string;
}) {
    const [name, setName] = useState(initialName);
    const [showApply, setShowApply] = useState(false);
    const [applyReason, setApplyReason] = useState('');
    const [message, setMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        const { data } = await supabase.from('accounts').select('*');

        console.log(data);

        const { error } = await supabase
            .from('accounts')
            .update({ name: name })
            .eq('account_id', accountId);

        if (error) {
            console.error('Failed to update:', error);
            setMessage('Failed to update profile.');
        } else {
            setMessage('Profile updated successfully!');
        }
    };

    const handleApplySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        const { error } = await supabase
            .from('accounts')
            .update({ requested_account_change: applyReason })
            .eq('account_id', accountId);

        if (error) {
            console.error('Failed to submit request:', error);
            setMessage('Failed to submit request.');
        } else {
            setMessage('Request submitted to admin.');
            setApplyReason('');
            setShowApply(false);
        }
    };

    return (
        <div className="p-8 max-w-xl mx-auto bg-white rounded shadow">
            <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-600 mb-1">Name</label>
                    <input
                        type="text"
                        value={name || ''}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border rounded px-4 py-2"
                    />
                </div>

                <div>
                    <label className="block text-gray-600 mb-1">
                        Account Type
                    </label>
                    <div className="flex items-center justify-between">
                        <span className="text-lg font-medium capitalize">
                            {type}
                        </span>
                        <button
                            type="button"
                            onClick={() => setShowApply(!showApply)}
                            className="ml-4 text-blue-600 underline"
                        >
                            Apply for different account
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block text-gray-600 mb-1">Email</label>
                    <p className="text-lg font-medium">{email}</p>
                </div>

                <button
                    type="submit"
                    className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                >
                    Save Changes
                </button>
            </form>

            {showApply && (
                <div className="mt-8 border-t pt-6">
                    <h2 className="text-xl font-semibold mb-2">
                        Request Account Change
                    </h2>
                    <form onSubmit={handleApplySubmit}>
                        <textarea
                            placeholder="Explain why you need a different account type..."
                            value={applyReason}
                            onChange={(e) => setApplyReason(e.target.value)}
                            className="w-full border rounded px-4 py-2 mb-4"
                            rows={4}
                        ></textarea>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                        >
                            Submit Request
                        </button>
                    </form>
                </div>
            )}

            {message && (
                <p className="mt-4 text-center text-green-600">{message}</p>
            )}
        </div>
    );
}
