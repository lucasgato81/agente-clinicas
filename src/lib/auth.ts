import crypto from 'crypto';
import { query, isDatabaseConfigured } from './db';

// Chave secreta de assinatura de sessão (prioriza variável de ambiente)
const AUTH_SECRET = process.env.AUTH_SECRET || process.env.SESSION_SECRET || 'odontoshield_auth_secret_k982734b_2026';

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: string;
  tenantId: string;
  isSuperAdmin?: boolean;
  exp: number; // timestamp em segundos
}

// ----------------------------------------------------
// 1. HASHING SEGURO DE SENHAS (PBKDF2 com Salt Aleatório)
// ----------------------------------------------------
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  if (!storedHash) return false;
  
  // Compatibilidade com hashes legados no formato sha256 simples
  if (!storedHash.includes(':')) {
    const legacySalt = 'ODONTOSHIELD_SUPERADMIN_SECRET_SALT_2026';
    const legacyHash = crypto.createHash('sha256').update(password + legacySalt).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(legacyHash), Buffer.from(storedHash));
  }

  const [salt, originalHash] = storedHash.split(':');
  if (!salt || !originalHash) return false;

  const hashToCompare = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  const bufOriginal = Buffer.from(originalHash, 'hex');
  const bufCompare = Buffer.from(hashToCompare, 'hex');

  if (bufOriginal.length !== bufCompare.length) return false;
  return crypto.timingSafeEqual(bufOriginal, bufCompare);
}

// ----------------------------------------------------
// 2. TOKENS DE SESSÃO CRIPTOGRAFADOS E ASSINADOS (HMAC-SHA256)
// ----------------------------------------------------
export function createSessionToken(payload: Omit<SessionPayload, 'exp'>, expiresInDays = 7): string {
  const exp = Math.floor(Date.now() / 1000) + expiresInDays * 24 * 60 * 60;
  const fullPayload: SessionPayload = { ...payload, exp };
  
  const encodedPayload = Buffer.from(JSON.stringify(fullPayload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', AUTH_SECRET)
    .update(encodedPayload)
    .digest('base64url');

  return `${encodedPayload}.${signature}`;
}

export function verifySessionToken(token: string | null | undefined): SessionPayload | null {
  if (!token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [encodedPayload, signature] = parts;
  const expectedSignature = crypto
    .createHmac('sha256', AUTH_SECRET)
    .update(encodedPayload)
    .digest('base64url');

  const bufSig = Buffer.from(signature);
  const bufExpected = Buffer.from(expectedSignature);

  if (bufSig.length !== bufExpected.length || !crypto.timingSafeEqual(bufSig, bufExpected)) {
    return null;
  }

  try {
    const payloadJson = Buffer.from(encodedPayload, 'base64url').toString('utf-8');
    const payload = JSON.parse(payloadJson) as SessionPayload;

    // Verificar expiração
    const nowSec = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < nowSec) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

// Extrai sessão de requisição HTTP (Authorization Header Bearer ou Cookie)
export function getSessionFromRequest(request: Request): SessionPayload | null {
  // 1. Tenta Bearer token no Header Authorization
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    const session = verifySessionToken(token);
    if (session) return session;
  }

  // 2. Tenta nos cookies da requisição
  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map((c) => {
      const [k, ...v] = c.trim().split('=');
      return [k, decodeURIComponent(v.join('='))];
    })
  );

  const sessionCookie = cookies['odontoshield_session'] || cookies['superadmin_token'];
  if (sessionCookie) {
    return verifySessionToken(sessionCookie);
  }

  return null;
}

// ----------------------------------------------------
// 3. RATE LIMITING (Proteção Anti-Brute-Force / DoS)
// ----------------------------------------------------
interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

// Limpa registros antigos da memória a cada 5 minutos
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitMap.entries()) {
    if (now > record.resetAt) {
      rateLimitMap.delete(key);
    }
  }
}, 5 * 60 * 1000);

export function checkRateLimit(
  key: string,
  maxAttempts: number = 5,
  windowSeconds: number = 60
): { allowed: boolean; remaining: number; retryAfterSeconds?: number } {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
    return { allowed: true, remaining: maxAttempts - 1 };
  }

  if (record.count >= maxAttempts) {
    const retryAfterSeconds = Math.ceil((record.resetAt - now) / 1000);
    return { allowed: false, remaining: 0, retryAfterSeconds };
  }

  record.count += 1;
  return { allowed: true, remaining: maxAttempts - record.count };
}

// ----------------------------------------------------
// 4. TRILHA DE AUDITORIA LGPD (Art. 6º, X e Art. 5º, II da Lei 13.709/2018)
// ----------------------------------------------------
export interface AuditLogEntry {
  tenantId?: string;
  userId?: string;
  userName?: string;
  userRole?: string;
  action: 'LOGIN' | 'ACCESS_PRONTUARIO' | 'VIEW_TRACE' | 'CREATE_CYCLE' | 'USE_PACKAGE' | 'EXPORT_DATA' | 'ADMIN_ACTION';
  resourceType: 'PATIENT' | 'PACKAGE' | 'CYCLE' | 'INCIDENT' | 'USER' | 'CLINIC';
  resourceId?: string;
  details: string;
  ipAddress?: string;
  userAgent?: string;
}

export async function logLgpdAudit(entry: AuditLogEntry) {
  const logId = `audit_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
  
  // Tentar salvar no banco de dados se disponível
  if (isDatabaseConfigured()) {
    try {
      await query(
        `INSERT INTO lgpd_audit_logs (
          id, tenant_id, user_id, user_name, user_role, action,
          resource_type, resource_id, details, ip_address, user_agent
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [
          logId,
          entry.tenantId || null,
          entry.userId || null,
          entry.userName || 'Sistema / Anônimo',
          entry.userRole || 'UNKNOWN',
          entry.action,
          entry.resourceType,
          entry.resourceId || null,
          entry.details,
          entry.ipAddress || null,
          entry.userAgent || null,
        ]
      );
    } catch (err) {
      console.warn('[LGPD AUDIT] Falha ao gravar log no banco:', err);
    }
  }
}
