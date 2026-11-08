'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Stethoscope,
  AlertTriangle,
  FileText,
  Wrench,
  Sparkles,
  Building2,
  UserCheck,
  Users,
  QrCode,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  CreditCard,
  Database,
  Building,
  PlusCircle,
  Globe,
} from 'lucide-react';
import { ClinicTenant, UserProfile } from '@/lib/types';
import { CURRENT_CLINIC, CURRENT_USER } from '@/lib/mockData';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenDossier: () => void;
  onOpenWhatsAppAutomations?: () => void;
  onOpenSubscription?: () => void;
  onOpenNewTenant?: () => void;
  onOpenFranchise?: () => void;
  onOpenEhr?: () => void;
  clinic?: ClinicTenant;
  currentUser?: UserProfile;
  onSwitchUser?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenDossier,
  onOpenWhatsAppAutomations,
  onOpenSubscription,
  onOpenNewTenant,
  onOpenFranchise,
  onOpenEhr,
  clinic = CURRENT_CLINIC,
  currentUser = CURRENT_USER,
  onSwitchUser,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollNav = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 260;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Painel Geral', icon: ShieldCheck },
    { id: 'cme', label: 'CME & Esterilização', icon: Sparkles },
    { id: 'instruments', label: 'Instrumentais & Kits', icon: Stethoscope },
    { id: 'equipments', label: 'Equipamentos & Laudos', icon: Wrench },
    { id: 'pops', label: 'POPs & Treinamentos', icon: FileText },
    { id: 'safety', label: 'Segurança do Paciente (NSP)', icon: AlertTriangle },
    { id: 'traceability', label: 'Rastreabilidade (Paciente x Kit)', icon: QrCode },
    { id: 'team', label: 'Clínica & Equipe', icon: Users },
  ];

  const userInitials = (currentUser?.name || 'US')
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('');

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-[#E2ECE6] text-slate-800 sticky top-0 z-40 shadow-xs">
      {/* Linha de acabamento superior hospitalar sutil */}
      <div className="h-1 bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-600 w-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Marca - Identidade Grau Cirúrgico */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center shadow-md shadow-teal-700/20">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-lg tracking-tight text-slate-900">
                  OdontoShield
                </span>
                <span className="text-[10px] uppercase font-bold bg-teal-50 text-teal-800 border border-teal-300 px-2 py-0.5 rounded-full shadow-2xs">
                  RDC 1002/2025
                </span>
              </div>
              <div className="flex items-center text-xs text-slate-500 space-x-1">
                <Building2 className="w-3 h-3 text-teal-600" />
                <span className="truncate max-w-[200px] font-medium">{clinic?.name || 'Clínica Odontológica'}</span>
              </div>
            </div>
          </div>

          {/* Botões de Ação do SaaS & Usuário Ativo */}
          <div className="hidden md:flex items-center space-x-2">
            {onOpenSubscription && (
              <button
                type="button"
                onClick={onOpenSubscription}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-800 text-xs font-semibold shadow-2xs transition cursor-pointer"
                title="Gerenciar Plano SaaS e Faturamento"
              >
                <CreditCard className="w-3.5 h-3.5 text-teal-600" />
                <span>{clinic?.planName || 'Plano Pro'} ({clinic?.trialDaysLeft || 14}d)</span>
              </button>
            )}

            <Link
              href="/lp"
              target="_blank"
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium transition cursor-pointer"
              title="Visualizar a Landing Page pública de divulgação do OdontoShield"
            >
              <Globe className="w-3.5 h-3.5 text-teal-600" />
              <span>Ver LP</span>
            </Link>

            {onOpenNewTenant && (
              <button
                type="button"
                onClick={onOpenNewTenant}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium transition cursor-pointer"
                title="Cadastrar nova unidade / clínica no SaaS"
              >
                <PlusCircle className="w-3.5 h-3.5 text-teal-600" />
                <span>Nova Clínica</span>
              </button>
            )}

            {onOpenFranchise && (
              <button
                type="button"
                onClick={onOpenFranchise}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium transition cursor-pointer"
                title="Painel Corporativo Multi-unidades / Franquias"
              >
                <Building className="w-3.5 h-3.5 text-teal-600" />
                <span>Redes</span>
              </button>
            )}

            {onOpenEhr && (
              <button
                type="button"
                onClick={onOpenEhr}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium transition cursor-pointer"
                title="Sincronizar Prontuários (Clinicorp, Simples Dental)"
              >
                <Database className="w-3.5 h-3.5 text-teal-600" />
                <span>Prontuários</span>
              </button>
            )}

            {onOpenWhatsAppAutomations && (
              <button
                type="button"
                onClick={onOpenWhatsAppAutomations}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-semibold rounded-xl shadow-2xs transition cursor-pointer"
                title="Configurar disparos automáticos no WhatsApp"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp</span>
              </button>
            )}

            <button
              onClick={onOpenDossier}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-bold rounded-xl shadow-sm shadow-teal-800/20 transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Dossiê VISA</span>
            </button>

            {/* Perfil do Usuário com alternância rápida */}
            <div
              onClick={onSwitchUser}
              className="flex items-center space-x-2 pl-3 border-l border-[#E2ECE6] text-xs cursor-pointer group"
              title="Clique para alternar perfil de operador (RT vs ASB)"
            >
              <div className="w-8 h-8 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800 font-bold group-hover:border-teal-500 transition shadow-2xs">
                {userInitials}
              </div>
              <div className="text-left">
                <div className="font-bold text-slate-800 group-hover:text-teal-700 transition flex items-center space-x-1">
                  <span>{currentUser?.name || 'Usuário'}</span>
                  <span className="text-[10px] text-slate-400 font-normal">(Trocar)</span>
                </div>
                <div className="text-[11px] text-teal-700 flex items-center space-x-1 font-medium">
                  <UserCheck className="w-3 h-3 text-teal-600" />
                  <span>
                    {currentUser?.roleName || 'Colaborador'}{' '}
                    {currentUser?.croNumber ? `(${currentUser.croState} ${currentUser.croNumber})` : ''}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Abas de Navegação com Barra de Rolagem Horizontal */}
        <div className="relative group/nav border-t border-[#E2ECE6]">
          {/* Botão de Rolagem Esquerda (Computador) */}
          <button
            type="button"
            onClick={() => scrollNav('left')}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-20 w-7 h-7 items-center justify-center bg-white/95 hover:bg-slate-50 text-teal-700 border border-[#E2ECE6] rounded-full shadow-md backdrop-blur-sm transition opacity-0 group-hover/nav:opacity-100 cursor-pointer"
            title="Rolar abas para a esquerda"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div
            ref={scrollContainerRef}
            onWheel={(e) => {
              if (e.deltaY !== 0 && typeof window !== 'undefined' && window.innerWidth >= 768) {
                e.currentTarget.scrollLeft += e.deltaY;
              }
            }}
            className="flex space-x-1 overflow-x-auto pt-2 pb-2 px-1 desktop-horizontal-scrollbar scroll-smooth"
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 text-xs font-medium rounded-xl transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-teal-50 text-teal-900 border border-teal-300 font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-teal-700' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Botão de Rolagem Direita (Computador) */}
          <button
            type="button"
            onClick={() => scrollNav('right')}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-20 w-7 h-7 items-center justify-center bg-white/95 hover:bg-slate-50 text-teal-700 border border-[#E2ECE6] rounded-full shadow-md backdrop-blur-sm transition opacity-0 group-hover/nav:opacity-100 cursor-pointer"
            title="Rolar abas para a direita"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};