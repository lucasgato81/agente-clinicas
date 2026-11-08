'use client';

import React from 'react';
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
} from 'lucide-react';
import { ClinicTenant, UserProfile } from '@/lib/types';
import { CURRENT_CLINIC, CURRENT_USER } from '@/lib/mockData';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenDossier: () => void;
  clinic?: ClinicTenant;
  currentUser?: UserProfile;
  onSwitchUser?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenDossier,
  clinic = CURRENT_CLINIC,
  currentUser = CURRENT_USER,
  onSwitchUser,
}) => {
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
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Marca */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent">
                  OdontoShield
                </span>
                <span className="text-[10px] uppercase font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800/80 px-1.5 py-0.5 rounded">
                  RDC 1002/2025
                </span>
              </div>
              <div className="flex items-center text-xs text-slate-400 space-x-1">
                <Building2 className="w-3 h-3 text-slate-500" />
                <span className="truncate max-w-[200px]">{clinic?.name || 'Clínica Odontológica'}</span>
              </div>
            </div>
          </div>

          {/* Botão de Dossiê Fiscal VISA & Usuário Ativo */}
          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={onOpenDossier}
              className="flex items-center space-x-2 px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold rounded-lg shadow-sm shadow-emerald-900/50 transition-all border border-emerald-400/30"
            >
              <FileText className="w-4 h-4" />
              <span>Dossiê Fiscal VISA (1 Clique)</span>
            </button>

            {/* Perfil do Usuário com alternância rápida */}
            <div
              onClick={onSwitchUser}
              className="flex items-center space-x-2 pl-3 border-l border-slate-800 text-xs cursor-pointer group"
              title="Clique para alternar perfil de teste (RT vs ASB)"
            >
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 font-bold group-hover:border-cyan-500 transition">
                {userInitials}
              </div>
              <div className="text-left">
                <div className="font-semibold text-slate-200 group-hover:text-cyan-300 transition flex items-center space-x-1">
                  <span>{currentUser?.name || 'Usuário'}</span>
                  <span className="text-[10px] text-slate-500 font-normal">(Alternar)</span>
                </div>
                <div className="text-[11px] text-cyan-400 flex items-center space-x-1">
                  <UserCheck className="w-3 h-3" />
                  <span>
                    {currentUser?.roleName || 'Colaborador'}{' '}
                    {currentUser?.croNumber ? `(${currentUser.croState} ${currentUser.croNumber})` : ''}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Abas de Navegação */}
        <div className="flex space-x-1 overflow-x-auto py-1 scrollbar-none border-t border-slate-800/60">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
