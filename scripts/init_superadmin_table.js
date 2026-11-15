const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://odontoshield_user:r9sgeIST2xigATJ23tqUy5n6Vhb3DaPo@dpg-dbo7mdbrjlhs73al2qt0-a.oregon-postgres.render.com/odontoshield',
  ssl: { rejectUnauthorized: false },
});

async function run() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS superadmin_credentials (
      id VARCHAR(100) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      last_login_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('✅ Tabela superadmin_credentials criada com sucesso no PostgreSQL!');
  const res = await pool.query('SELECT COUNT(*) FROM superadmin_credentials');
  console.log('Total de administradores master cadastrados:', res.rows[0].count);
  pool.end();
}

run().catch(console.error);
