import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function AccountPage() {
    const supabase = await createClient();

    // Get the auth user first to know their UUID
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        console.log('Redirecting to /login:', userError);
        redirect('/login');
    }

    // Now load the user's account row from your own table
    const { data: account, error: accountError } = await supabase
        .from('accounts')
        .select('*')
        .eq('account_id', user.id)
        .single();

    if (accountError || !account) {
        console.log('⚠️ No account row found:', accountError);
        return (
            <div className="p-8 max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold mb-4">My Account</h1>
                <p className="text-red-600">No account data found.</p>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-xl mx-auto bg-white rounded shadow">
            <h1 className="text-3xl font-bold mb-6">My Account</h1>
            <div className="space-y-4">
                <div>
                    <p className="text-gray-600 text-sm">Name</p>
                    <p className="text-lg font-medium">{account.name || '-'}</p>
                </div>
                <div>
                    <p className="text-gray-600 text-sm">Account Type</p>
                    <p className="text-lg font-medium capitalize">
                        {account.account_type || '-'}
                    </p>
                </div>
                <div>
                    <p className="text-gray-600 text-sm">Email</p>
                    <p className="text-lg font-medium">{account.email}</p>
                </div>
            </div>
            <div className="mt-8">
                <a
                    href="/my_account/edit"
                    className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                >
                    Edit Profile
                </a>
            </div>
            <form method="post" action="/auth/signout" className="mt-6">
                <button
                    type="submit"
                    className="w-full bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition"
                >
                    Sign Out
                </button>
            </form>

            {/* Menu section */}
            <div className="mt-10 bg-gray-100 rounded-lg shadow-inner p-4">
                <h2 className="text-lg font-semibold mb-3">Menu</h2>
                <div className="flex flex-col space-y-2">
                    <a
                        href="/my_sets"
                        className="px-4 py-2 rounded hover:bg-gray-200 transition"
                    >
                        My Sets
                    </a>
                    <a
                        href="/saved_sets"
                        className="px-4 py-2 rounded hover:bg-gray-200 transition"
                    >
                        Saved Sets
                    </a>
                </div>
            </div>
        </div>
    );
}
