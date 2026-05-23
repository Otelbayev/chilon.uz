// Creates the target database if it doesn't already exist.
// Connects to the default `postgres` DB to issue CREATE DATABASE.

const { Client } = require('pg');
require('dotenv').config();

const targetDb = process.env.PGDATABASE || 'chilon';

(async () => {
  const client = new Client({
    host:     process.env.PGHOST     || 'localhost',
    port:     Number(process.env.PGPORT) || 5432,
    user:     process.env.PGUSER     || 'postgres',
    password: process.env.PGPASSWORD || 'postgres',
    database: 'postgres',
  });

  try {
    await client.connect();
    const { rows } = await client.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [targetDb]
    );
    if (rows.length === 0) {
      await client.query(`CREATE DATABASE "${targetDb}"`);
      console.log(`✓ Database "${targetDb}" created`);
    } else {
      console.log(`= Database "${targetDb}" already exists`);
    }
  } catch (err) {
    console.error('Failed to create database:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
})();
