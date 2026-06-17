// Disable prefetch as it is not supported for "Transaction" pool mode (used heavily in serverless/nextjs)
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const client = typeof window === 'undefined'
  ? postgres(process.env.DATABASE_URL!, { prepare: false })
  : null;

export const db = client ? drizzle(client, { schema }) : ({} as any);

