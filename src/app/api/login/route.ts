import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { username, password } = body;

    // 🔐 Dummy auth logic — replace with real validation
    if (username === 'admin' && password === 'secret') {
        return NextResponse.json(
            { message: 'Login successful' },
            { status: 200 },
        );
    }

    return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 },
    );
}
