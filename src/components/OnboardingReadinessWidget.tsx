'use client';

import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
  Building2,
  Stethoscope,
  Users,
  Sparkles,
  FileText,
} from 'lucide-react';
import { ClinicTenant, TeamMember, EquipmentItem, PopItem } from '@/lib/types';

interface OnboardingReadinessWidgetProps {
  clinic: ClinicTenant;
  teamMembers: TeamMember[];
  equipments: EquipmentItem[];
  pops: PopItem[];
  instrumentsCount?: number;
  onNavigateTab: (tabId: string) => void;
  isNewClinicMode: boolean;
  onToggleClinicMode: () => void;
}

export const OnboardingReadinessWidget: React.FC<OnboardingReadinessWidgetProps> = ({
  clinic,
  teamMembers,
  equipments,
  pops,
  instrumentsCount = 0,
  onNavigateTab,
  isNewClinicMode,
  onToggleClinicMode,
}) => {
  // Verificação dos campos obrigatórios da RDC 1002/2025
  const hasLegalName = Boolean(clinic.legalName?.trim());
  const hasCnpj = Boolean(clinic.cnpj?.trim());
  const hasSanitaryLicense = Boolean(clinic.sanitaryLicense?.trim() && clinic.licenseExpiry);
  const hasCroPj = Boolean(clinic.croRegistration?.trim());
  const hasRt = Boolean(clinic.technicalResponsibleName?.trim() && clinic.technicalResponsibleCro?.trim());
  const hasAsbOrTsb = teamMembers.some((m) => m.role === 'DENTAL_ASSISTANT');
  const hasAutoclave = equipments.some((e) => e.category === 'AUTOCLAVE');
  const hasSignedPop = pops.some((p) => p.signaturesCount > 0);
  const hasInstruments = instrumentsCount > 0;

  const criteria = [
    {
      id: 'legalName',
      title: 'Razão Social e Nome da Clínica',
      description: 'Identificação jurídica oficial do estabelecimento odontológico.',
      completed: hasLegalName,
      tab: 'team',
      lawRef: 'RDC 1002/2025 Art. 4º',
    },
    {
      id: 'cnpj',
      title: 'CNPJ Válido da Pessoa Jurídica',
      description: 'Cadastro Nacional da Pessoa Jurídica no Ministério da Fazenda.',
      completed: hasCnpj,
      tab: 'team',
      lawRef: 'Exigência Fiscal e Sanitária',
    },
    {
      id: 'croPj',
      title: 'Inscrição no CRO da Pessoa Jurídica (CRO-PJ)',
      description: 'Registro do consultório ou clínica no Conselho Regional de Odontologia.',
      completed: hasCroPj,
      tab: 'team',
      lawRef: 'Lei 4.324/64 & RDC 1002',
    },
    {
      id: 'sanitaryLicense',
      title: 'Número e Validade do Alvará Sanitário (VISA)',
      description: 'Licença sanitária municipal/estadual de funcionamento.',
      completed: hasSanitaryLicense,
      tab: 'team',
      lawRef: 'RDC 1002/2025 Art. 6º',
    },
    {
      id: 'rt',
      title: 'Responsável Técnico (Cirurgião-Dentista com CRO)',
      description: 'Cirurgião-dentista investido formalmente na responsabilidade técnica.',
      completed: hasRt,
      tab: 'team',
      lawRef: 'RDC 1002/2025 Art. 8º',
    },
    {
      id: 'asbTsb',
      title: 'Cadastro de ao menos 1 ASB ou TSB',
      description: 'Profissional auxiliar habilitado para o processamento de artigos e CME.',
      completed: hasAsbOrTsb,
      tab: 'team',
      lawRef: 'RDC 1002/2025 Art. 21',
    },
    {
      id: 'instruments',
      title: 'Cadastro de Instrumentais & Kits Padronizados',
      description: 'Rastreabilidade de artigos críticos e controle de vida útil / ciclos de autoclave.',
      completed: hasInstruments,
      tab: 'instruments',
      lawRef: 'RDC 1002 Art. 21 e RDC 15/2012 Art. 11',
    },
    {
      id: 'autoclave',
      title: 'Cadastro de Autoclave e Validação Térmica',
      description: 'Equipamento crítico para esterilização a vapor saturado sob pressão.',
      completed: hasAutoclave,
      tab: 'equipments',
      lawRef: 'RDC 1002/2025 Art. 38',
    },
    {
      id: 'pops',
      title: 'Homologação e Ciência dos 8 POPs Obrigatórios',
      description: 'Ateste digital do RT e equipe nos procedimentos padrão.',
      completed: hasSignedPop,
      tab: 'pops',
      lawRef: 'RDC 1002/2025 Art. 16',
    },
  ];

  const completedCount = criteria.filter((c) => c.completed).length;
  const totalCount = criteria.length;
  const percentage = Math.round((completedCount / totalCount) * 100);
  const pendingCriteria = criteria.filter((c) => !c.completed);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      {/* Barra de Troca de Modo (Novo Usuário vs Clínica Completa) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-xs font-bold text-slate-200">
            Ambiente Atual: {isNewClinicMode ? 'Novo Usuário (Primeiro Acesso)' : 'Clínica Demo Completa'}
          </span>
        </div>

        <button
          onClick={onToggleClinicMode}
          className="px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-lg text-xs font-semibold transition"
        >
          {isNewClinicMode
            ? 'Carregar Dados da Clínica Demo (Ver 100% Preenchido)'
            : 'Simular Novo Usuário (Ver Campos Faltantes)'}
        </button>
      </div>

      {/* Cabeçalho da Auditoria de Conformidade */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            {percentage === 100 ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <ShieldAlert className="w-5 h-5 text-amber-400" />
            )}
            <h3 className="font-bold text-sm text-slate-100">
              Auditoria de Prontidão Regulatória (RDC 1002/2025)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {percentage === 100
              ? 'Todos os requisitos essenciais de funcionamento sanitário foram preenchidos com sucesso!'
              : `Constam ${pendingCriteria.length} campos obrigatórios pendentes de preenchimento para a clínica estar regular perante a Vigilância Sanitária.`}
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <div className="text-right">
            <span
              className={`text-2xl font-black ${
                percentage === 100
                  ? 'text-emerald-400'
                  : percentage >= 50
                  ? 'text-cyan-400'
                  : 'text-amber-400'
              }`}
            >
              {percentage}%
            </span>
            <span className="text-[10px] text-slate-400 block uppercase font-bold">
              {completedCount} de {totalCount} Concluídos
            </span>
          </div>
        </div>
      </div>

      {/* Barra de Progresso Visual */}
      <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
        <div
          className={`h-full transition-all duration-500 rounded-full ${
            percentage === 100
              ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
              : percentage >= 50
              ? 'bg-gradient-to-r from-cyan-500 to-blue-500'
              : 'bg-gradient-to-r from-amber-500 to-orange-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Lista de Campos Faltantes (Quando pendente) */}
      {pendingCriteria.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-300 flex items-center space-x-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Campos Obrigatórios que Faltam Preencher ({pendingCriteria.length}):</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {pendingCriteria.map((item) => (
              <div
                key={item.id}
                className="bg-slate-950/80 border border-amber-900/40 hover:border-amber-700/60 p-3 rounded-xl flex items-start justify-between gap-2 transition"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                    <span className="font-bold text-slate-200 text-xs">{item.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight">{item.description}</p>
                  <span className="text-[9px] font-mono text-cyan-400 block">{item.lawRef}</span>
                </div>

                <button
                  onClick={() => onNavigateTab(item.tab)}
                  className="px-2.5 py-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-[10px] shrink-0 transition flex items-center space-x-1 shadow"
                >
                  <span>Preencher</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Indicador de Sucesso quando 100% */}
      {percentage === 100 && (
        <div className="bg-emerald-950/40 border border-emerald-800/60 p-3.5 rounded-xl flex items-center justify-between text-xs text-emerald-200">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>
              Parabéns! Sua clínica está 100% pronta para fiscalizações sanitárias e emissão do Dossiê RDC 1002.
            </span>
          </div>
          <button
            onClick={() => onNavigateTab('cme')}
            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold text-xs transition shrink-0"
          >
            Iniciar Operação da CME
          </button>
        </div>
      )}
    </div>
  );
};
