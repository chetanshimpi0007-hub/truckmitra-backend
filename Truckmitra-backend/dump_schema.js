const { Client } = require('pg');
const fs = require('fs');
const client = new Client({
  connectionString: 'postgres://neondb_owner:npg_PZGd8EphIbf9@ep-spring-poetry-aira0grk-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require'
});
client.connect();
client.query("SELECT table_name, column_name FROM information_schema.columns WHERE table_schema = 'public';", (err, res) => {
  if (err) throw err;
  const schema = {};
  for (let row of res.rows) {
    if (!schema[row.table_name]) schema[row.table_name] = [];
    schema[row.table_name].push(row.column_name);
  }
  fs.writeFileSync('db_schema.json', JSON.stringify(schema, null, 2));
  console.log('Schema written to db_schema.json');
  client.end();
});
