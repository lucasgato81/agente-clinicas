'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  Users,
  User,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  QrCode,
  Calendar,
  ShieldAlert,
  ArrowRight,
  ShieldCheck,
  Settings,
} from 'lucide-react';
import { SafetyIncidentItem, TeamMember } from '@/lib/types';

interface PatientSafetyCenterProps {
  incidents: SafetyIncidentItem[];
  teamMembers: TeamMember[];
  onOpenNewIncident: () => void;
  onNavigateToTraceability: () => void;
}

export const PatientSafetyCenter: React.FC<PatientSafetyCenterProps> = ({
  incidents,
  teamMembers,
  onOpenNewIncident,
  onNavigateToTraceability,
}) => {
  const [incidentAudienceFilter, setIncidentAudienceFilter] = useState<
    'ALL' | 'TEAM_MEMBER' | 'PATIENT' | 'ENVIRONMENT_PROCESS'
  >('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Filtragem de Incidentes por público e busca
  const filteredIncidents = incidents.filter((inc) => {
    const matchesAudience =
      incidentAudienceFilter === 'ALL' || inc.affectedType === incidentAudienceFilter;

    const matchesSearch =
      inc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.affectedPersonName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inc.conductTaken && inc.conductTaken.toLowerCase().includes(searchTerm.toLowerCase())) ||
      inc.preventiveAction.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesAudience && matchesSearch;
  });

  const teamIncidentsCount = incidents.filter((i) => i.affectedType === 'TEAM_MEMBER').length;
  const patientIncidentsCount = incidents.filter((i) => i.affectedType === 'PATIENT').length;
  const processIncidentsCount = incidents.filter((i) => i.affectedType === 'ENVIRONMENT_PROCESS').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Banner Principal do NSP */}
      <div className="bg-white border border-[#E2ECE6] p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-teal-50 border border-teal-200 text-teal-700">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
                <span>Núcleo de Segurança do Paciente (NSP) & Saúde Ocupacional</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                  RDC 1002/2025 & RDC 36/2013
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Gestão de riscos, acidentes com perfurocortantes (equipe), eventos adversos (pacientes), ciclo PDCA e integração Notivisa.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onOpenNewIncident}
          className="flex items-center space-x-1.5 px-4 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold rounded-xl text-xs shadow-sm transition cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Registrar Incidente (Equipe / Paciente)</span>
        </button>
      </div>

      {/* Cartão de Atalho para Rastreabilidade */}
      <div className="bg-teal-50/50 border border-teal-200 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-teal-100 text-teal-800 border border-teal-200 shrink-0">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
              <span>Procurando a Rastreabilidade de Instrumentais no Prontuário?</span>
            </h4>
            <p className="text-xs text-slate-600">
              Acesse a nova aba <strong>Rastreabilidade</strong> para consultar qual lote foi utilizado em cada paciente ou emitir certidões periciais.
            </p>
          </div>
        </div>

        <button
          onClick={onNavigateToTraceability}
          className="px-3.5 py-1.5 bg-white hover:bg-teal-50 text-teal-800 border border-teal-200 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer shrink-0 shadow-2xs"
        >
          <span>Ir para Aba Rastreabilidade</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Métricas do NSP */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#E2ECE6] p-4 rounded-xl shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Acidentes com a Equipe (ASB/TSB/Dentistas)</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-bold text-amber-600">{teamIncidentsCount}</span>
            <span className="text-[11px] text-slate-500">perfurocortantes / EPI</span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            Monitoramento profilático (PEP/CAT)
          </span>
        </div>

        <div className="bg-white border border-[#E2ECE6] p-4 rounded-xl shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Eventos Adversos com Pacientes</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-bold text-teal-700">{patientIncidentsCount}</span>
            <span className="text-[11px] text-slate-500">ocorrências clínicas</span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            Fratura de ponta ativa, cortes, alergias
          </span>
        </div>

        <div className="bg-white border border-[#E2ECE6] p-4 rounded-xl shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Falhas de Processo / CME</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-bold text-teal-800">{processIncidentsCount}</span>
            <span className="text-[11px] text-slate-500">ocorrências internas</span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            Ciclo PDCA e contenção de risco
          </span>
        </div>
      </div>

      {/* Barra de Filtros por Público e Busca */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-[#E2ECE6] p-3.5 rounded-xl shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por descrição, pessoa ou conduta..."
            className="w-full bg-white border border-[#E2ECE6] rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-600"
          />
        </div>

        <div className="flex items-center space-x-1.5 bg-[#F8FAF9] p-1 rounded-lg border border-[#E2ECE6] text-xs">
          <button
            onClick={() => setIncidentAudienceFilter('ALL')}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition ${
              incidentAudienceFilter === 'ALL'
                ? 'bg-white text-slate-900 border border-[#E2ECE6] shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Todos ({incidents.length})
          </button>
          <button
            onClick={() => setIncidentAudienceFilter('TEAM_MEMBER')}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition ${
              incidentAudienceFilter === 'TEAM_MEMBER'
                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Equipe ({teamIncidentsCount})
          </button>
          <button
            onClick={() => setIncidentAudienceFilter('PATIENT')}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition ${
              incidentAudienceFilter === 'PATIENT'
                ? 'bg-teal-50 text-teal-800 border border-teal-200'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Pacientes ({patientIncidentsCount})
          </button>
          <button
            onClick={() => setIncidentAudienceFilter('ENVIRONMENT_PROCESS')}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition ${
              incidentAudienceFilter === 'ENVIRONMENT_PROCESS'
                ? 'bg-teal-50 text-teal-800 border border-teal-200'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Processos ({processIncidentsCount})
          </button>
        </div>
      </div>

      {/* Lista de Incidentes */}
      {filteredIncidents.length === 0 ? (
        <div className="bg-white border border-[#E2ECE6] rounded-2xl p-12 text-center space-y-3 shadow-xs">
          <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
          <h3 className="font-bold text-slate-800 text-sm">
            Nenhum incidente ou evento adverso registrado neste filtro
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Utilize este canal para registrar qualquer ocorrência com colaboradores (perfurocortantes na lavagem, respingos) ou pacientes (fratura de ponta ativa de broca/cureta).
          </p>
          <button
            onClick={onOpenNewIncident}
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>+ Registrar Incidente</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredIncidents.map((inc) => {
            const isTeam = inc.affectedType === 'TEAM_MEMBER';
            const isPatient = inc.affectedType === 'PATIENT';

            return (
              <div
                key={inc.id}
                className="bg-white border border-[#E2ECE6] rounded-2xl p-5 space-y-3 hover:border-teal-300 shadow-xs transition"
              >
                {/* Cabeçalho do Card */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2ECE6] pb-3">
                  <div className="flex items-center space-x-2.5">
                    {isTeam ? (
                      <span className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-700">
                        <Users className="w-4 h-4" />
                      </span>
                    ) : isPatient ? (
                      <span className="p-2 rounded-xl bg-teal-50 border border-teal-200 text-teal-700">
                        <User className="w-4 h-4" />
                      </span>
                    ) : (
                      <span className="p-2 rounded-xl bg-teal-50 border border-teal-200 text-teal-800">
                        <Settings className="w-4 h-4" />
                      </span>
                    )}

                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900 text-sm">
                          {inc.affectedPersonName}
                        </span>
                        {inc.affectedPersonRole && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#F8FAF9] text-slate-700 border border-[#E2ECE6]">
                            {inc.affectedPersonRole}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500">
                        Categoria: <strong className="text-slate-700">{inc.category}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border ${
                        inc.severity === 'MILD'
                          ? 'bg-[#F8FAF9] text-slate-700 border-[#E2ECE6]'
                          : inc.severity === 'MODERATE'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-rose-50 text-rose-800 border-rose-200'
                      }`}
                    >
                      {inc.severity === 'MILD'
                        ? 'LEVE (Quase-Erro)'
                        : inc.severity === 'MODERATE'
                        ? 'MODERADO (Reversível)'
                        : 'GRAVE (Dano)'}
                    </span>

                    <span className="text-[10px] font-mono text-slate-500">
                      {inc.reportedAt}
                    </span>
                  </div>
                </div>

                {/* Descrição e Conduta Imediata */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="bg-[#F8FAF9] p-3 rounded-xl border border-[#E2ECE6] space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Descrição do Fato
                    </span>
                    <p className="text-slate-800 leading-relaxed">{inc.description}</p>
                  </div>

                  <div className="bg-[#F8FAF9] p-3 rounded-xl border border-[#E2ECE6] space-y-1">
                    <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider block">
                      Conduta Clínica / Profilática Imediata
                    </span>
                    <p className="text-slate-800 leading-relaxed">
                      {inc.conductTaken || 'Conduta padrão de primeiros socorros aplicada.'}
                    </p>
                  </div>
                </div>

                {/* Ação Preventiva (Ciclo PDCA) & Prazos */}
                <div className="bg-[#F8FAF9] p-3 rounded-xl border border-[#E2ECE6] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                      Ação Corretiva / Preventiva (Ciclo PDCA)
                    </span>
                    <p className="text-slate-700">{inc.preventiveAction}</p>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 block">Reavaliação de Eficácia</span>
                      <span className="font-semibold text-slate-800">{inc.reevaluationDate}</span>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        inc.reevaluationStatus === 'CONCLUDED'
                          ? 'bg-[#DCFCE7] text-emerald-800 border-emerald-300'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      {inc.reevaluationStatus === 'CONCLUDED' ? 'CONCLUÍDO' : 'PENDENTE'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
