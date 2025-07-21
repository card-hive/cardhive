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
    const [requestType, setRequestType] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const [message, setMessage] = useState<string | null>(null);
    const [accountType, setAccountType] = useState<string | null>(null);

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

        const uploadedUrls: string[] = [];

        for (const file of files) {
            const filePath = `${file.name}`;

            const { data, error } = await supabase.storage
                .from('request-images/' + accountId)
                .upload(filePath, file);

            console.log(data, 'data', filePath, file);

            if (error) {
                console.error('Failed to upload image:', error);
                setMessage('Failed to upload image.');
                return;
            }

            uploadedUrls.push(accountId + '/' + filePath);
        }

        // Insert request into the database
        const { error: insertError } = await supabase.from('requests').insert({
            account_id: accountId,
            request_type: requestType,
            description: applyReason,
            image_links: uploadedUrls,
            account_type: accountType,
        });

        if (insertError) {
            console.error('Failed to submit request:', insertError);
            setMessage('Failed to submit request.');
        } else {
            setMessage('Request submitted to admin.');
            setApplyReason('');
            setRequestType('');
            setFiles([]);
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
                            Apply for account type
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
                    <h2 className="text-xl font-semibold mb-4">
                        Request Account Change
                    </h2>
                    <form onSubmit={handleApplySubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-600 mb-1">
                                Request Type
                            </label>
                            <select
                                value={requestType}
                                onChange={(e) => setRequestType(e.target.value)}
                                className="w-full border rounded px-4 py-2"
                            >
                                <option value="">Select type...</option>
                                <option value="upgrade">Account Type</option>
                                <option value="bug">Report a Bug</option>
                                <option value="feature">Request Feature</option>
                            </select>
                            {requestType === 'upgrade' && (
                                <div>
                                    <label className="block text-sm font-medium">
                                        Request New Account Type
                                    </label>
                                    <select
                                        value={accountType || ''}
                                        onChange={(e) =>
                                            setAccountType(e.target.value)
                                        }
                                        className="w-full border px-4 py-2 rounded"
                                    >
                                        <option value="">
                                            Select account type
                                        </option>
                                        <option value="Admin">Admin</option>
                                        <option value="Professor">
                                            Professor
                                        </option>
                                        <option value="TA">TA</option>
                                    </select>
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="block text-gray-600 mb-1">
                                Description
                            </label>
                            <textarea
                                placeholder="Explain your request, if applying for account type, state the modules and upload the paperwork..."
                                value={applyReason}
                                onChange={(e) => setApplyReason(e.target.value)}
                                className="w-full border rounded px-4 py-2"
                                rows={4}
                            ></textarea>
                        </div>
                        <div>
                            <label className="block text-gray-600 mb-1">
                                Upload Images
                            </label>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={(e) =>
                                    setFiles(Array.from(e.target.files || []))
                                }
                                className="w-full border rounded px-4 py-2"
                            />
                        </div>

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
