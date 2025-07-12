// Re-export utilities for cleaner imports
export { createClient as createServerClient } from './server';
export { createClient as createBrowserClient } from './client';
export { updateSession } from './middleware';
