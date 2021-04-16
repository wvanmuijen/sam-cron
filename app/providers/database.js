const pg = require('pg');

const knex = require('knex')({ client: 'pg' });

const pool = new pg.Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

const acquireClient = () => pool.connect();

const executeQuery = (query) => acquireClient().then((client) => client.query({
  text: query.toSQL().toNative().sql,
  values: query.toSQL().toNative().bindings,
}).then((response) => {
  client.release(true);
  return response;
}).catch((err) => {
  client.release(true);
  throw err;
})).catch((err) => {
  throw err;
});

module.exports = {
  executeQuery,
  knex,
};
