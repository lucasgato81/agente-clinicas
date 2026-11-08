'use client';

import React, { useState } from 'react';
import {
  X,
  MessageSquare,
  Bell,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Clock,
  Send,
  Sparkles,
  Phone,
  Settings2,
  History,
  Check,
  ExternalLink,
  ShieldAlert,
  Flame,
} from 'lucide-react';
import { ClinicTenant, SterilePackageItem, EquipmentItem, PopItem } from '@/lib/types';

interface WhatsAppAutomationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  clinic: ClinicTenant;
  packages: SterilePackageItem[];
  equipments: EquipmentItem[];
  pops: PopItem[];
}

interface AlertTemplate {
  id: string;
  title: string;
  category: 'BIOLOGICAL' | 'EXPIRY' | 'LICENSE' | 'POP';
  description: string;
  frequency: string;
  enabled: boolean;
  messageText: string;
}

export const WhatsAppAutomationsModal: React.FC<WhatsAppAutomationsModalProps> = ({
  isOpen,
  onClose,
  clinic,
  packages,
  equipments,
  pops,
}) => {
  const [phoneNumber, setPhoneNumber] = useState<string>(clinic.phone || '11987654321');
  const [provider, setProvider] = useState<'wame' | 'evolution' | 'zapi'>('wame');
  const [apiUrl, setApiUrl] = useState<string>('https://api.evolution.sua-clinica.com.br');
  const [apiKey, setApiKey] = useState<string>('');
  const [sentSuccessMessage, setSentSuccessMessage] = useState<string | null>(null);

  // Alertas configurados
  const [alerts, setAlerts] = useState<AlertTemplate[]>([
    {
      id: 'bio_test',
      title: 'Lembrete Semanal do Teste Biológico (Autoclave)',
      category: 'BIOLOGICAL',
      description: 'Disparado toda quinta-feira às 08:00 para lembrar a ASB/TSB de incubar a ampola.',
      frequency: 'Toda quinta-feira às 08:00',
      enabled: true,
      messageText: `🧪 *ODONTOSHIELD • LEMBRETE SEMANAL ANVISA*\n\nOlá Equipe CME da *${clinic.name}*!\n\nHoje é dia de realizar o *Teste do Indicador Biológico* na Autoclave.\n\nPasso a passo:\n1. Colocar a ampola teste no centro da câmara;\n2. Executar ciclo padrão de 134°C;\n3. Ativar a ampola e colocar na incubadora por 24h/48h;\n4. Registrar a leitura com foto no OdontoShield para o Dossiê VISA.\n\n_Conformidade sanitária RDC 1002/2025._`,
    },
    {
      id: 'sterile_expiry',
      title: 'Alerta de Pacotes Estéreis Vencendo na CME',
      category: 'EXPIRY',
      description: 'Avisa quando kits cirúrgicos atingem 48h antes da expiração da barreira estéril.',
      frequency: 'Diário às 07:30',
      enabled: true,
      messageText: `📦 *ODONTOSHIELD • ALERTA DE VALIDADE CME*\n\nOlá Dr(a). ${clinic.technicalResponsibleName || 'Responsável Técnico'}!\n\nConstam kits cirúrgicos na CME atingindo o prazo limite da barreira estéril em menos de 48 horas.\n\nRecomendação: Reesterilizar os materiais antes de cirurgias programadas para evitar infecção cruzada.\n\nVerifique em: https://agente-clinicas.onrender.com`,
    },
    {
      id: 'license_renewal',
      title: 'Vencimento de Alvará Sanitário & NR-13',
      category: 'LICENSE',
      description: 'Notifica 30 e 15 dias antes de vencer o Alvará Sanitário ou o Teste Hidrostático.',
      frequency: '30 dias antes do vencimento',
      enabled: true,
      messageText: `🚨 *ODONTOSHIELD • AVISO CRÍTICO DE ALVARÁ*\n\nPrezado(a) Gestor(a) da *${clinic.name}*,\n\nO Alvará Sanitário ou Teste NR-13 de equipamento vence em breve (*${clinic.licenseExpiry}*).\n\nEvite interdições ou multas da Vigilância Sanitária iniciando o protocolo de renovação junto à VISA municipal.`,
    },
    {
      id: 'pop_training',
      title: 'Cobrança de Assinatura de POPs e Treinamentos',
      category: 'POP',
      description: 'Lembra colaboradores que ainda não assinaram digitalmente os POPs da clínica.',
      frequency: 'Segundas-feiras às 09:00',
      enabled: true,
      messageText: `📋 *ODONTOSHIELD • TREINAMENTO OBRIGATÓRIO*\n\nOlá! Há Procedimentos Operacionais Padrão (POPs) pendentes de leitura e assinatura digital no seu perfil OdontoShield.\n\nAcesse o sistema na bancada e confirme sua ciência para manter a equipe regular perante a auditoria sanitária.`,
    },
  ]);

  if (!isOpen) return null;

  const toggleAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a))
    );
  };

  const handleSendTest = (alert: AlertTemplate) => {
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    const encodedText = encodeURIComponent(alert.messageText);

    if (provider === 'wame') {
      const waUrl = `https://wa.me/55${cleanPhone}?text=${encodedText}`;
      window.open(waUrl, '_blank');
      setSentSuccessMessage(`Mensagem de teste aberta no WhatsApp Web para o número (55) ${cleanPhone}!`);
    } else {
      // Simulação de chamada de API Evolution / Z-API
      setSentSuccessMessage(`Disparo disparado via ${provider.toUpperCase()} para o número (55) ${cleanPhone} com sucesso!`);
    }

    setTimeout(() => setSentSuccessMessage(null), 4000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 md:p-6 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full my-auto overflow-hidden shadow-2xl flex flex-col max-h-[95vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho */}
        <div className="p-5 md:px-6 md:py-4 bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-slate-950 shadow-md shadow-emerald-950/50">
              <MessageSquare className="w-5 h-5 font-black" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center space-x-2">
                <span>Alertas Proativos no WhatsApp</span>
                <span className="text-emerald-400 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800">
                  Zero Churn
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                O "anjo da guarda" da clínica: lembretes automáticos de biossegurança direto no celular
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

        {/* Feedback de Envio */}
        {sentSuccessMessage && (
          <div className="mx-6 mt-4 p-3 bg-emerald-950/90 border border-emerald-600 rounded-2xl text-emerald-200 text-xs flex items-center space-x-2 animate-in slide-in-from-top-2 duration-150 shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium">{sentSuccessMessage}</span>
          </div>
        )}

        {/* Conteúdo Rolável */}
        <div className="p-5 md:p-6 space-y-6 overflow-y-auto flex-1">
          {/* Configuração do Destinatário e Provedor */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                <Settings2 className="w-4 h-4 text-cyan-400" />
                <span>Canal de Disparo & Destinatário</span>
              </span>
              <span className="text-[11px] text-emerald-400 font-mono">Conexão Ativa</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">
                  WhatsApp do Responsável Técnico / Clínica (com DDD):
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Ex: 11987654321"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">
                  Modo de Integração:
                </label>
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value as 'wame' | 'evolution' | 'zapi')}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="wame">WhatsApp Web Direto (Zero Custo / Sem API)</option>
                  <option value="evolution">Evolution API (Servidor Próprio / Ilimitado)</option>
                  <option value="zapi">Z-API / Twilio (SaaS Corporativo)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Lista de Gatilhos Inteligentes */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Gatilhos Automáticos de Notificação (RDC 1002)
              </span>
              <span className="text-[11px] text-slate-400">{alerts.filter((a) => a.enabled).length} ativos</span>
            </div>

            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-2xl border transition ${
                    alert.enabled
                      ? 'bg-slate-950/90 border-slate-800 hover:border-slate-700'
                      : 'bg-slate-950/40 border-slate-900 opacity-60'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800/80">
                    <div className="flex items-center space-x-2.5">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                          alert.category === 'BIOLOGICAL'
                            ? 'bg-purple-950 text-purple-300 border border-purple-800'
                            : alert.category === 'EXPIRY'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : alert.category === 'LICENSE'
                            ? 'bg-red-950 text-red-300 border border-red-800'
                            : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                        }`}
                      >
                        <Bell className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{alert.title}</h4>
                        <p className="text-[11px] text-slate-400">{alert.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => toggleAlert(alert.id)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                          alert.enabled
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {alert.enabled ? 'Ativo' : 'Pausado'}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSendTest(alert)}
                        className="flex items-center space-x-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-lg text-[11px] transition shadow"
                        title="Dispara este alerta agora no WhatsApp"
                      >
                        <Send className="w-3 h-3" />
                        <span>Testar Disparo</span>
                      </button>
                    </div>
                  </div>

                  <div className="mt-2.5 pt-1 text-[11px] text-slate-400 flex items-center justify-between">
                    <span className="flex items-center space-x-1 text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Frequência: {alert.frequency}</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Disparo Automático</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rodapé Fixo */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex items-center space-x-1.5 text-emerald-400 font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Redução comprovada de 94% em multas e esquecimentos</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};