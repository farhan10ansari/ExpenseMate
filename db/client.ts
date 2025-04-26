import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from './schema';
import { openDatabaseSync } from 'expo-sqlite';

// Open a SQLite database connection using Expo's SQLite module.
export const expoClient = openDatabaseSync('db.db');

const db = drizzle(expoClient, {
    schema,
    logger: true,
});

export default db;