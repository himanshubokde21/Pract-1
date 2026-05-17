import 'dotenv/config'
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from "./schema.ts"


const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const db: NodePgDatabase<typeof schema> = drizzle(pool, { schema });

if (!db) {
    console.log("db not connected!")
}

console.log('DB is Connection!');

export default db