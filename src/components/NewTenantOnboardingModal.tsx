'use client';

import React, { useState } from 'react';
import {
  X,
  Building2,
  Search,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  RefreshCw,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';
import { ClinicTenant } from '@/lib/types';

interface NewTenantOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTenantCreated: (newClinic: ClinicTenant) => void;
}

export const NewTenantOnboardingModal: React.FC<NewTenantOnboardingModalProps> = ({
  isOpen,
  onClose,
  onTenantCreated,
}) => {
  const [cnpj, setCnpj] = useState<string>('');
  const [legalName, setLegalName] = useState<string>('');
  const [tradeName, setTradeName] = useState<string>('');
  const [sanitaryLicense, setSanitaryLicense] = useState<string>('');
  const [croPj, setCroPj] = useState<string>('');
  const [technicalResponsibleName, setTechnicalResponsibleName] = useState<string>('');
  const [technicalResponsibleCro, setTechnicalResponsibleCro] = useState<string>('');
  const [chairsCount, setChairsCount] = useState<number>(2);
  const [address, setAddress] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [selectedPlan, setSelectedPlan] = useState<'SOLO' | 'PRO' | 'ENTERPRISE'>('PRO');

  const [isSearchingCnpj, setIsSearchingCnpj] = useState<boolean>(false);
  const [cnpjError, setCnpjError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  // Busca automática do CNPJ na BrasilAPI (grátis, sem captcha)
  const handleSearchCnpj = async () => {
    const cleanCnpj = cnpj.replace(/\D/g, '');
    if (cleanCnpj.length !== 14) {
      setCnpjError('O CNPJ deve conter 14 dígitos numéricos.');
      return;
    }

    setIsSearchingCnpj(true);
    setCnpjError(null);

    try {
      const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cleanCnpj}`);
      if (res.ok) {
        const data = await res.json();
        setLegalName(data.razao_social || '');
        setTradeName(data.nome_fantasia || data.razao_social || '');
        if (data.logradouro) {
          setAddress(`${data.logradouro}, ${data.numero || 'S/N'} - ${data.bairro || ''}, ${data.municipio || ''} - ${data.uf || ''}`);
        }
        if (data.ddd_telefone_1) {
          setPhone(data.ddd_telefone_1.replace(/\D/g, ''));
        }
        if (data.email) {
          setEmail(data.email.toLowerCase());
        }
      } else {
        setCnpjError('CNPJ não localizado na Receita Federal ou fora do ar. Preencha manualmente.');
      }
    } catch {
      setCnpjError('Não foi possível consultar a Receita automaticamente. Preencha os campos abaixo.');
    } finally {
      setIsSearchingCnpj(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tradeName.trim() && !legalName.trim()) return;

    const newClinicTenant: ClinicTenant = {
      id: `clinic_${Date.now()}`,
      name: tradeName.trim() || legalName.trim(),
      legalName: legalName.trim() || tradeName.trim(),
      cnpj: cnpj.trim() || '00.000.000/0001-00',
      sanitaryLicense: sanitaryLicense.trim() || 'VISA-MUNICIPAL-2026',
      licenseExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      croRegistration: croPj.trim() || 'CRO-SP 99999',
      chairsCount: chairsCount || 2,
      nspRequired: chairsCount > 3,
      nspStatus: chairsCount > 3 ? 'PENDING' : 'EXEMPT',
      address: address.trim(),
      phone: phone.trim(),
      technicalResponsibleName: technicalResponsibleName.trim() || 'Dr. Cirurgião Responsável',
      technicalResponsibleCro: technicalResponsibleCro.trim() || 'CRO-SP 123456',
      planId: selectedPlan,
      planName: selectedPlan === 'SOLO' ? 'Consultório Solo' : selectedPlan === 'PRO' ? 'Clínica Pro' : 'Redes & Franquias',
      subscriptionStatus: 'TRIAL',
      trialDaysLeft: 14,
      monthlyFee: selectedPlan === 'SOLO' ? 79 : selectedPlan === 'PRO' ? 149 : 299,
    };

    setIsSuccess(true);
    setTimeout(() => {
      onTenantCreated(newClinicTenant);
      onClose();
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-3 md:p-6 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white border border-[#E2ECE6] rounded-3xl max-w-2xl w-full my-auto overflow-hidden shadow-2xl flex flex-col max-h-[95vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho */}
        <div className="p-5 md:px-6 md:py-4 bg-[#F8FAF9] border-b border-[#E2ECE6] flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shadow-sm">
              <Building2 className="w-5 h-5 font-black" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center space-x-2">
                <span>Cadastrar Nova Clínica (SaaS Onboarding)</span>
                <span className="text-teal-800 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200">
                  14 Dias Grátis
                </span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Provisionamento multi-tenant automático para auditoria sanitária da sua clínica
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-5 md:p-6 space-y-4 overflow-y-auto flex-1">
          {/* Passo 1: Busca por CNPJ */}
          <div className="bg-[#F8FAF9] border border-teal-200 rounded-2xl p-4 space-y-2">
            <label className="text-xs font-bold text-teal-900 uppercase tracking-wider block">
              1. CNPJ da Clínica (Busca Automática na Receita Federal):
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={cnpj}
                onChange={(e) => setCnpj(e.target.value)}
                placeholder="Ex: 12.345.678/0001-90"
                className="flex-1 bg-white border border-[#E2ECE6] rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-600 font-mono shadow-sm"
              />
              <button
                type="button"
                onClick={handleSearchCnpj}
                disabled={isSearchingCnpj}
                className="flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold rounded-xl text-xs transition disabled:opacity-50 shrink-0 shadow-sm"
              >
                {isSearchingCnpj ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Search className="w-3.5 h-3.5" />
                )}
                <span>{isSearchingCnpj ? 'Consultando...' : 'Buscar Dados'}</span>
              </button>
            </div>

            {cnpjError && (
              <p className="text-[11px] text-amber-700 font-medium flex items-center space-x-1 pt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{cnpjError}</span>
              </p>
            )}
          </div>

          {/* Passo 2: Dados Principais */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-slate-800 font-bold block mb-1">Nome Fantasia da Clínica *</label>
              <input
                type="text"
                required
                value={tradeName}
                onChange={(e) => setTradeName(e.target.value)}
                placeholder="Ex: Clínica Odonto Inova"
                className="w-full bg-white border border-[#E2ECE6] rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-600 shadow-sm"
              />
            </div>
            <div>
              <label className="text-slate-800 font-bold block mb-1">Razão Social (PJ)</label>
              <input
                type="text"
                value={legalName}
                onChange={(e) => setLegalName(e.target.value)}
                placeholder="Ex: Odonto Inova Serviços Médicos Ltda"
                className="w-full bg-white border border-[#E2ECE6] rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-600 shadow-sm"
              />
            </div>

            <div>
              <label className="text-slate-800 font-bold block mb-1">Responsável Técnico (RT) *</label>
              <input
                type="text"
                required
                value={technicalResponsibleName}
                onChange={(e) => setTechnicalResponsibleName(e.target.value)}
                placeholder="Ex: Dr. Lucas Ribeiro"
                className="w-full bg-white border border-[#E2ECE6] rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-600 shadow-sm"
              />
            </div>
            <div>
              <label className="text-slate-800 font-bold block mb-1">CRO do Responsável Técnico *</label>
              <input
                type="text"
                required
                value={technicalResponsibleCro}
                onChange={(e) => setTechnicalResponsibleCro(e.target.value)}
                placeholder="Ex: CRO-SP 123456"
                className="w-full bg-white border border-[#E2ECE6] rounded-xl px-3 py-2 text-slate-900 font-mono focus:outline-none focus:border-teal-600 shadow-sm"
              />
            </div>

            <div>
              <label className="text-slate-800 font-bold block mb-1">Qtd. de Consultórios / Cadeiras</label>
              <select
                value={chairsCount}
                onChange={(e) => setChairsCount(parseInt(e.target.value))}
                className="w-full bg-white border border-[#E2ECE6] rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-600 shadow-sm"
              >
                <option value={1}>1 Consultório (Consultório Individual)</option>
                <option value={2}>2 Consultórios</option>
                <option value={3}>3 Consultórios</option>
                <option value={4}>4 Consultórios</option>
                <option value={6}>5 a 10 Consultórios (Policlínica)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-800 font-bold block mb-1">Inscrição CRO-PJ (Clínica)</label>
              <input
                type="text"
                value={croPj}
                onChange={(e) => setCroPj(e.target.value)}
                placeholder="Ex: CRO-SP 98765-PJ"
                className="w-full bg-white border border-[#E2ECE6] rounded-xl px-3 py-2 text-slate-900 font-mono focus:outline-none focus:border-teal-600 shadow-sm"
              />
            </div>
          </div>

          {/* Passo 3: Escolha do Plano SaaS */}
          <div className="pt-2">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
              2. Escolha o Plano (Inicie com 14 Dias Grátis sem Cartão):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              {[
                { id: 'SOLO' as const, name: 'Solo', price: 'R$ 79/mês', desc: '1 consultório' },
                { id: 'PRO' as const, name: 'Clínica Pro', price: 'R$ 149/mês', desc: 'Até 4 consultórios + WhatsApp' },
                { id: 'ENTERPRISE' as const, name: 'Redes/Franquias', price: 'R$ 299/mês', desc: 'Multi-filiais' },
              ].map((pl) => (
                <div
                  key={pl.id}
                  onClick={() => setSelectedPlan(pl.id)}
                  className={`p-3 rounded-2xl border cursor-pointer transition ${
                    selectedPlan === pl.id
                      ? 'bg-teal-50 border-teal-500 text-teal-950 ring-2 ring-teal-500/30 shadow-sm'
                      : 'bg-white border-[#E2ECE6] text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold text-slate-900 flex justify-between items-center">
                    <span>{pl.name}</span>
                    <span className="text-teal-700 font-mono text-[11px] font-bold">{pl.price}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">{pl.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {isSuccess && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-900 text-xs flex items-center space-x-2.5 animate-in zoom-in-95 duration-150 shadow-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold">Clínica Criada com Sucesso!</p>
                <p className="text-[11px] text-emerald-700">
                  Tenant configurado e 14 dias de avaliação ativados.
                </p>
              </div>
            </div>
          )}

          {/* Botão de Finalização */}
          <div className="pt-3 border-t border-[#E2ECE6] flex justify-end space-x-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-teal-700/20 transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Criar Conta & Iniciar Teste Grátis</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};