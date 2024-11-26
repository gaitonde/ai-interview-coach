import { Pool, QueryResult } from 'pg'
import { sql } from "@vercel/postgres"

let pool: Pool | null = null

async function getPool() {
  if (!pool) {
    const { Pool } = await import('pg')
    pool = new Pool({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME,
    })
  }
  return pool
}

export const db = {
  query: async (text: string, params: any[]): Promise<QueryResult> => {
    try {
      const result = await sql.query(text, params);
      return result;
    } catch (error) {
      console.error('Error executing query:', error);
      throw error;
    }
  },
}

export function getTable(tableName: string) {
  const env = process.env.VERCEL_ENV;
  const isProd = env === 'production';

  if (isProd) {
    return tableName;
  } else {
    // ai_interview_coach_prod_profiles
    tableName = tableName.replace('prod_', '');
    return `${tableName}_preview`;
  }

}
