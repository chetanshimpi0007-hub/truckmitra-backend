const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_PZGd8EphIbf9@ep-spring-poetry-aira0grk-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require'
});

async function run() {
  await client.connect();
  
  console.log("=== USERS ===");
  const usersRes = await client.query('SELECT id, mobile, email, role, password, is_deleted FROM users ORDER BY id');
  console.table(usersRes.rows);
  
  await client.end();
}

run().catch(console.error);
