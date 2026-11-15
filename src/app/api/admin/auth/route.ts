import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { query, isDatabaseConfigured } from '@/lib/db';

const SALT = 'ODONTOSHIELD_SUPERADMIN_SECRET_SALT_2026';

function hashPassword(password: string): string {
  return crypto
    .createHash('sha256')
    .update(password + SALT)
    .digest('hex');
}

function generateSessionToken(email: string): string {
  const payload = `${email}:${Date.now()}:${SALT}`;
  return crypto.createHash('sha256').update(payload).digest('hex');
}

// Fallback em memória caso o banco de dados esteja indisponível
let inMemoryMasterUser: {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
} | null = null;

// GET: Verifica se já existe um SuperAdmin cadastrado
export async function GET() {
  try {
    if (isDatabaseConfigured()) {
      try {
        const res = await query('SELECT COUNT(*) as count FROM superadmin_credentials');
        const count = Number(res.rows[0]?.count || 0);
        return NextResponse.json({
          hasMaster: count > 0,
        });
      } catch (dbErr) {
        console.warn('[SUPERADMIN AUTH] Erro ao consultar banco:', dbErr);
      }
    }

    return NextResponse.json({
      hasMaster: inMemoryMasterUser !== null,
    });
  } catch (error) {
    console.error('[SUPERADMIN AUTH GET]', error);
    return NextResponse.json({ hasMaster: false }, { status: 500 });
  }
}

// POST: Cadastro inicial ou Login
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, name, email, password, token } = body;

    // 1. AÇÃO: VERIFICAR TOKEN DE SESSÃO ATIVO
    if (action === 'VERIFY_TOKEN') {
      if (!token) {
        return NextResponse.json({ valid: false }, { status: 401 });
      }
      return NextResponse.json({ valid: true });
    }

    // 2. AÇÃO: CADASTRO DO PRIMEIRO MASTER (Dono do SaaS)
    if (action === 'REGISTER_MASTER') {
      if (!name || !email || !password) {
        return NextResponse.json(
          { success: false, message: 'Todos os campos são obrigatórios.' },
          { status: 400 }
        );
      }

      if (password.length < 6) {
        return NextResponse.json(
          { success: false, message: 'A senha deve conter no mínimo 6 caracteres.' },
          { status: 400 }
        );
      }

      const cleanEmail = email.trim().toLowerCase();
      const pHash = hashPassword(password);
      const newId = `master_${Date.now()}`;

      if (isDatabaseConfigured()) {
        try {
          // Verificar se já existe algum cadastrado
          const checkRes = await query('SELECT COUNT(*) as count FROM superadmin_credentials');
          const count = Number(checkRes.rows[0]?.count || 0);
          if (count > 0) {
            return NextResponse.json(
              {
                success: false,
                message: 'Já existe um SuperAdmin Master cadastrado. Faça login para acessar.',
              },
              { status: 403 }
            );
          }

          await query(
            `INSERT INTO superadmin_credentials (id, name, email, password_hash, last_login_at)
             VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)`,
            [newId, name.trim(), cleanEmail, pHash]
          );

          const sessionToken = generateSessionToken(cleanEmail);
          return NextResponse.json({
            success: true,
            token: sessionToken,
            user: { name: name.trim(), email: cleanEmail },
          });
        } catch (dbErr) {
          console.error('[SUPERADMIN REGISTER DB ERROR]', dbErr);
        }
      }

      // Fallback em memória
      if (inMemoryMasterUser) {
        return NextResponse.json(
          { success: false, message: 'Já existe um SuperAdmin cadastrado.' },
          { status: 403 }
        );
      }

      inMemoryMasterUser = {
        id: newId,
        name: name.trim(),
        email: cleanEmail,
        passwordHash: pHash,
      };

      const sessionToken = generateSessionToken(cleanEmail);
      return NextResponse.json({
        success: true,
        token: sessionToken,
        user: { name: inMemoryMasterUser.name, email: inMemoryMasterUser.email },
      });
    }

    // 3. AÇÃO: LOGIN DO SUPERADMIN
    if (action === 'LOGIN_MASTER') {
      if (!email || !password) {
        return NextResponse.json(
          { success: false, message: 'Informe e-mail e senha.' },
          { status: 400 }
        );
      }

      const cleanEmail = email.trim().toLowerCase();
      const pHash = hashPassword(password);

      if (isDatabaseConfigured()) {
        try {
          const res = await query(
            'SELECT * FROM superadmin_credentials WHERE LOWER(email) = $1 LIMIT 1',
            [cleanEmail]
          );

          if (res.rows.length === 0) {
            return NextResponse.json(
              { success: false, message: 'E-mail ou senha incorretos.' },
              { status: 401 }
            );
          }

          const master = res.rows[0];
          if (master.password_hash !== pHash) {
            return NextResponse.json(
              { success: false, message: 'E-mail ou senha incorretos.' },
              { status: 401 }
            );
          }

          // Atualizar último login
          await query('UPDATE superadmin_credentials SET last_login_at = CURRENT_TIMESTAMP WHERE id = $1', [
            master.id,
          ]);

          const sessionToken = generateSessionToken(cleanEmail);
          return NextResponse.json({
            success: true,
            token: sessionToken,
            user: { name: master.name, email: master.email },
          });
        } catch (dbErr) {
          console.error('[SUPERADMIN LOGIN DB ERROR]', dbErr);
        }
      }

      // Fallback em memória
      if (
        inMemoryMasterUser &&
        inMemoryMasterUser.email === cleanEmail &&
        inMemoryMasterUser.passwordHash === pHash
      ) {
        const sessionToken = generateSessionToken(cleanEmail);
        return NextResponse.json({
          success: true,
          token: sessionToken,
          user: { name: inMemoryMasterUser.name, email: inMemoryMasterUser.email },
        });
      }

      return NextResponse.json(
        { success: false, message: 'E-mail ou senha incorretos.' },
        { status: 401 }
      );
    }

    return NextResponse.json({ error: 'Ação inválida' }, { status: 400 });
  } catch (error) {
    console.error('[SUPERADMIN AUTH POST]', error);
    return NextResponse.json({ success: false, error: 'Erro interno de autenticação' }, { status: 500 });
  }
}
