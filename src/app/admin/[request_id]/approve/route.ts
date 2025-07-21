import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ request_id: string }> },
): Promise<Response> {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.redirect('/login');

    const requestId = await params;

    // 1. Get the account ID from the request
    const { data: reqData } = await supabase
        .from('requests')
        .select('account_id, account_type')
        .eq('request_id', requestId)
        .single();

    if (!reqData)
        return NextResponse.json(
            { error: 'Request not found' },
            { status: 404 },
        );

    // 2. Update the user's account_type
    await supabase
        .from('accounts')
        .update({ account_type: reqData.account_type })
        .eq('account_id', reqData.account_id);

    // 3. Update request status
    await supabase
        .from('requests')
        .update({ status: 'Approved' })
        .eq('request_id', requestId);

    return NextResponse.redirect('/admin');
}
