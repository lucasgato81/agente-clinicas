'use client';

import React, { useState } from 'react';
import {
  X,
  Database,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
  Link2,
  Calendar,
  UserCheck,
  Check,
  Lock,
} from 'lucide-react';

interface EhrIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPatientsSynced: (patientNames: string[]) => void;
}

interface EhrSoftware {
  id: string;
  name: string;
  logoText: string;
  status: 'CONNECTED' | 'DISCONNECTED';
  patientsTodayCount: number;
  lastSync: string;
}

export const EhrIntegrationModal: React.FC<EhrIntegrationModalProps> = ({
  isOpen,
  onClose,
  onPatientsSynced,
}) => {
  const [softwares, setSoftwares] = useState<EhrSoftware[]>([
    {
      id: 'clinicorp',
      name: 'Clinicorp',
      logoText: 'CLINICORP',
      status: 'CONNECTED',
      patientsTodayCount: 6,
      lastSync: 'Há 5 minutos',
    },
    {
      id: 'simples_dental',
      name: 'Simples Dental',
      logoText: 'SIMPLES DENTAL',
      status: 'DISCONNECTED',
      patientsTodayCount: 0,
      lastSync: 'Nunca',
    },
    {
      id: 'dental_office',
      name: 'Dental Office',
      logoText: 'DENTAL OFFICE',
      status: 'DISCONNECTED',
      patientsTodayCount: 0,
      lastSync: 'Nunca',
    },
    {
      id: 'codental',
      name: 'Codental',
      logoText: 'CODENTAL',
      status: 'DISCONNECTED',
      patientsTodayCount: 0,
      lastSync: 'Nunca',
    },
  ]);

  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncSuccess, setSyncSuccess] = useState<boolean>(false);
  const [apiKeyInput, setApiKeyInput] = useState<string>('ck_live_9823f0a827119e8c001');

  if (!isOpen) return null;

  const handleSyncPatients = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncSuccess(true);

      const mockTodayPatients = [
        'Carlos Eduardo Silveira (Prontuário #4830)',
        'Mariana Guimarães Rocha (Prontuário #4831)',
        'Fabio Henrique Albuquerque (Prontuário #4832)',
        'Beatriz Lima dos Santos (Prontuário #4833)',
        'Lucas Gabriel Souza (Prontuário #4834)',
        'Camila Nogueira Ribeiro (Prontuário #4835)',
      ];
      onPatientsSynced(mockTodayPatients);

      setTimeout(() => setSyncSuccess(false), 3000);
    }, 1200);
  };

  const toggleConnect = (id: string) => {
    setSoftwares((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              status: s.status === 'CONNECTED' ? 'DISCONNECTED' : 'CONNECTED',
              lastSync: 'Agora',
              patientsTodayCount: s.status === 'CONNECTED' ? 0 : 6,
            }
          : s
      )
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 md:p-6 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full my-auto overflow-hidden shadow-2xl flex flex-col max-h-[95vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho */}
        <div className="p-5 md:px-6 md:py-4 bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 shadow-md shadow-cyan-950/50">
              <Database className="w-5 h-5 font-black" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center space-x-2">
                <span>Integração com Prontuários Odontológicos</span>
                <span className="text-cyan-400 text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-800">
                  Zero Digitação
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Puxe os pacientes agendados no dia para vincular o QR Code do kit sem digitar nada
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Feedback de Sincronização */}
        {syncSuccess && (
          <div className="mx-6 mt-4 p-3 bg-emerald-950 border border-emerald-600 rounded-2xl text-emerald-200 text-xs flex items-center space-x-2 animate-in slide-in-from-top-2 duration-150 shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold">
              6 Pacientes da agenda de hoje importados com sucesso para o leitor de QR Code!
            </span>
          </div>
        )}

        {/* Conteúdo Rolável */}
        <div className="p-5 md:p-6 space-y-5 overflow-y-auto flex-1">
          {/* Card de Ação Principal: Sincronizar Agenda do Dia */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">
                Sincronização em Tempo Real
              </span>
              <h4 className="text-sm font-bold text-white">Agenda Cirúrgica & Consultas de Hoje</h4>
              <p className="text-xs text-slate-400">
                Importa automaticamente os prontuários dos pacientes agendados para a clínica.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSyncPatients}
              disabled={isSyncing}
              className="flex items-center space-x-2 px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs shadow-md transition disabled:opacity-50 shrink-0"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Sincronizando...' : 'Puxar Pacientes de Hoje'}</span>
            </button>
          </div>

          {/* Conectores Disponíveis */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Softwares de Gestão Odontológica Compatíveis:
            </span>

            <div className="space-y-2">
              {softwares.map((s) => (
                <div
                  key={s.id}
                  className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between transition hover:border-slate-700"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center font-black text-xs text-cyan-400">
                      {s.logoText.slice(0, 3)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{s.name}</h4>
                      <div className="flex items-center space-x-2 text-[10px] text-slate-400 mt-0.5">
                        <span>Última sincronização: {s.lastSync}</span>
                        {s.status === 'CONNECTED' && (
                          <span className="text-emerald-400 font-semibold">• Conectado</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleConnect(s.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      s.status === 'CONNECTED'
                        ? 'bg-slate-800 hover:bg-red-950 hover:text-red-300 text-slate-300 border border-slate-700'
                        : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
                    }`}
                  >
                    {s.status === 'CONNECTED' ? 'Desconectar' : 'Conectar API'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Webhook REST / Chave de API */}
          <div className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-4 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-bold flex items-center space-x-1.5">
                <Link2 className="w-4 h-4 text-cyan-400" />
                <span>Chave de Integração API / Webhook (OdontoShield):</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">REST JSON</span>
            </div>
            <input
              type="text"
              readOnly
              value={apiKeyInput}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-[11px] text-cyan-300 font-mono focus:outline-none select-all"
            />
            <p className="text-[10px] text-slate-500">
              Cole esta chave nas configurações de integração externa do seu software de prontuário para envio automático de eventos cirúrgicos.
            </p>
          </div>
        </div>

        {/* Rodapé */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex items-center space-x-1.5 text-cyan-400">
            <Lock className="w-3.5 h-3.5" />
            <span>Dados médicos e nomes de pacientes protegidos por criptografia e LGPD</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};