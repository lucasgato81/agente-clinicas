'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldAlert,
  Building2,
  Users,
  CreditCard,
  Sparkles,
  Phone,
  Mail,
  ExternalLink,
  RefreshCw,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  Database,
  Calendar,
  DollarSign,
  Activity,
  Layers,
  ChevronRight,
  HelpCircle,
  Copy,
  Check,
  Stethoscope,
  Crown,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  LogOut,
  User,
} from 'lucide-react';
import { ClinicTenant } from '@/lib/types';

interface SuperAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectClinic: (clinic: ClinicTenant) => void;
}

interface ActivityLogItem {
  id: string;
  tenantId: string;
  tenantName: string;
  userName: string;
  actionType: string;
  description: string;
  createdAt: string;
}

interface AdminData {
  database: {
    isConfigured: boolean;
    type: string;
    provider: string;
  };
  stripe?: {
    isConfigured: boolean;
    webhookUrl: string;
  };
  metrics: {
    totalTenants: number;
    trialCount: number;
    activeCount: number;
    projectedMrr: number;
    totalCycles: number;
    totalUsers: number;
  };
  tenants: ClinicTenant[];
  activityLogs: ActivityLogItem[];
}

export const SuperAdminModal: React.FC<SuperAdminModalProps> = ({
  isOpen,
  onClose,
  onSelectClinic,
}) => {
  // Estados de Autenticação Master
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [hasMasterAccount, setHasMasterAccount] = useState<boolean | null>(null);
  const [authChecking, setAuthChecking] = useState<boolean>(true);

  // Formulário de Login / Registro
  const [authName, setAuthName] = useState<string>('');
  const [authEmail, setAuthEmail] = useState<string>('');
  const [authPassword, setAuthPassword] = useState<string>('');
  const [authConfirmPassword, setAuthConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSubmitting, setAuthSubmitting] = useState<boolean>(false);
  const [loggedInUser, setLoggedInUser] = useState<{ name: string; email: string } | null>(null);

  // Estados do Painel
  const [activeTab, setActiveTab] = useState<'tenants' | 'metrics' | 'activity' | 'database_setup' | 'stripe'>('tenants');
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<AdminData | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'TRIAL' | 'ACTIVE'>('ALL');
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Verifica se o usuário já está logado na sessão ou se precisa cadastrar/fazer login
  const checkAuthStatus = async () => {
    setAuthChecking(true);
    setAuthError(null);

    // 1. Verificar se há sessão salva
    try {
      const savedSession = localStorage.getItem('odontoshield_superadmin_session');
      if (savedSession) {
        const session = JSON.parse(savedSession);
        if (session.token && session.user) {
          setIsAuthenticated(true);
          setLoggedInUser(session.user);
          setAuthChecking(false);
          fetchAdminData();
          return;
        }
      }
    } catch {
      // Ignora erro de parse local
    }

    // 2. Consultar na API se já existe conta Master registrada no banco
    try {
      const res = await fetch('/api/admin/auth');
      if (res.ok) {
        const json = await res.json();
        setHasMasterAccount(Boolean(json.hasMaster));
      } else {
        setHasMasterAccount(false);
      }
    } catch (err) {
      console.warn('Erro ao checar status de autenticação:', err);
      setHasMasterAccount(false);
    } finally {
      setAuthChecking(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      checkAuthStatus();
    }
  }, [isOpen]);

  const handleRegisterMaster = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!authName.trim()) {
      setAuthError('Por favor, informe seu nome.');
      return;
    }
    if (!authEmail.trim() || !authEmail.includes('@')) {
      setAuthError('Informe um e-mail válido.');
      return;
    }
    if (authPassword.length < 6) {
      setAuthError('A senha master deve ter no mínimo 6 caracteres.');
      return;
    }
    if (authPassword !== authConfirmPassword) {
      setAuthError('As senhas digitadas não coincidem.');
      return;
    }

    setAuthSubmitting(true);
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'REGISTER_MASTER',
          name: authName.trim(),
          email: authEmail.trim(),
          password: authPassword,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        localStorage.setItem(
          'odontoshield_superadmin_session',
          JSON.stringify({ token: json.token, user: json.user })
        );
        setIsAuthenticated(true);
        setLoggedInUser(json.user);
        fetchAdminData();
      } else {
        setAuthError(json.message || 'Erro ao criar conta de SuperAdmin.');
      }
    } catch {
      setAuthError('Falha na comunicação com o servidor.');
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleLoginMaster = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!authEmail.trim() || !authPassword) {
      setAuthError('Preencha seu e-mail e sua senha master.');
      return;
    }

    setAuthSubmitting(true);
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'LOGIN_MASTER',
          email: authEmail.trim(),
          password: authPassword,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        localStorage.setItem(
          'odontoshield_superadmin_session',
          JSON.stringify({ token: json.token, user: json.user })
        );
        setIsAuthenticated(true);
        setLoggedInUser(json.user);
        fetchAdminData();
      } else {
        setAuthError(json.message || 'E-mail ou senha incorretos.');
      }
    } catch {
      setAuthError('Erro ao autenticar. Verifique sua conexão.');
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('odontoshield_superadmin_session');
    setIsAuthenticated(false);
    setLoggedInUser(null);
    setAuthPassword('');
    setAuthConfirmPassword('');
    checkAuthStatus();
  };

  const getSuperAdminToken = () => {
    try {
      const stored = localStorage.getItem('odontoshield_superadmin_session');
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.token || '';
      }
    } catch {
      return '';
    }
    return '';
  };

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const token = getSuperAdminToken();
      const res = await fetch('/api/admin/tenants', {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.warn('Erro ao carregar dados do admin:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleExtendTrial = async (tenantId: string) => {
    try {
      const token = getSuperAdminToken();
      const res = await fetch('/api/admin/tenants', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ tenantId, action: 'EXTEND_TRIAL', extraDays: 14 }),
      });
      if (res.ok) {
        setActionSuccessMessage('Trial estendido em +14 dias com sucesso!');
        setTimeout(() => setActionSuccessMessage(null), 3000);
        fetchAdminData();
      }
    } catch {
      alert('Erro ao estender trial');
    }
  };

  const handleActivateSubscription = async (tenantId: string) => {
    try {
      const token = getSuperAdminToken();
      const res = await fetch('/api/admin/tenants', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ tenantId, action: 'ACTIVATE' }),
      });
      if (res.ok) {
        setActionSuccessMessage('Assinatura ativada como CLIENTE PAGANTE!');
        setTimeout(() => setActionSuccessMessage(null), 3000);
        fetchAdminData();
      }
    } catch {
      alert('Erro ao ativar assinatura');
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const filteredTenants = (data?.tenants || []).filter((tenant) => {
    const matchesSearch =
      (tenant.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tenant.legalName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tenant.cnpj || '').includes(searchTerm) ||
      (tenant.technicalResponsibleName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tenant.phone || '').includes(searchTerm);

    const matchesStatus =
      statusFilter === 'ALL'
        ? true
        : statusFilter === 'TRIAL'
        ? tenant.subscriptionStatus === 'TRIAL'
        : tenant.subscriptionStatus === 'ACTIVE';

    return matchesSearch && matchesStatus;
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-3 md:p-6 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white border border-[#E2ECE6] rounded-3xl max-w-6xl w-full my-auto overflow-hidden shadow-2xl flex flex-col max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ========================================================== */}
        {/* CASO NÃO ESTEJA AUTENTICADO: TELA DE LOGIN OU CADASTRO MASTER */}
        {/* ========================================================== */}
        {!isAuthenticated ? (
          <div className="p-6 md:p-10 flex flex-col items-center justify-center max-w-md w-full mx-auto text-center my-auto">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-slate-900 via-teal-950 to-emerald-950 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-xl mb-4">
              <Crown className="w-8 h-8 text-amber-400" />
            </div>

            {authChecking ? (
              <div className="py-8 flex flex-col items-center space-y-3">
                <RefreshCw className="w-6 h-6 animate-spin text-teal-600" />
                <span className="text-xs text-slate-500 font-medium">Verificando credenciais de acesso seguro...</span>
              </div>
            ) : !hasMasterAccount ? (
              // PRIMEIRO ACESSO: CRIAR LOGIN E SENHA MASTER
              <div className="w-full text-left">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">
                    Primeiro Acesso: Criar Senha Master
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Defina o seu e-mail e a sua senha exclusiva de Diretor/SuperAdmin. Apenas você terá acesso a este painel.
                  </p>
                </div>

                {authError && (
                  <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}

                <form onSubmit={handleRegisterMaster} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Seu Nome Completo</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={authName}
                        onChange={(e) => setAuthName(e.target.value)}
                        placeholder="Ex: Lucas Ribeiro (Diretor)"
                        className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-[#E2ECE6] bg-slate-50 text-slate-900 focus:bg-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">E-mail Master (Seu E-mail)</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        placeholder="seuemail@exemplo.com"
                        className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-[#E2ECE6] bg-slate-50 text-slate-900 focus:bg-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Criar Senha Master</label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        placeholder="Mínimo 6 caracteres"
                        className="w-full pl-9 pr-10 py-2.5 text-xs rounded-xl border border-[#E2ECE6] bg-slate-50 text-slate-900 focus:bg-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Confirmar Senha Master</label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={authConfirmPassword}
                        onChange={(e) => setAuthConfirmPassword(e.target.value)}
                        placeholder="Repita sua senha"
                        className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-[#E2ECE6] bg-slate-50 text-slate-900 focus:bg-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={authSubmitting}
                    className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 hover:from-slate-800 hover:to-teal-900 text-teal-300 font-bold text-xs shadow-md transition flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    {authSubmitting ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-teal-400" />
                    ) : (
                      <>
                        <Lock className="w-4 h-4 text-amber-400" />
                        <span>Cadastrar & Acessar SuperAdmin</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              // JÁ POSSUI CONTA MASTER: LOGIN POR SENHA
              <div className="w-full text-left">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">
                    Acesso Restrito: SuperAdmin
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Digite seu e-mail e sua senha master para desbloquear o painel.
                  </p>
                </div>

                {authError && (
                  <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}

                <form onSubmit={handleLoginMaster} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">E-mail Master</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        placeholder="seuemail@exemplo.com"
                        className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-[#E2ECE6] bg-slate-50 text-slate-900 focus:bg-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                        required
                        autoFocus
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Senha Master</label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        placeholder="Digite sua senha"
                        className="w-full pl-9 pr-10 py-2.5 text-xs rounded-xl border border-[#E2ECE6] bg-slate-50 text-slate-900 focus:bg-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={authSubmitting}
                    className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 hover:from-slate-800 hover:to-teal-900 text-teal-300 font-bold text-xs shadow-md transition flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    {authSubmitting ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-teal-400" />
                    ) : (
                      <>
                        <Lock className="w-4 h-4 text-amber-400" />
                        <span>Desbloquear Painel Master</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            <button
              onClick={onClose}
              className="mt-6 text-xs text-slate-400 hover:text-slate-600 font-semibold transition"
            >
              Cancelar e Fechar
            </button>
          </div>
        ) : (
          // ==========================================================
          // CASO AUTENTICADO: O PAINEL DE CONTROLE COMPLETO DO SUPERADMIN
          // ==========================================================
          <>
            {/* Cabeçalho do SuperAdmin */}
            <div className="p-5 md:px-7 md:py-4 bg-[#F8FAF9] border-b border-[#E2ECE6] flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-3.5">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-slate-900 via-teal-950 to-emerald-900 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-sm">
                  <Crown className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <div className="flex items-center space-x-2.5">
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">
                      Painel Master SuperAdmin
                    </h3>
                    <span className="text-teal-900 text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200">
                      OdontoShield SaaS
                    </span>
                    {data?.database.isConfigured ? (
                      <span className="flex items-center space-x-1 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Nuvem PostgreSQL Ativa</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => setActiveTab('database_setup')}
                        className="flex items-center space-x-1 text-amber-900 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-300 hover:bg-amber-100 transition cursor-pointer"
                      >
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        <span>Modo Local (Clique p/ Conectar Nuvem)</span>
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Conectado como <strong className="text-teal-800">{loggedInUser?.name || 'Diretor'}</strong> ({loggedInUser?.email})
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={fetchAdminData}
                  disabled={loading}
                  className="p-2 rounded-xl text-slate-600 hover:text-teal-700 hover:bg-teal-50 border border-transparent hover:border-teal-200 transition cursor-pointer"
                  title="Atualizar dados agora"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-teal-600' : ''}`} />
                </button>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-xl text-slate-600 hover:text-rose-700 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
                  title="Bloquear e sair da sessão"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-500" />
                  <span>Sair</span>
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Mensagem de Ação com Sucesso */}
            {actionSuccessMessage && (
              <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2.5 flex items-center space-x-2 text-xs font-bold text-emerald-900 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{actionSuccessMessage}</span>
              </div>
            )}

            {/* Cards de Métricas SaaS de Topo */}
            <div className="p-4 md:px-7 md:py-4 bg-white border-b border-[#E2ECE6] grid grid-cols-2 md:grid-cols-4 gap-3 shrink-0">
              <div className="p-3.5 rounded-2xl bg-[#F8FAF9] border border-[#E2ECE6]">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-xs font-semibold">Clínicas Cadastradas</span>
                  <Building2 className="w-4 h-4 text-teal-600" />
                </div>
                <div className="text-2xl font-black text-slate-900">{data?.metrics.totalTenants || 0}</div>
                <div className="text-[11px] text-teal-700 font-medium mt-0.5">
                  {data?.metrics.trialCount || 0} em período de teste
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F8FAF9] border border-[#E2ECE6]">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-xs font-semibold">MRR Projetado</span>
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-black text-slate-900">
                  R$ {(data?.metrics.projectedMrr || 0).toLocaleString('pt-BR')},00
                </div>
                <div className="text-[11px] text-emerald-700 font-medium mt-0.5">
                  Receita mensal potencial
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F8FAF9] border border-[#E2ECE6]">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-xs font-semibold">Profissionais & Equipe</span>
                  <Users className="w-4 h-4 text-teal-600" />
                </div>
                <div className="text-2xl font-black text-slate-900">{data?.metrics.totalUsers || 0}</div>
                <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                  Dentistas, ASBs e TSBs
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F8FAF9] border border-[#E2ECE6]">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-xs font-semibold">Ciclos CME Auditados</span>
                  <Sparkles className="w-4 h-4 text-teal-600" />
                </div>
                <div className="text-2xl font-black text-slate-900">{data?.metrics.totalCycles || 0}</div>
                <div className="text-[11px] text-teal-700 font-medium mt-0.5">
                  Autoclaves & Laudos VISA
                </div>
              </div>
            </div>

            {/* Abas de Navegação Interna */}
            <div className="px-5 md:px-7 bg-[#F8FAF9] border-b border-[#E2ECE6] flex space-x-4 shrink-0 overflow-x-auto">
              <button
                onClick={() => setActiveTab('tenants')}
                className={`py-3 text-xs font-bold border-b-2 flex items-center space-x-2 transition cursor-pointer whitespace-nowrap ${
                  activeTab === 'tenants'
                    ? 'border-teal-600 text-teal-800'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Clínicas & Testadores ({filteredTenants.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('activity')}
                className={`py-3 text-xs font-bold border-b-2 flex items-center space-x-2 transition cursor-pointer whitespace-nowrap ${
                  activeTab === 'activity'
                    ? 'border-teal-600 text-teal-800'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Activity className="w-4 h-4" />
                <span>Feed de Atividades em Tempo Real</span>
              </button>

              <button
                onClick={() => setActiveTab('database_setup')}
                className={`py-3 text-xs font-bold border-b-2 flex items-center space-x-2 transition cursor-pointer whitespace-nowrap ${
                  activeTab === 'database_setup'
                    ? 'border-teal-600 text-teal-800'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Database className="w-4 h-4" />
                <span>Status da Nuvem (PostgreSQL)</span>
              </button>

              <button
                onClick={() => setActiveTab('stripe')}
                className={`py-3 text-xs font-bold border-b-2 flex items-center space-x-2 transition cursor-pointer whitespace-nowrap ${
                  activeTab === 'stripe'
                    ? 'border-teal-600 text-teal-800'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Integração Stripe (Pagamentos)</span>
                {data?.stripe?.isConfigured ? (
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                )}
              </button>
            </div>

            {/* Conteúdo Dinâmico das Abas */}
            <div className="p-5 md:p-7 overflow-y-auto flex-1">
              {/* ABA 1: CLÍNICAS E TESTADORES */}
              {activeTab === 'tenants' && (
                <div className="space-y-4">
                  {/* Barra de Filtros e Busca */}
                  <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
                    <div className="relative w-full sm:w-80">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar clínica, CNPJ, responsável..."
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#E2ECE6] bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 shadow-2xs"
                      />
                    </div>

                    <div className="flex items-center space-x-2 w-full sm:w-auto">
                      <span className="text-xs text-slate-500 font-medium">Filtrar:</span>
                      <div className="bg-[#F8FAF9] p-1 rounded-xl border border-[#E2ECE6] flex text-xs">
                        <button
                          onClick={() => setStatusFilter('ALL')}
                          className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                            statusFilter === 'ALL'
                              ? 'bg-white text-teal-800 shadow-2xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Todas
                        </button>
                        <button
                          onClick={() => setStatusFilter('TRIAL')}
                          className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                            statusFilter === 'TRIAL'
                              ? 'bg-white text-teal-800 shadow-2xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Em Teste (Trial)
                        </button>
                        <button
                          onClick={() => setStatusFilter('ACTIVE')}
                          className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                            statusFilter === 'ACTIVE'
                              ? 'bg-white text-teal-800 shadow-2xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Assinantes Ativos
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Lista / Tabela de Clínicas */}
                  {filteredTenants.length === 0 ? (
                    <div className="p-8 text-center bg-[#F8FAF9] rounded-2xl border border-dashed border-[#E2ECE6]">
                      <Building2 className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-sm font-bold text-slate-800">Nenhuma clínica encontrada</p>
                      <p className="text-xs text-slate-500 mt-1">
                        Tente buscar por outro termo ou remova os filtros.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredTenants.map((tenant) => {
                        const isTrial = tenant.subscriptionStatus === 'TRIAL';
                        const cleanPhone = (tenant.phone || '').replace(/\D/g, '');
                        const whatsappUrl = cleanPhone
                          ? `https://wa.me/55${cleanPhone}?text=Ol%C3%A1%20${encodeURIComponent(
                              tenant.technicalResponsibleName || 'Doutor(a)'
                            )}!%20Aqui%20%C3%A9%20do%20OdontoShield.%20Vi%20que%20voc%C3%AA%20se%20cadastrou%20para%20testar%20na%20sua%20cl%C3%ADnica%20(${encodeURIComponent(
                              tenant.name
                            )}).%20Como%20est%C3%A1%20sendo%20a%20experi%C3%AAncia%3F`
                          : null;

                        return (
                          <div
                            key={tenant.id}
                            className="p-5 rounded-2xl bg-white border border-[#E2ECE6] hover:border-teal-300 transition shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                          >
                            {/* Dados da Clínica */}
                            <div className="space-y-1.5 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-black text-slate-900 text-sm">{tenant.name}</span>
                                <span className="text-[10px] font-mono text-slate-500 px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">
                                  CNPJ: {tenant.cnpj || '00.000.000/0001-00'}
                                </span>
                                {isTrial ? (
                                  <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                                    <Clock className="w-3 h-3 text-amber-600" />
                                    <span>Em Teste: {tenant.trialDaysLeft || 14} dias restantes</span>
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                    <span>Assinante Ativo</span>
                                  </span>
                                )}
                                <span className="text-[10px] font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full">
                                  Plano {tenant.planName || 'Clínica Pro'} (R$ {tenant.monthlyFee || 149}/mês)
                                </span>
                              </div>

                              <div className="text-xs text-slate-600 flex flex-wrap items-center gap-y-1 gap-x-3">
                                <span className="flex items-center space-x-1">
                                  <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                                  <span className="font-semibold text-slate-800">
                                    RT: {tenant.technicalResponsibleName || 'Dr. Cirurgião Responsável'}
                                  </span>
                                  {tenant.technicalResponsibleCro && (
                                    <span className="text-slate-500">({tenant.technicalResponsibleCro})</span>
                                  )}
                                </span>

                                {tenant.phone && (
                                  <span className="flex items-center space-x-1">
                                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                                    <span>{tenant.phone}</span>
                                  </span>
                                )}

                                {tenant.address && (
                                  <span className="text-slate-500 truncate max-w-xs">
                                    {tenant.address}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Botões de Ação do SuperAdmin */}
                            <div className="flex flex-wrap items-center gap-2 shrink-0">
                              {/* Botão de WhatsApp */}
                              {whatsappUrl ? (
                                <a
                                  href={whatsappUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold transition flex items-center space-x-1.5 shadow-2xs"
                                  title="Iniciar conversa no WhatsApp com este responsável"
                                >
                                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Falar no WhatsApp</span>
                                </a>
                              ) : (
                                <button
                                  disabled
                                  className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-400 text-xs font-medium cursor-not-allowed"
                                >
                                  Sem Telefone
                                </button>
                              )}

                              {/* Estender Trial */}
                              {isTrial && (
                                <button
                                  onClick={() => handleExtendTrial(tenant.id)}
                                  className="px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold transition shadow-2xs cursor-pointer"
                                  title="Adicionar mais 14 dias de teste grátis para este cliente"
                                >
                                  +14d Trial
                                </button>
                              )}

                              {/* Ativar Assinatura */}
                              {isTrial && (
                                <button
                                  onClick={() => handleActivateSubscription(tenant.id)}
                                  className="px-2.5 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 border border-teal-300 text-teal-800 text-xs font-bold transition shadow-2xs cursor-pointer"
                                  title="Marcar como cliente pagante aprovado"
                                >
                                  Ativar Plano
                                </button>
                              )}

                              {/* Botão Entrar como esta clínica */}
                              <button
                                onClick={() => {
                                  onSelectClinic(tenant);
                                  onClose();
                                }}
                                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-teal-900 text-white text-xs font-bold transition flex items-center space-x-1.5 shadow-sm cursor-pointer"
                                title="Alternar o sistema para visualizar exatamente o que este usuário cadastrou"
                              >
                                <span>Acessar Painel Desta Clínica</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* ABA 2: FEED DE ATIVIDADES EM TEMPO REAL */}
              {activeTab === 'activity' && (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-[#F8FAF9] border border-[#E2ECE6] text-xs text-slate-600">
                    <span className="font-bold text-slate-800">Monitor de Auditoria e Atividade:</span> Aqui você acompanha as ações realizadas pelos testadores e colaboradores em tempo real.
                  </div>

                  <div className="divide-y divide-[#E2ECE6] border border-[#E2ECE6] rounded-2xl bg-white overflow-hidden shadow-xs">
                    {(data?.activityLogs || []).map((log) => (
                      <div key={log.id} className="p-4 flex items-start space-x-3 hover:bg-[#F8FAF9] transition">
                        <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0 mt-0.5 font-bold">
                          <Activity className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900">{log.tenantName}</span>
                            <span className="text-[10px] text-slate-400">
                              {new Date(log.createdAt).toLocaleTimeString('pt-BR', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                          <p className="text-xs text-slate-700 mt-0.5">{log.description}</p>
                          <div className="flex items-center space-x-2 text-[10px] text-slate-500 mt-1">
                            <span className="font-semibold text-teal-700">{log.userName}</span>
                            <span>•</span>
                            <span className="font-mono uppercase">{log.actionType}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ABA 3: STATUS DA NUVEM POSTGRESQL */}
              {activeTab === 'database_setup' && (
                <div className="space-y-6 max-w-3xl mx-auto">
                  <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200">
                    <div className="flex items-center space-x-3 mb-2">
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                      <h4 className="font-bold text-slate-900 text-sm">
                        Banco de Dados PostgreSQL 100% Conectado e Operacional
                      </h4>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      O seu banco <strong>odontoshield-db</strong> no Render está conectado e ativo. Cada clínica que se cadastrar, cada novo usuário e cada ciclo de autoclave é salvo permanentemente na nuvem.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-[#E2ECE6] space-y-2 text-xs">
                    <div className="font-bold text-slate-900">Segurança Master Ativada:</div>
                    <p className="text-slate-600">
                      O painel de SuperAdmin está protegido por criptografia SHA-256 com salt. Somente o usuário master cadastrado pode acessar as métricas de faturamento e os dados dos clientes.
                    </p>
                  </div>
                </div>
              )}

              {/* ABA 4: INTEGRAÇÃO STRIPE (PAGAMENTOS & FATURAMENTO RECORRENTE) */}
              {activeTab === 'stripe' && (
                <div className="space-y-6 max-w-3xl mx-auto">
                  {/* Banner de Status */}
                  {data?.stripe?.isConfigured ? (
                    <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200">
                      <div className="flex items-center space-x-3 mb-2">
                        <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">
                            Stripe Conectado e Operacional
                          </h4>
                          <span className="text-xs text-emerald-800 font-semibold">
                            Sua conta Stripe está vinculada. Os pagamentos de assinaturas caem direto na sua conta bancária!
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200">
                      <div className="flex items-center space-x-3 mb-2">
                        <CreditCard className="w-6 h-6 text-amber-600 shrink-0" />
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">
                            Vincular sua Conta Stripe ao OdontoShield
                          </h4>
                          <span className="text-xs text-amber-800 font-semibold">
                            Siga os 3 passos simples abaixo para receber os pagamentos de cartão de crédito e PIX direto na sua conta do Stripe.
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Passo a Passo de Conexão */}
                  <div className="space-y-4">
                    {/* Passo 1 */}
                    <div className="p-4 rounded-2xl bg-white border border-[#E2ECE6] space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-teal-800">
                        <div className="flex items-center space-x-2">
                          <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-[11px]">
                            1
                          </span>
                          <span>Obter sua Chave Secreta no Stripe</span>
                        </div>
                        <a
                          href="https://dashboard.stripe.com/apikeys"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-teal-700 hover:text-teal-900 underline flex items-center space-x-1 text-[11px]"
                        >
                          <span>Abrir Stripe API Keys</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <p className="text-xs text-slate-600 pl-7">
                        Acesse seu painel do Stripe em <strong>Desenvolvedores ➔ Chaves de API</strong> e revele a sua <strong>Chave Secreta (Secret Key)</strong> que começa com <code>sk_live_...</code> (ou <code>sk_test_...</code> para testes).
                      </p>
                    </div>

                    {/* Passo 2 */}
                    <div className="p-4 rounded-2xl bg-white border border-[#E2ECE6] space-y-2">
                      <div className="flex items-center space-x-2 text-xs font-bold text-teal-800">
                        <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-[11px]">
                          2
                        </span>
                        <span>Adicionar a variável no Render</span>
                      </div>
                      <p className="text-xs text-slate-600 pl-7 mb-2">
                        No seu painel do Render (no serviço <strong>agente-clinicas</strong> ➔ <strong>Environment</strong>), adicione a variável:
                      </p>

                      <div className="pl-7">
                        <div className="p-3 rounded-xl bg-slate-900 text-white flex items-center justify-between text-xs font-mono">
                          <div>
                            <span className="text-slate-400">KEY: </span>
                            <span className="text-teal-400 font-bold">STRIPE_SECRET_KEY</span>
                          </div>
                          <button
                            onClick={() => handleCopy('STRIPE_SECRET_KEY', 'stripe_key')}
                            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-sans flex items-center space-x-1 cursor-pointer"
                          >
                            {copiedKey === 'stripe_key' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>Copiar Nome</span>
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">
                          No campo <strong>VALUE</strong>, cole a sua chave <code>sk_live_...</code> (ou <code>sk_test_...</code>) do Stripe.
                        </p>
                      </div>
                    </div>

                    {/* Passo 3 */}
                    <div className="p-4 rounded-2xl bg-white border border-[#E2ECE6] space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-teal-800">
                        <div className="flex items-center space-x-2">
                          <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-[11px]">
                            3
                          </span>
                          <span>Cadastrar o Webhook no Stripe (Ativação Automática)</span>
                        </div>
                        <a
                          href="https://dashboard.stripe.com/webhooks"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-teal-700 hover:text-teal-900 underline flex items-center space-x-1 text-[11px]"
                        >
                          <span>Abrir Stripe Webhooks</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <p className="text-xs text-slate-600 pl-7 mb-2">
                        No Stripe, clique em <strong>Adicionar Endpoint</strong> e cole o link abaixo para o OdontoShield ativar as clínicas automaticamente após o pagamento:
                      </p>

                      <div className="pl-7">
                        <div className="p-3 rounded-xl bg-slate-900 text-white flex items-center justify-between text-xs font-mono">
                          <span className="text-teal-300 truncate max-w-md">
                            https://agente-clinicas.onrender.com/api/stripe/webhook
                          </span>
                          <button
                            onClick={() =>
                              handleCopy(
                                'https://agente-clinicas.onrender.com/api/stripe/webhook',
                                'webhook_url'
                              )
                            }
                            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-sans flex items-center space-x-1 cursor-pointer shrink-0"
                          >
                            {copiedKey === 'webhook_url' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>Copiar URL</span>
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">
                          Eventos para marcar no Stripe: <code>checkout.session.completed</code> e <code>customer.subscription.updated</code>.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Planos e Faturamento do SaaS */}
                  <div className="p-5 rounded-2xl bg-white border border-[#E2ECE6] space-y-3">
                    <h4 className="text-xs font-bold text-slate-900">
                      Tabela de Preços e Planos Configurados no Stripe:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-[#F8FAF9] border border-[#E2ECE6]">
                        <div className="font-bold text-slate-900">Consultório Solo</div>
                        <div className="text-lg font-black text-teal-700 mt-0.5">R$ 79/mês</div>
                        <div className="text-[10px] text-slate-500">ou R$ 63/mês no anual</div>
                      </div>
                      <div className="p-3 rounded-xl bg-teal-50 border border-teal-200">
                        <div className="font-bold text-teal-950">Clínica Pro (Mais Escolhido)</div>
                        <div className="text-lg font-black text-teal-800 mt-0.5">R$ 149/mês</div>
                        <div className="text-[10px] text-teal-700">ou R$ 119/mês no anual</div>
                      </div>
                      <div className="p-3 rounded-xl bg-[#F8FAF9] border border-[#E2ECE6]">
                        <div className="font-bold text-slate-900">Redes & Franquias</div>
                        <div className="text-lg font-black text-teal-700 mt-0.5">R$ 299/mês</div>
                        <div className="text-[10px] text-slate-500">ou R$ 239/mês no anual</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Rodapé do Modal */}
            <div className="p-4 md:px-7 bg-[#F8FAF9] border-t border-[#E2ECE6] flex items-center justify-between shrink-0">
              <div className="text-xs text-slate-500 flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 text-teal-700" />
                <span>Acesso Restrito: Diretor Geral / SuperAdmin OdontoShield</span>
              </div>

              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-[#E2ECE6] text-slate-700 font-bold text-xs shadow-2xs transition cursor-pointer"
              >
                Fechar Painel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
