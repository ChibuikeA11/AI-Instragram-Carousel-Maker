import { createRouteMatcher } from '@clerk/nextjs/server';

const publicRoutes = [
  '/signup(.*)', // Exclude signup and its children
];

export default createRouteMatcher(publicRoutes);

export const config = {
  matcher: ["/protected/:path*", "/premium/:path*"],
};