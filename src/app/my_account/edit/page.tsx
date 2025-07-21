import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import EditForm from '@/components/EditForm';

export default async function EditAccountPage() {
    const supabase = await createClient();

    // Get logged-in user
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
        redirect('/login');
    }

    // Fetch their account row
    const { data: account, error: accountError } = await supabase
        .from('accounts')
        .select('*')
        .eq('account_id', user.id)
        .single();

    if (accountError || !account) {
        return (
            <div className="p-8 max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
                <p className="text-red-600">No account data found.</p>
            </div>
        );
    }

    return (
        <EditForm
            initialName={account.name}
            type={account.account_type}
            email={account.email}
            accountId={user.id}
        />
    );
}
