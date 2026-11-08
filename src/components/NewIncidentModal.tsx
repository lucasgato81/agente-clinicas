'use client';

import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  ShieldAlert,
  ExternalLink,
  CheckCircle2,
  Calendar,
  User,
  Users,
  Settings,
  HeartPulse,
  Activity,
  FileText,
} from 'lucide-react';
import { IncidentSeverity, IncidentAffectedType, SafetyIncidentItem, TeamMember } from '@/lib/types';

interface NewIncidentModalProps {
  teamMembers?: TeamMember[];
  onClose: () => void;
  onIncidentCreated: (incident: SafetyIncidentItem) => void;
}

export const NewIncidentModal: React.FC<NewIncidentModalProps> = ({
  teamMembers = [],
  onClose,
  onIncidentCreated,
}) => {
  const [affectedType, setAffectedType] = useState<IncidentAffectedType>('TEAM_MEMBER');
  const [affectedPersonName, setAffectedPersonName] = useState<string>('');
  const [affectedPersonRole, setAffectedPersonRole] = useState<string>('Auxiliar em Saúde Bucal (ASB)');

  const [category, setCategory] = useState<string>('Acidente Perfurocortante com Risco Biológico');
  const [severity, setSeverity] = useState<IncidentSeverity>('MILD');
  const [description, setDescription] = useState('');
  const [conductTaken, setConductTaken] = useState('');
  const [preventiveAction, setPreventiveAction] = useState('');
  const [notivisaProtocol, setNotivisaProtocol] = useState('');

  // Sugestão de reavaliação em 30 dias (Ciclo PDCA)
  const defaultReeval = new Date();
  defaultReeval.setDate(defaultReeval.getDate() + 30);
  const [reevaluationDate, setReevaluationDate] = useState(
    defaultReeval.toISOString().slice(0, 10)
  );

  // Categorias contextuais por tipo de afetado
  const teamCategories = [
    'Acidente Perfurocortante com Risco Biológico (agulha, lâmina, broca, cureta)',
    'Respingo em Mucosa / Olhos sem Proteção (sangue, saliva, secreção)',
    'Queimadura Térmica na Autoclave ou Seladora',
    'Contato ou Inalação de Substância Química (glutaraldeído, ácido, hipoclorito)',
    'Queda, Trauma Físico ou Lesão Ergonômica na Clínica',
    'Outro Incidente Ocupacional com Colaborador',
  ];

  const patientCategories = [
    'Fratura de Ponta Ativa de Instrumental (lima, broca, cureta em atendimento)',
    'Lesão / Corte Acidental em Mucosa Bucal, Língua ou Lábio',
    'Queimadura Térmica por Ponta de Alta Rotação ou Fotopolimerizador',
    'Reação Adversa / Alérgica Aguda (anestésico local, látex, medicação)',
    'Deglutição ou Aspiração Acidental de Fragmento / Corpo Estranho',
    'Infecção de Sítio Cirúrgico / Complicação Pós-Operatória Imediata',
    'Queda ou Mal-Estar Súbito na Cadeira Odontológica',
    'Outro Evento Adverso com Paciente',
  ];

  const processCategories = [
    'Falha de Esterilização / Monitoramento de Lote (Classe 5 ou Biológico reprovado)',
    'Violação / Rasgo de Barreira Estéril em Armazenamento',
    'Queda Súbita de Pressão do Compressor durante Cirurgia',
    'Falha de Autoclave durante Ciclo sem Alarme Sonoro',
    'Outra Falha de Processo / Ambiente',
  ];

  // Alternar tipo de envolvido
  const handleSelectType = (type: IncidentAffectedType) => {
    setAffectedType(type);
    if (type === 'TEAM_MEMBER') {
      setCategory(teamCategories[0]);
      if (teamMembers.length > 0) {
        setAffectedPersonName(teamMembers[0].name);
        setAffectedPersonRole(teamMembers[0].roleName);
      } else {
        setAffectedPersonName('');
        setAffectedPersonRole('Auxiliar em Saúde Bucal (ASB)');
      }
    } else if (type === 'PATIENT') {
      setCategory(patientCategories[0]);
      setAffectedPersonName('');
      setAffectedPersonRole('Paciente');
    } else {
      setCategory(processCategories[0]);
      setAffectedPersonName('Central de Material e Esterilização (CME)');
      setAffectedPersonRole('Processo / Equipamento');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !preventiveAction.trim()) return;

    if (!affectedPersonName.trim()) {
      alert('Por favor, informe o nome da pessoa ou setor envolvido.');
      return;
    }

    if (severity === 'SEVERE_HARM' && !notivisaProtocol.trim()) {
      alert('Para incidentes classificados como Grave com Dano, o protocolo do Notivisa é obrigatório conforme a RDC 1002/2025.');
      return;
    }

    const newIncident: SafetyIncidentItem = {
      id: `inc-${Date.now()}`,
      reportedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      category,
      severity,
      affectedType,
      affectedPersonName: affectedPersonName.trim(),
      affectedPersonRole: affectedPersonRole.trim() || undefined,
      description: description.trim(),
      conductTaken: conductTaken.trim() || undefined,
      preventiveAction: preventiveAction.trim(),
      reevaluationDate,
      reevaluationStatus: 'PENDING',
      notivisaNotified: severity === 'SEVERE_HARM' || Boolean(notivisaProtocol.trim()),
      notivisaProtocol: notivisaProtocol.trim() || undefined,
    };

    onIncidentCreated(newIncident);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 shrink-0">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-100 text-sm">
                Registrar Incidente no Núcleo de Segurança (NSP)
              </h3>
              <p className="text-[11px] text-slate-400">
                RDC 1002/2025 Anvisa • Gestão de Risco para Pacientes & Equipe do Consultório
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs overflow-y-auto flex-1">
          {/* SELETOR DO PÚBLICO AFETADO / ENVOLVIDO */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-200 block">
              Quem foi envolvido / afetado no incidente? *
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleSelectType('TEAM_MEMBER')}
                className={`p-2.5 rounded-xl border text-left transition flex items-center space-x-2 ${
                  affectedType === 'TEAM_MEMBER'
                    ? 'bg-amber-950/40 border-amber-500/70 text-amber-300 ring-1 ring-amber-500/50'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Users className="w-4 h-4 shrink-0 text-amber-400" />
                <div>
                  <span className="font-bold block text-xs">Membro da Equipe</span>
                  <span className="text-[10px] text-slate-400 block">ASB, TSB, Dentista</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectType('PATIENT')}
                className={`p-2.5 rounded-xl border text-left transition flex items-center space-x-2 ${
                  affectedType === 'PATIENT'
                    ? 'bg-cyan-950/40 border-cyan-500/70 text-cyan-300 ring-1 ring-cyan-500/50'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <User className="w-4 h-4 shrink-0 text-cyan-400" />
                <div>
                  <span className="font-bold block text-xs">Paciente</span>
                  <span className="text-[10px] text-slate-400 block">Durante atendimento</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectType('ENVIRONMENT_PROCESS')}
                className={`p-2.5 rounded-xl border text-left transition flex items-center space-x-2 ${
                  affectedType === 'ENVIRONMENT_PROCESS'
                    ? 'bg-indigo-950/40 border-indigo-500/70 text-indigo-300 ring-1 ring-indigo-500/50'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Settings className="w-4 h-4 shrink-0 text-indigo-400" />
                <div>
                  <span className="font-bold block text-xs">CME / Processo</span>
                  <span className="text-[10px] text-slate-400 block">Autoclave, lote, falha</span>
                </div>
              </button>
            </div>
          </div>

          {/* DADOS DA PESSOA ENVOLVIDA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            {affectedType === 'TEAM_MEMBER' && (
              <>
                <div>
                  <label className="text-[11px] font-medium text-slate-300 block mb-1">
                    Colaborador da Equipe Envolvido *
                  </label>
                  {teamMembers.length > 0 ? (
                    <select
                      value={affectedPersonName}
                      onChange={(e) => {
                        const selected = teamMembers.find((m) => m.name === e.target.value);
                        setAffectedPersonName(e.target.value);
                        if (selected) setAffectedPersonRole(selected.roleName);
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                    >
                      {teamMembers.map((m) => (
                        <option key={m.id} value={m.name}>
                          {m.name} ({m.roleName})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      required
                      placeholder="Nome do colaborador"
                      value={affectedPersonName}
                      onChange={(e) => setAffectedPersonName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                    />
                  )}
                </div>
                <div>
                  <label className="text-[11px] font-medium text-slate-300 block mb-1">
                    Função / Cargo do Profissional
                  </label>
                  <input
                    type="text"
                    value={affectedPersonRole}
                    onChange={(e) => setAffectedPersonRole(e.target.value)}
                    placeholder="Ex: ASB, TSB, Cirurgião-Dentista"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </>
            )}

            {affectedType === 'PATIENT' && (
              <>
                <div>
                  <label className="text-[11px] font-medium text-slate-300 block mb-1">
                    Nome Completo do Paciente *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: João da Silva Santos"
                    value={affectedPersonName}
                    onChange={(e) => setAffectedPersonName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-slate-300 block mb-1">
                    Número do Prontuário / CPF
                  </label>
                  <input
                    type="text"
                    value={affectedPersonRole}
                    onChange={(e) => setAffectedPersonRole(e.target.value)}
                    placeholder="Ex: Prontuário #4820 ou CPF"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </>
            )}

            {affectedType === 'ENVIRONMENT_PROCESS' && (
              <div className="sm:col-span-2">
                <label className="text-[11px] font-medium text-slate-300 block mb-1">
                  Setor / Equipamento Envolvido *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Autoclave Cristófoli 21L (CME) ou Sala de Limpeza"
                  value={affectedPersonName}
                  onChange={(e) => setAffectedPersonName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>
            )}
          </div>

          {/* Categoria do Incidente (Contextual) */}
          <div>
            <label className="text-[11px] font-medium text-slate-300 block mb-1">
              Categoria do Incidente *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
            >
              {affectedType === 'TEAM_MEMBER' &&
                teamCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              {affectedType === 'PATIENT' &&
                patientCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              {affectedType === 'ENVIRONMENT_PROCESS' &&
                processCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
            </select>
          </div>

          {/* Classificação de Severidade */}
          <div>
            <label className="text-[11px] font-medium text-slate-300 block mb-1">
              Classificação de Severidade (Matriz de Risco RDC 1002) *
            </label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value as IncidentSeverity)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 font-semibold"
            >
              <option value="MILD">Leve (Quase-Erro / Near Miss sem Dano Físico)</option>
              <option value="MODERATE">Moderado (Dano Reversível / Interrupção de Procedimento sem Sequelas)</option>
              <option value="SEVERE_HARM">Grave com Dano (Exige Notificação Anvisa/Notivisa e Tratamento Especial)</option>
            </select>
          </div>

          {/* Alerta de Obrigatoriedade Notivisa */}
          {severity === 'SEVERE_HARM' && (
            <div className="bg-red-950/80 border border-red-700 p-4 rounded-xl space-y-2 text-red-200">
              <div className="flex items-center space-x-2 font-bold text-xs text-red-300">
                <ShieldAlert className="w-4 h-4 text-red-400" />
                <span>EXIGÊNCIA REGULATÓRIA: NOTIFICAÇÃO OBRIGATÓRIA NO NOTIVISA</span>
              </div>
              <p className="text-[11px] leading-relaxed text-red-200">
                Conforme a RDC 1002/2025 e regulamentos do SNVS, incidentes com dano grave ou óbito
                devem ser notificados no sistema Notivisa da Anvisa em até 72 horas úteis pelo
                Responsável Técnico.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <a
                  href="https://www8.anvisa.gov.br/notivisa/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-red-800 hover:bg-red-700 text-white rounded-lg text-xs font-semibold w-fit transition"
                >
                  <span>Acessar Portal Notivisa Anvisa</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <input
                  type="text"
                  placeholder="Informe o Nº do Protocolo Notivisa *"
                  value={notivisaProtocol}
                  onChange={(e) => setNotivisaProtocol(e.target.value)}
                  className="flex-1 bg-slate-900 border border-red-600 rounded-lg px-3 py-1.5 text-xs text-white placeholder-red-300 focus:outline-none focus:border-white font-mono"
                  required
                />
              </div>
            </div>
          )}

          {/* Conduta Clínica / Profilática Imediata Adotada */}
          <div>
            <label className="text-[11px] font-medium text-slate-300 flex items-center justify-between mb-1">
              <span>Conduta Imediata Adotada (Primeiros Socorros / Profilaxia) *</span>
              <span className="text-[10px] text-slate-500">
                {affectedType === 'TEAM_MEMBER' ? 'Ex: Lavagem, PEP, CAT' : 'Ex: Sutura, Rx de controle, medicação'}
              </span>
            </label>
            <textarea
              rows={2}
              value={conductTaken}
              onChange={(e) => setConductTaken(e.target.value)}
              placeholder={
                affectedType === 'TEAM_MEMBER'
                  ? 'Ex: Lavagem abundante do local com água e sabão, teste rápido sorológico de fonte/vítima, encaminhamento ao centro de referência para PEP em até 2h e abertura de CAT.'
                  : 'Ex: Remoção imediata do fragmento sob irrigação, radiografia periapical digital de controle, prescrição medicamentosa e orientações pós-atendimento.'
              }
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 leading-relaxed"
              required
            />
          </div>

          {/* Descrição do Fato */}
          <div>
            <label className="text-[11px] font-medium text-slate-300 block mb-1">
              Descrição Detalhada do Fato e Causas *
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva detalhadamente o que ocorreu, instrumentos ou materiais envolvidos e fatores que contribuíram..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 leading-relaxed"
              required
            />
          </div>

          {/* Análise de Causa & Ação Preventiva */}
          <div>
            <label className="text-[11px] font-medium text-slate-300 block mb-1">
              Ação Preventiva / Corretiva no Ciclo PDCA *
            </label>
            <textarea
              rows={2}
              value={preventiveAction}
              onChange={(e) => setPreventiveAction(e.target.value)}
              placeholder="Ex: Treinamento imediato de descarte seguro, revisão de lote de instrumentais, reforço de POP..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 leading-relaxed"
              required
            />
          </div>

          {/* Data de Reavaliação de Eficácia */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <div className="flex items-center space-x-1.5 text-cyan-400 font-semibold text-xs">
              <Calendar className="w-3.5 h-3.5" />
              <span>Ciclo de Reavaliação de Eficácia (PDCA - 15 a 30 dias)</span>
            </div>
            <p className="text-[10px] text-slate-400">
              O sistema disparará um alerta preventivo no Dashboard nesta data para auditar se a falha reincidiu.
            </p>
            <input
              type="date"
              value={reevaluationDate}
              onChange={(e) => setReevaluationDate(e.target.value)}
              className="w-full sm:w-48 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 mt-1"
            />
          </div>

          {/* Rodapé */}
          <div className="pt-2 flex justify-end space-x-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg text-xs shadow-md transition cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Registrar no Livro do NSP</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
