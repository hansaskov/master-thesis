import { defineConfig } from 'drizzle-kit';

if(!process.env.DATABASE_URL) {
  throw Error("No Database url found in enviroment")
}
 
export default defineConfig({
  out: '../db',
  schema: './src/db/tables/index.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});