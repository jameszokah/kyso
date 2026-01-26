import { createI18nMiddleware } from 'next-international/middleware';
import { NextRequest, NextResponse } from 'next/server';

const I18nMiddleware = createI18nMiddleware({
  locales: ['en', 'es'],
  defaultLocale: 'en',
});

export function proxy(request: NextRequest) {
    if (request.nextUrl.pathname.startsWith('/embed')) {
        return NextResponse.next();
    }

    return I18nMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)'],
};
