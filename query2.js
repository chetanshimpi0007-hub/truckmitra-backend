const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_PZGd8EphIbf9@ep-spring-poetry-aira0grk-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require',
});
client.connect().then(async () => {
  const wallets = await client.query('SELECT id, user_id, user_role, wallet_number, current_balance, escrow_balance, lifetime_earnings, lifetime_spent, daily_transaction_count FROM wallets');
  console.log('--- WALLETS ---');
  console.table(wallets.rows);
  
  await client.end();
}).catch(err => {
  console.error('Connection error', err.stack);
});
