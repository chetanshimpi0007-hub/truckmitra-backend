const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgres://neondb_owner:npg_PZGd8EphIbf9@ep-spring-poetry-aira0grk-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require'
});
client.connect();
client.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'shippers';", (err, res) => {
  if (err) throw err;
  for (let row of res.rows) {
    console.log(row.column_name);
  }
  client.end();
});
