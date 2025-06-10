import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { username, password } = body;

    // just for the dummy
    // would replace with if the username in database
    if (username === 'admin' && password === 'secret') {
        return NextResponse.json(
            { status: 200 },
        );
    }

    return NextResponse.json(
        { status: 401 },
    );
}
