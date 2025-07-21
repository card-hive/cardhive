import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ request_id: string }> },
): Promise<Response> {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return redirect('/login');

    const requestId = await params;

    // Set request status to Resolved
    await supabase
        .from('requests')
        .update({ status: 'Resolved' })
        .eq('request_id', requestId);

    return redirect('/admin');
}
