import { defineConfig } from 'drizzle-kit';
import { enviroment } from './src/enviroment';
 
export default defineConfig({
  out: './drizzle',
  schema: './src/db/tables/index.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: enviroment.DATABASE_URL,
  },
});