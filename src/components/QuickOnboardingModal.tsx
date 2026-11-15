'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Building2,
  Stethoscope,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Lock,
  Layers,
  Clock,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { ClinicTenant, UserProfile } from '@/lib/types';

interface QuickOnboardingModalProps {
  isOpen: boolean;
  initialPlan?: 'SOLO' | 'PRO' | 'ENTERPRISE';
  onComplete: (clinic: ClinicTenant, user: UserProfile) => void;
}

export const QuickOnboardingModal: React.FC<QuickOnboardingModalProps> = ({
  isOpen,
  initialPlan = 'PRO',
  onComplete,
}) => {
  const [clinicName, setClinicName] = useState<string>('');
  const [responsibleName, setResponsibleName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [cityState, setCityState] = useState<string>('');
  const [cro, setCro] = useState<string>('');
  const [chairsCount, setChairsCount] = useState<number>(initialPlan === 'SOLO' ? 1 : 2);
  const [selectedPlan, setSelectedPlan] = useState<'SOLO' | 'PRO' | 'ENTERPRISE'>(initialPlan);

  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!clinicName.trim()) {
      setErrorMessage('Por favor, informe o nome do seu consultório ou clínica.');
      return;
    }
    if (!responsibleName.trim()) {
      setErrorMessage('Por favor, informe o seu nome completo (Dentista ou Responsável).');
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      setErrorMessage('Informe um número de WhatsApp válido com DDD para contato.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Informe um e-mail válido para login e envio de relatórios.');
      return;
    }

    setLoading(true);

    const tenantId = `clinic_${Date.now()}`;
    const cleanPhone = phone.replace(/\D/g, '');

    const newClinic: ClinicTenant = {
      id: tenantId,
      name: clinicName.trim(),
      legalName: clinicName.trim(),
      cnpj: 'Pendente de preenchimento',
      sanitaryLicense: 'Alvará em regularização',
      licenseExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      croRegistration: cro.trim() || 'CRO em regularização',
      chairsCount: chairsCount || 2,
      nspRequired: chairsCount > 3,
      nspStatus: chairsCount > 3 ? 'ACTIVE' : 'EXEMPT',
      address: cityState.trim() || 'Brasil',
      phone: cleanPhone,
      technicalResponsibleName: responsibleName.trim(),
      technicalResponsibleCro: cro.trim() || 'CRO-SP 00000',
      technicalResponsiblePhone: cleanPhone,
      technicalResponsibleEmail: email.trim().toLowerCase(),
      planId: selectedPlan,
      planName: selectedPlan === 'SOLO' ? 'Consultório Solo' : selectedPlan === 'PRO' ? 'Clínica Pro' : 'Redes & Franquias',
      subscriptionStatus: 'TRIAL',
      trialDaysLeft: 30, // Teste de 30 dias grátis conforme a LP
      monthlyFee: selectedPlan === 'SOLO' ? 79 : selectedPlan === 'PRO' ? 149 : 299,
    };

    const newUser: UserProfile = {
      id: `user_${Date.now()}`,
      name: responsibleName.trim(),
      email: email.trim().toLowerCase(),
      role: 'TECHNICAL_RESPONSIBLE',
      roleName: 'Responsável Técnico (RT)',
      croNumber: cro.trim() || '12345',
      croState: 'SP',
      phone: cleanPhone,
    };

    try {
      // 1. Salvar no PostgreSQL em nuvem e no SuperAdmin em tempo real
      await fetch('/api/admin/tenants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenant: newClinic }),
      });

      // 2. Salvar na sincronização de dados
      await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'CREATE_TENANT', payload: newClinic }),
      });

      // 3. Salvar no navegador da pessoa
      localStorage.setItem('odontoshield_registered_clinic', JSON.stringify(newClinic));
      localStorage.setItem('odontoshield_auth_user', JSON.stringify(newUser));

      setIsSuccess(true);
      setTimeout(() => {
        onComplete(newClinic, newUser);
      }, 1500);
    } catch (err) {
      console.warn('Erro ao salvar novo cadastro:', err);
      // Fallback: salva localmente e prossegue
      localStorage.setItem('odontoshield_registered_clinic', JSON.stringify(newClinic));
      localStorage.setItem('odontoshield_auth_user', JSON.stringify(newUser));
      setIsSuccess(true);
      setTimeout(() => {
        onComplete(newClinic, newUser);
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 md:p-6 overflow-y-auto animate-in fade-in duration-300">
      <div className="bg-white border border-[#E2ECE6] rounded-3xl max-w-xl w-full my-auto overflow-hidden shadow-2xl flex flex-col max-h-[96vh]">
        {/* Cabeçalho */}
        <div className="p-5 md:px-7 md:py-5 bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 text-white flex items-center justify-between shrink-0 border-b border-teal-800/40">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-slate-950 shadow-lg shadow-teal-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-lg tracking-tight">OdontoShield</span>
                <span className="text-[10px] uppercase font-bold bg-teal-500/20 text-teal-300 border border-teal-400/30 px-2 py-0.5 rounded-full">
                  RDC 1002/2025
                </span>
              </div>
              <p className="text-xs text-teal-200/80 mt-0.5">
                Cadastro Rápido para Início do Teste de 30 Dias
              </p>
            </div>
          </div>

          <div className="text-right hidden sm:block">
            <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>Sem Cartão de Crédito</span>
            </span>
          </div>
        </div>

        {/* Formulário ou Mensagem de Sucesso */}
        <div className="p-5 md:p-7 overflow-y-auto flex-1">
          {isSuccess ? (
            <div className="py-8 text-center space-y-4 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  Parabéns, Dr(a). {responsibleName}!
                </h3>
                <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                  O consultório <strong>{clinicName}</strong> foi cadastrado com sucesso. Seu período de <strong>30 dias grátis</strong> está liberado e ativo!
                </p>
              </div>
              <div className="inline-flex items-center space-x-2 text-xs text-teal-700 font-bold bg-teal-50 border border-teal-200 px-4 py-2 rounded-xl">
                <RefreshCw className="w-4 h-4 animate-spin text-teal-600" />
                <span>Abrindo seu painel agora...</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Alerta de Erro */}
              {errorMessage && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center space-x-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Seletor de Plano Escolhido */}
              <div className="p-3.5 rounded-2xl bg-[#F8FAF9] border border-[#E2ECE6] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">Plano Selecionado:</span>
                  <span className="text-[11px] font-bold text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full">
                    30 Dias Grátis
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPlan('SOLO');
                      setChairsCount(1);
                    }}
                    className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                      selectedPlan === 'SOLO'
                        ? 'border-teal-600 bg-white shadow-xs text-teal-900 font-bold ring-1 ring-teal-500'
                        : 'border-[#E2ECE6] bg-slate-50 text-slate-600 hover:bg-white'
                    }`}
                  >
                    <div className="text-[11px] font-black">Solo</div>
                    <div className="text-[10px] text-slate-500">1 Cadeira</div>
                    <div className="text-[11px] font-bold text-teal-700 mt-0.5">R$ 79/mês</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPlan('PRO');
                      setChairsCount(2);
                    }}
                    className={`p-2.5 rounded-xl border text-center transition cursor-pointer relative ${
                      selectedPlan === 'PRO'
                        ? 'border-teal-600 bg-white shadow-xs text-teal-900 font-bold ring-1 ring-teal-500'
                        : 'border-[#E2ECE6] bg-slate-50 text-slate-600 hover:bg-white'
                    }`}
                  >
                    <span className="absolute -top-2 right-2 text-[8px] uppercase tracking-wider font-extrabold px-1.5 py-0.2 bg-teal-600 text-white rounded-full">
                      Popular
                    </span>
                    <div className="text-[11px] font-black">Clínica Pro</div>
                    <div className="text-[10px] text-slate-500">Até 4 Cadeiras</div>
                    <div className="text-[11px] font-bold text-teal-700 mt-0.5">R$ 149/mês</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPlan('ENTERPRISE');
                      setChairsCount(5);
                    }}
                    className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                      selectedPlan === 'ENTERPRISE'
                        ? 'border-teal-600 bg-white shadow-xs text-teal-900 font-bold ring-1 ring-teal-500'
                        : 'border-[#E2ECE6] bg-slate-50 text-slate-600 hover:bg-white'
                    }`}
                  >
                    <div className="text-[11px] font-black">Redes</div>
                    <div className="text-[10px] text-slate-500">Multi-filiais</div>
                    <div className="text-[11px] font-bold text-teal-700 mt-0.5">R$ 299/mês</div>
                  </button>
                </div>
              </div>

              {/* Campos do Formulário Simples */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nome da Clínica ou Consultório *
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={clinicName}
                      onChange={(e) => setClinicName(e.target.value)}
                      placeholder="Ex: Consultório Odontológico Dr. Lucas Ribeiro"
                      className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-[#E2ECE6] bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nome do Cirurgião-Dentista *
                    </label>
                    <div className="relative">
                      <Stethoscope className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={responsibleName}
                        onChange={(e) => setResponsibleName(e.target.value)}
                        placeholder="Ex: Dr. Lucas Ribeiro"
                        className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-[#E2ECE6] bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nº do CRO (Opcional)
                    </label>
                    <div className="relative">
                      <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={cro}
                        onChange={(e) => setCro(e.target.value)}
                        placeholder="Ex: CRO-SP 12345"
                        className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-[#E2ECE6] bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      WhatsApp com DDD *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Ex: (11) 98888-7777"
                        className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-[#E2ECE6] bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      E-mail de Acesso *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="doutor@suaclinica.com.br"
                        className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-[#E2ECE6] bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Cidade e Estado (UF) *
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={cityState}
                        onChange={(e) => setCityState(e.target.value)}
                        placeholder="Ex: São Paulo - SP"
                        className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-[#E2ECE6] bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Cadeiras Odontológicas
                    </label>
                    <div className="relative">
                      <Layers className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <select
                        value={chairsCount}
                        onChange={(e) => setChairsCount(Number(e.target.value))}
                        className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-[#E2ECE6] bg-slate-50 text-slate-900 focus:bg-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                      >
                        <option value={1}>1 Consultório (1 Cadeira)</option>
                        <option value={2}>2 Cadeiras Odontológicas</option>
                        <option value={3}>3 Cadeiras Odontológicas</option>
                        <option value={4}>4 Cadeiras Odontológicas</option>
                        <option value={6}>5 a 10 Cadeiras (Policlínica)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botão de Envio */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 hover:from-teal-500 hover:to-emerald-500 text-white font-black text-sm shadow-lg shadow-teal-700/25 transition transform active:scale-98 flex items-center justify-center space-x-2 cursor-pointer"
              >
                {loading ? (
                  <RefreshCw className="w-5 h-5 animate-spin text-white" />
                ) : (
                  <>
                    <span>Liberar Acesso & Entrar no Sistema</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center">
                <p className="text-[11px] text-slate-400">
                  Ao clicar, você inicia seu período de 30 dias de degustação gratuita sem fidelidade.
                </p>
              </div>
            </form>
          )}
        </div>

        {/* Rodapé Seguro */}
        <div className="p-3 md:px-7 bg-[#F8FAF9] border-t border-[#E2ECE6] flex items-center justify-between text-[11px] text-slate-500 shrink-0">
          <div className="flex items-center space-x-1.5">
            <Lock className="w-3.5 h-3.5 text-teal-600" />
            <span>Dados protegidos por criptografia em nuvem</span>
          </div>
          <span>OdontoShield RDC 1002</span>
        </div>
      </div>
    </div>
  );
};
