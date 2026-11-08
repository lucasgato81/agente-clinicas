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
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                <span>Núcleo de Segurança do Paciente (NSP) & Saúde Ocupacional</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                  RDC 1002/2025 & RDC 36/2013
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Gestão de riscos, acidentes com perfurocortantes (equipe), eventos adversos (pacientes), ciclo PDCA e integração Notivisa.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onOpenNewIncident}
          className="flex items-center space-x-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs shadow-md transition cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Registrar Incidente (Equipe / Paciente)</span>
        </button>
      </div>

      {/* Cartão de Atalho para Rastreabilidade */}
      <div className="bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-900 border border-cyan-800/40 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-100 flex items-center space-x-1.5">
              <span>Procurando a Rastreabilidade de Instrumentais no Prontuário?</span>
            </h4>
            <p className="text-xs text-slate-400">
              Acesse a nova aba <strong>Rastreabilidade</strong> para consultar qual lote foi utilizado em cada paciente ou emitir certidões periciais.
            </p>
          </div>
        </div>

        <button
          onClick={onNavigateToTraceability}
          className="px-3.5 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer shrink-0"
        >
          <span>Ir para Aba Rastreabilidade</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Métricas do NSP */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400 font-medium">Acidentes com a Equipe (ASB/TSB/Dentistas)</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-bold text-amber-400">{teamIncidentsCount}</span>
            <span className="text-[11px] text-slate-400">perfurocortantes / EPI</span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            Monitoramento profilático (PEP/CAT)
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400 font-medium">Eventos Adversos com Pacientes</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-bold text-cyan-300">{patientIncidentsCount}</span>
            <span className="text-[11px] text-slate-400">ocorrências clínicas</span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            Fratura de ponta ativa, cortes, alergias
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400 font-medium">Falhas de Processo / CME</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-bold text-indigo-300">{processIncidentsCount}</span>
            <span className="text-[11px] text-slate-400">ocorrências internas</span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            Ciclo PDCA e contenção de risco
          </span>
        </div>
      </div>

      {/* Barra de Filtros por Público e Busca */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3.5 rounded-xl">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por descrição, pessoa ou conduta..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center space-x-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setIncidentAudienceFilter('ALL')}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition ${
              incidentAudienceFilter === 'ALL'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Todos ({incidents.length})
          </button>
          <button
            onClick={() => setIncidentAudienceFilter('TEAM_MEMBER')}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition ${
              incidentAudienceFilter === 'TEAM_MEMBER'
                ? 'bg-amber-950 text-amber-300 border border-amber-800/60'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Equipe ({teamIncidentsCount})
          </button>
          <button
            onClick={() => setIncidentAudienceFilter('PATIENT')}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition ${
              incidentAudienceFilter === 'PATIENT'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/60'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Pacientes ({patientIncidentsCount})
          </button>
          <button
            onClick={() => setIncidentAudienceFilter('ENVIRONMENT_PROCESS')}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition ${
              incidentAudienceFilter === 'ENVIRONMENT_PROCESS'
                ? 'bg-indigo-950 text-indigo-300 border border-indigo-800/60'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Processos ({processIncidentsCount})
          </button>
        </div>
      </div>

      {/* Lista de Incidentes */}
      {filteredIncidents.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
          <h3 className="font-bold text-slate-200 text-sm">
            Nenhum incidente ou evento adverso registrado neste filtro
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Utilize este canal para registrar qualquer ocorrência com colaboradores (perfurocortantes na lavagem, respingos) ou pacientes (fratura de ponta ativa de broca/cureta).
          </p>
          <button
            onClick={onOpenNewIncident}
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition cursor-pointer"
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
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 hover:border-slate-700 transition"
              >
                {/* Cabeçalho do Card */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2.5">
                    {isTeam ? (
                      <span className="p-2 rounded-xl bg-amber-950/60 border border-amber-800 text-amber-300">
                        <Users className="w-4 h-4" />
                      </span>
                    ) : isPatient ? (
                      <span className="p-2 rounded-xl bg-cyan-950/60 border border-cyan-800 text-cyan-300">
                        <User className="w-4 h-4" />
                      </span>
                    ) : (
                      <span className="p-2 rounded-xl bg-indigo-950/60 border border-indigo-800 text-indigo-300">
                        <Settings className="w-4 h-4" />
                      </span>
                    )}

                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-100 text-sm">
                          {inc.affectedPersonName}
                        </span>
                        {inc.affectedPersonRole && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                            {inc.affectedPersonRole}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400">
                        Categoria: <strong className="text-slate-300">{inc.category}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border ${
                        inc.severity === 'MILD'
                          ? 'bg-slate-800 text-slate-300 border-slate-700'
                          : inc.severity === 'MODERATE'
                          ? 'bg-amber-950 text-amber-300 border-amber-800'
                          : 'bg-red-950 text-red-300 border-red-800'
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
                  <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Descrição do Fato
                    </span>
                    <p className="text-slate-200 leading-relaxed">{inc.description}</p>
                  </div>

                  <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 space-y-1">
                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                      Conduta Clínica / Profilática Imediata
                    </span>
                    <p className="text-slate-200 leading-relaxed">
                      {inc.conductTaken || 'Conduta padrão de primeiros socorros aplicada.'}
                    </p>
                  </div>
                </div>

                {/* Ação Preventiva (Ciclo PDCA) & Prazos */}
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                      Ação Corretiva / Preventiva (Ciclo PDCA)
                    </span>
                    <p className="text-slate-300">{inc.preventiveAction}</p>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 block">Reavaliação de Eficácia</span>
                      <span className="font-semibold text-slate-200">{inc.reevaluationDate}</span>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        inc.reevaluationStatus === 'CONCLUDED'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                          : 'bg-amber-950 text-amber-300 border-amber-800'
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
