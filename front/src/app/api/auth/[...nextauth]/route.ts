/**
 * NextAuth.js v5 API route handler.
 *
 * Handles all authentication-related API routes.
 */
import { handlers } from '@/src/lib/auth';

export const { GET, POST } = handlers;
