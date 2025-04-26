import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  driver: 'expo',        // use the Expo SQLite driver
  dialect: 'sqlite',     // SQLite dialect
  schema: './db/schema.ts',  // path to schema definitions
  out: './drizzle/migrations',      // output folder for migrations
  verbose: true,        // enable verbose logging
  strict: true,        // enable strict mode
})