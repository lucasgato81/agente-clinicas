const { Pool } = require('pg');

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('❌ ERRO: A variável de ambiente DATABASE_URL não está definida.');
  console.error('Execute: $env:DATABASE_URL="sua_conexao_aqui"; node scripts/init_superadmin_table.js');
  process.exit(1);
}

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: databaseUrl.includes('localhost') ? false : { rejectUnauthorized: false },
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
