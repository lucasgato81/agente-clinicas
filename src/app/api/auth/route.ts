import { NextResponse } from 'next/server';
import { MOCK_TEAM_MEMBERS } from '@/lib/mockData';
import { query, isDatabaseConfigured } from '@/lib/db';
import {
  checkRateLimit,
  createSessionToken,
  verifyPassword,
  hashPassword,
  logLgpdAudit,
} from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
    const body = await request.json();
    const { pin, email, password } = body;

    // ----------------------------------------------------
    // 1. LOGIN POR PIN DE 4 DÍGITOS (BANCADA CME / CELULAR)
    // ----------------------------------------------------
    if (pin) {
      // Proteção estrita contra ataque de força bruta no PIN (max 5 tentativas por minuto por IP)
      const rateLimitCheck = checkRateLimit(`pin_${ip}`, 5, 60);
      if (!rateLimitCheck.allowed) {
        return NextResponse.json(
          {
            success: false,
            message: `Muitas tentativas incorretas. Por segurança, aguarde ${rateLimitCheck.retryAfterSeconds} segundos.`,
          },
          { status: 429 }
        );
      }

      // Tentar buscar no banco PostgreSQL
      if (isDatabaseConfigured()) {
        try {
          const res = await query(
            'SELECT * FROM clinic_users WHERE pin = $1 AND active = true LIMIT 1',
            [pin]
          );
          if (res.rows.length > 0) {
            const user = res.rows[0];
            const token = createSessionToken({
              userId: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
              tenantId: user.tenant_id,
            });

            await logLgpdAudit({
              tenantId: user.tenant_id,
              userId: user.id,
              userName: user.name,
              userRole: user.role,
              action: 'LOGIN',
              resourceType: 'USER',
              details: 'Login realizado com sucesso via PIN de bancada.',
              ipAddress: ip,
            });

            const response = NextResponse.json({
              success: true,
              token,
              user: {
                id: user.id,
                tenantId: user.tenant_id,
                name: user.name,
                email: user.email,
                role: user.role,
                roleName: user.role_name,
                councilNumber: user.council_number,
                councilState: user.council_state,
                cpf: user.cpf,
                phone: user.phone,
              },
            });

            response.cookies.set('odontoshield_session', token, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              path: '/',
              maxAge: 7 * 24 * 60 * 60,
            });

            return response;
          }
        } catch (dbErr) {
          console.warn('[AUTH] Erro ao consultar banco, tentando dados locais:', dbErr);
        }
      }

      // Fallback para equipe local (ambiente de desenvolvimento ou demonstração)
      const found = MOCK_TEAM_MEMBERS.find((m) => m.pin === pin);
      if (found) {
        const token = createSessionToken({
          userId: found.id,
          email: found.email,
          name: found.name,
          role: found.role,
          tenantId: 'clinica_01',
        });

        const response = NextResponse.json({
          success: true,
          token,
          user: {
            id: found.id,
            tenantId: 'clinica_01',
            name: found.name,
            email: found.email,
            role: found.role,
            roleName: found.roleName,
            councilNumber: found.councilNumber,
            councilState: found.councilState,
            cpf: found.cpf,
            phone: found.phone,
          },
        });

        response.cookies.set('odontoshield_session', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 7 * 24 * 60 * 60,
        });

        return response;
      }

      return NextResponse.json(
        { success: false, message: 'PIN incorreto. Tente novamente ou use seu e-mail.' },
        { status: 401 }
      );
    }

    // ----------------------------------------------------
    // 2. LOGIN POR E-MAIL E SENHA (GESTÃO / COMPUTADOR)
    // ----------------------------------------------------
    if (email) {
      const cleanEmail = email.trim().toLowerCase();

      // Rate limiting por e-mail/IP (max 5 tentativas por minuto)
      const rateLimitCheck = checkRateLimit(`email_${cleanEmail}_${ip}`, 5, 60);
      if (!rateLimitCheck.allowed) {
        return NextResponse.json(
          {
            success: false,
            message: `Muitas tentativas de login. Aguarde ${rateLimitCheck.retryAfterSeconds} segundos antes de tentar novamente.`,
          },
          { status: 429 }
        );
      }

      if (!password) {
        return NextResponse.json(
          { success: false, message: 'Informe a senha para autenticar.' },
          { status: 400 }
        );
      }

      // 1. Tentar buscar no banco PostgreSQL
      if (isDatabaseConfigured()) {
        try {
          const res = await query(
            'SELECT * FROM clinic_users WHERE LOWER(email) = $1 AND active = true LIMIT 1',
            [cleanEmail]
          );
          if (res.rows.length > 0) {
            const user = res.rows[0];

            // Verificação de senha
            if (user.password_hash) {
              const isValid = verifyPassword(password, user.password_hash);
              if (!isValid) {
                return NextResponse.json(
                  { success: false, message: 'E-mail ou senha incorretos.' },
                  { status: 401 }
                );
              }
            } else {
              // Primeiro acesso de usuário legado: salvar a senha digitada como hash
              const newHash = hashPassword(password);
              await query('UPDATE clinic_users SET password_hash = $1 WHERE id = $2', [
                newHash,
                user.id,
              ]);
            }

            const token = createSessionToken({
              userId: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
              tenantId: user.tenant_id,
            });

            await logLgpdAudit({
              tenantId: user.tenant_id,
              userId: user.id,
              userName: user.name,
              userRole: user.role,
              action: 'LOGIN',
              resourceType: 'USER',
              details: 'Login por e-mail e senha efetuado com sucesso.',
              ipAddress: ip,
            });

            const response = NextResponse.json({
              success: true,
              token,
              user: {
                id: user.id,
                tenantId: user.tenant_id,
                name: user.name,
                email: user.email,
                role: user.role,
                roleName: user.role_name,
                councilNumber: user.council_number,
                councilState: user.council_state,
                cpf: user.cpf,
                phone: user.phone,
              },
            });

            response.cookies.set('odontoshield_session', token, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              path: '/',
              maxAge: 7 * 24 * 60 * 60,
            });

            return response;
          }
        } catch (dbErr) {
          console.warn('[AUTH] Erro ao consultar banco, tentando dados locais:', dbErr);
        }
      }

      // 2. Fallback para equipe local
      const found = MOCK_TEAM_MEMBERS.find((m) => m.email.toLowerCase() === cleanEmail);
      if (found) {
        // No modo mock de desenvolvimento, aceita senhas com no mínimo 4 dígitos
        if (password.length < 4) {
          return NextResponse.json(
            { success: false, message: 'A senha deve conter no mínimo 4 caracteres.' },
            { status: 400 }
          );
        }

        const token = createSessionToken({
          userId: found.id,
          email: found.email,
          name: found.name,
          role: found.role,
          tenantId: 'clinica_01',
        });

        const response = NextResponse.json({
          success: true,
          token,
          user: {
            id: found.id,
            tenantId: 'clinica_01',
            name: found.name,
            email: found.email,
            role: found.role,
            roleName: found.roleName,
            councilNumber: found.councilNumber,
            councilState: found.councilState,
            cpf: found.cpf,
            phone: found.phone,
          },
        });

        response.cookies.set('odontoshield_session', token, {
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

    return NextResponse.json(
      { success: false, message: 'Informe o PIN ou e-mail de acesso.' },
      { status: 400 }
    );
  } catch (error) {
    console.error('[AUTH API]', error);
    return NextResponse.json(
      { success: false, message: 'Erro interno ao autenticar.' },
      { status: 500 }
    );
  }
}
