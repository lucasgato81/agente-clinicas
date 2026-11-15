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
              <Database className="w-5 h-5 font-black" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center space-x-2">
                <span>Integração com Prontuários Odontológicos</span>
                <span className="text-teal-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-teal-50 border border-teal-200">
                  Zero Digitação
                </span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Puxe os pacientes agendados no dia para vincular o QR Code do kit sem digitar nada
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

        {/* Feedback de Sincronização */}
        {syncSuccess && (
          <div className="mx-6 mt-4 p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-900 text-xs flex items-center space-x-2 animate-in slide-in-from-top-2 duration-150 shrink-0 shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-bold">
              6 Pacientes da agenda de hoje importados com sucesso para o leitor de QR Code!
            </span>
          </div>
        )}

        {/* Conteúdo Rolável */}
        <div className="p-5 md:p-6 space-y-5 overflow-y-auto flex-1">
          {/* Card de Ação Principal: Sincronizar Agenda do Dia */}
          <div className="bg-[#F8FAF9] border border-teal-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
            <div className="space-y-0.5">
              <span className="text-[10px] text-teal-800 font-bold uppercase tracking-wider block">
                Sincronização em Tempo Real
              </span>
              <h4 className="text-sm font-bold text-slate-900">Agenda Cirúrgica & Consultas de Hoje</h4>
              <p className="text-xs text-slate-600">
                Importa automaticamente os prontuários dos pacientes agendados para a clínica.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSyncPatients}
              disabled={isSyncing}
              className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-teal-700/20 transition disabled:opacity-50 shrink-0 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Sincronizando...' : 'Puxar Pacientes de Hoje'}</span>
            </button>
          </div>

          {/* Conectores Disponíveis */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Softwares de Gestão Odontológica Compatíveis:
            </span>

            <div className="space-y-2">
              {softwares.map((s) => (
                <div
                  key={s.id}
                  className="bg-white border border-[#E2ECE6] rounded-2xl p-3.5 flex items-center justify-between transition hover:border-teal-300 shadow-sm"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center font-bold text-xs text-teal-800 shadow-sm">
                      {s.logoText.slice(0, 3)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{s.name}</h4>
                      <div className="flex items-center space-x-2 text-[10px] text-slate-500 mt-0.5 font-medium">
                        <span>Última sincronização: {s.lastSync}</span>
                        {s.status === 'CONNECTED' && (
                          <span className="text-emerald-700 font-bold">• Conectado</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleConnect(s.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm ${
                      s.status === 'CONNECTED'
                        ? 'bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-[#E2ECE6] hover:border-rose-200'
                        : 'bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white'
                    }`}
                  >
                    {s.status === 'CONNECTED' ? 'Desconectar' : 'Conectar API'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Webhook REST / Chave de API */}
          <div className="bg-[#F8FAF9] border border-[#E2ECE6] rounded-2xl p-4 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-800 font-bold flex items-center space-x-1.5">
                <Link2 className="w-4 h-4 text-teal-600" />
                <span>Chave de Integração API / Webhook (OdontoShield):</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono font-medium">REST JSON</span>
            </div>
            <input
              type="text"
              readOnly
              value={apiKeyInput}
              className="w-full bg-white border border-[#E2ECE6] rounded-xl px-3 py-2 text-[11px] text-teal-900 font-mono focus:outline-none select-all shadow-sm"
            />
            <p className="text-[10px] text-slate-500 font-medium">
              Cole esta chave nas configurações de integração externa do seu software de prontuário para envio automático de eventos cirúrgicos.
            </p>
          </div>
        </div>

        {/* Rodapé */}
        <div className="p-4 bg-[#F8FAF9] border-t border-[#E2ECE6] flex items-center justify-between text-xs text-slate-600 shrink-0">
          <div className="flex items-center space-x-1.5 text-teal-800 font-medium">
            <Lock className="w-3.5 h-3.5" />
            <span>Dados médicos e nomes de pacientes protegidos por criptografia e LGPD</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-[#E2ECE6] font-bold rounded-xl transition shadow-sm"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};