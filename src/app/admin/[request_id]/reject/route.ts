import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(
    request: Request,
    context: { params: { request_id: string } },
): Promise<Response> {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.redirect('/login');

    // Just mark request as Rejected
    await supabase
        .from('requests')
        .update({ status: 'Rejected' })
        .eq('request_id', context.params.request_id);

    return NextResponse.redirect('/admin');
}
