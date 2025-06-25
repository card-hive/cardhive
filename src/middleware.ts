import { type NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';

export async function middleware(request: NextRequest) {
    return await updateSession(request);
}

export const config = {
    matcher: [
        // Match all paths EXCEPT:
        // - _next/static
        // - _next/image
        // - favicon and image files
        // - login, signup, forgot, about pages
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|login|signup|forgot|about).*)',
    ],
};
