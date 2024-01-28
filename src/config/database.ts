import { Pool } from 'pg';
// export const prisma = new PrismaClient();

const client = new Pool({
  host: process.env.DB_HOST,
  port: 2345,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

export const runQuery = async (query: string) => {
  await client.connect();
  const res = await client.query(query);
  let result = res;
  //   await client.end();
  return result.rows;
};
