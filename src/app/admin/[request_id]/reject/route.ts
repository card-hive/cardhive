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
    // Just mark request as Rejected
    await supabase
        .from('requests')
        .update({ status: 'Rejected' })
        .eq('request_id', requestId);

    return NextResponse.redirect('/admin');
}
