import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { PostgrestError } from '@supabase/supabase-js';

export default async function AdminRequestsPage() {
    type RequestRow = {
        request_id: string;
        request_type: string;
        account_id: string;
        accounts: { name: string | null } | null;
    };

    const supabase = await createClient();

    // Get current user to check if admin
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
        redirect('/login');
    }

    // Check account type
    const { data: account, error: accountError } = await supabase
        .from('accounts')
        .select('account_type')
        .eq('account_id', user.id)
        .single();

    if (accountError || !account || account.account_type !== 'Admin') {
        console.log(accountError, account, account?.account_type);
        return (
            <div className="p-8 max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold mb-4">Admin Requests</h1>
                <p className="text-red-600">
                    Not authorized to view this page.
                </p>
            </div>
        );
    }

    // Load all requests + join on accounts to get name
    const { data: requests, error: requestsError } = (await supabase
        .from('requests')
        .select('request_id, request_type, account_id, accounts(name)')
        .order('created_at', { ascending: false })) as unknown as {
        data: RequestRow[];
        error: PostgrestError | null;
    };

    if (requestsError) {
        return (
            <div className="p-8 max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold mb-4">Admin Requests</h1>
                <p className="text-red-600">Failed to load requests.</p>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">All User Requests</h1>
            <div className="space-y-4">
                {requests.map((req) => (
                    <div
                        key={req.request_id}
                        className="border p-4 rounded shadow flex flex-col sm:flex-row justify-between items-start sm:items-center"
                    >
                        <div>
                            <p>
                                <strong>User:</strong>{' '}
                                {req.accounts?.name || 'Unknown'}
                            </p>
                            <p>
                                <strong>Account ID:</strong> {req.account_id}
                            </p>
                            <p>
                                <strong>Type:</strong> {req.request_type}
                            </p>
                        </div>
                        <Link
                            href={`/admin/${req.request_id}`}
                            className="mt-4 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            View Details
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
