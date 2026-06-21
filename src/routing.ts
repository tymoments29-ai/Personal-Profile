import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'id'],
  defaultLocale: 'en',
  localeCookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax'
  }
});
