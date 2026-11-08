import { NextResponse } from 'next/server';
import { MOCK_TEAM_MEMBERS } from '@/lib/mockData';
import { query, isDatabaseConfigured } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { pin, email, password } = body;

    // Login por PIN de 4 dígitos (Modo Rápido de Bancada / Celular)
    if (pin) {
      // 1. Tentar buscar no banco PostgreSQL se configurado
      if (isDatabaseConfigured()) {
        try {
          const res = await query(
            'SELECT * FROM clinic_users WHERE pin = $1 AND active = true LIMIT 1',
            [pin]
          );
          if (res.rows.length > 0) {
            const user = res.rows[0];
            return NextResponse.json({
              success: true,
              user: {
                id: user.id,
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
          }
        } catch (dbErr) {
          console.warn('[AUTH] Erro ao consultar banco, tentando dados locais:', dbErr);
        }
      }

      // 2. Fallback para equipe cadastrada localmente
      const found = MOCK_TEAM_MEMBERS.find((m) => m.pin === pin);
      if (found) {
        return NextResponse.json({
          success: true,
          user: {
            id: found.id,
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
      }

      return NextResponse.json(
        { success: false, message: 'PIN incorreto. Tente novamente ou use seu e-mail.' },
        { status: 401 }
      );
    }

    // Login por E-mail e Senha (Modo Gestor / PC)
    if (email) {
      const cleanEmail = email.trim().toLowerCase();

      // 1. Tentar buscar no banco PostgreSQL
      if (isDatabaseConfigured()) {
        try {
          const res = await query(
            'SELECT * FROM clinic_users WHERE LOWER(email) = $1 AND active = true LIMIT 1',
            [cleanEmail]
          );
          if (res.rows.length > 0) {
            const user = res.rows[0];
            return NextResponse.json({
              success: true,
              user: {
                id: user.id,
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
          }
        } catch (dbErr) {
          console.warn('[AUTH] Erro ao consultar banco, tentando dados locais:', dbErr);
        }
      }

      // 2. Fallback para equipe local
      const found = MOCK_TEAM_MEMBERS.find(
        (m) => m.email.toLowerCase() === cleanEmail
      );
      if (found) {
        return NextResponse.json({
          success: true,
          user: {
            id: found.id,
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
      }

      return NextResponse.json(
        { success: false, message: 'Usuário não encontrado com este e-mail.' },
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
