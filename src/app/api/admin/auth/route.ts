import { NextResponse } from 'next/server';
import { query, isDatabaseConfigured } from '@/lib/db';
import {
  hashPassword,
  verifyPassword,
  createSessionToken,
  verifySessionToken,
  checkRateLimit,
} from '@/lib/auth';

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

// POST: Cadastro inicial, Login ou Verificação de Sessão
export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
    const body = await request.json();
    const { action, name, email, password, token } = body;

    // ----------------------------------------------------
    // 1. AÇÃO: VERIFICAR TOKEN DE SESSÃO ATIVO (Validação Criptográfica Real)
    // ----------------------------------------------------
    if (action === 'VERIFY_TOKEN') {
      if (!token) {
        return NextResponse.json({ valid: false }, { status: 401 });
      }

      const session = verifySessionToken(token);
      if (!session || !session.isSuperAdmin) {
        return NextResponse.json({ valid: false, message: 'Token inválido ou expirado' }, { status: 401 });
      }

      return NextResponse.json({
        valid: true,
        user: { name: session.name, email: session.email },
      });
    }

    // ----------------------------------------------------
    // 2. AÇÃO: CADASTRO DO PRIMEIRO MASTER (Dono do SaaS)
    // ----------------------------------------------------
    if (action === 'REGISTER_MASTER') {
      if (!name || !email || !password) {
        return NextResponse.json(
          { success: false, message: 'Todos os campos são obrigatórios.' },
          { status: 400 }
        );
      }

      if (password.length < 8) {
        return NextResponse.json(
          { success: false, message: 'A senha de SuperAdmin deve conter no mínimo 8 caracteres.' },
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

          const sessionToken = createSessionToken({
            userId: newId,
            email: cleanEmail,
            name: name.trim(),
            role: 'SUPERADMIN',
            tenantId: 'GLOBAL',
            isSuperAdmin: true,
          });

          const response = NextResponse.json({
            success: true,
            token: sessionToken,
            user: { name: name.trim(), email: cleanEmail },
          });

          response.cookies.set('superadmin_token', sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60,
          });

          return response;
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

      const sessionToken = createSessionToken({
        userId: newId,
        email: cleanEmail,
        name: name.trim(),
        role: 'SUPERADMIN',
        tenantId: 'GLOBAL',
        isSuperAdmin: true,
      });

      const response = NextResponse.json({
        success: true,
        token: sessionToken,
        user: { name: inMemoryMasterUser.name, email: inMemoryMasterUser.email },
      });

      response.cookies.set('superadmin_token', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60,
      });

      return response;
    }

    // ----------------------------------------------------
    // 3. AÇÃO: LOGIN DO SUPERADMIN
    // ----------------------------------------------------
    if (action === 'LOGIN_MASTER') {
      const rateLimitCheck = checkRateLimit(`superadmin_login_${ip}`, 5, 60);
      if (!rateLimitCheck.allowed) {
        return NextResponse.json(
          {
            success: false,
            message: `Muitas tentativas de login de administrador. Aguarde ${rateLimitCheck.retryAfterSeconds} segundos.`,
          },
          { status: 429 }
        );
      }

      if (!email || !password) {
        return NextResponse.json(
          { success: false, message: 'Informe e-mail e senha.' },
          { status: 400 }
        );
      }

      const cleanEmail = email.trim().toLowerCase();

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
          const isValid = verifyPassword(password, master.password_hash);
          if (!isValid) {
            return NextResponse.json(
              { success: false, message: 'E-mail ou senha incorretos.' },
              { status: 401 }
            );
          }

          // Atualizar último login
          await query('UPDATE superadmin_credentials SET last_login_at = CURRENT_TIMESTAMP WHERE id = $1', [
            master.id,
          ]);

          const sessionToken = createSessionToken({
            userId: master.id,
            email: cleanEmail,
            name: master.name,
            role: 'SUPERADMIN',
            tenantId: 'GLOBAL',
            isSuperAdmin: true,
          });

          const response = NextResponse.json({
            success: true,
            token: sessionToken,
            user: { name: master.name, email: master.email },
          });

          response.cookies.set('superadmin_token', sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60,
          });

          return response;
        } catch (dbErr) {
          console.error('[SUPERADMIN LOGIN DB ERROR]', dbErr);
        }
      }

      // Fallback em memória
      if (
        inMemoryMasterUser &&
        inMemoryMasterUser.email === cleanEmail &&
        verifyPassword(password, inMemoryMasterUser.passwordHash)
      ) {
        const sessionToken = createSessionToken({
          userId: inMemoryMasterUser.id,
          email: cleanEmail,
          name: inMemoryMasterUser.name,
          role: 'SUPERADMIN',
          tenantId: 'GLOBAL',
          isSuperAdmin: true,
        });

        const response = NextResponse.json({
          success: true,
          token: sessionToken,
          user: { name: inMemoryMasterUser.name, email: inMemoryMasterUser.email },
        });

        response.cookies.set('superadmin_token', sessionToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 7 * 24 * 60 * 60,
        });

        return response;
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
