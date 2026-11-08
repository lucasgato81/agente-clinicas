'use client';

import React, { useState } from 'react';
import {
  X,
  CreditCard,
  QrCode,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Zap,
  Building2,
  Clock,
  ArrowRight,
  Check,
  Copy,
  Receipt,
  FileCheck,
} from 'lucide-react';
import { ClinicTenant } from '@/lib/types';

interface SaaSSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  clinic: ClinicTenant;
  onPlanUpdated: (updatedClinic: ClinicTenant) => void;
}

export const SaaSSubscriptionModal: React.FC<SaaSSubscriptionModalProps> = ({
  isOpen,
  onClose,
  clinic,
  onPlanUpdated,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'SOLO' | 'PRO' | 'ENTERPRISE'>(
    clinic.planId || 'PRO'
  );
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit_card'>('pix');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [pixCopied, setPixCopied] = useState<boolean>(false);
  const [isPaidSuccess, setIsPaidSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const plans = [
    {
      id: 'SOLO' as const,
      name: 'Consultório Solo',
      price: 79,
      period: '/mês',
      badge: 'Para 1 Consultório',
      description: 'Ideal para cirurgiões-dentistas autônomos ou consultórios individuais.',
      features: [
        '1 Consultório Odontológico',
        '1 Autoclave monitorada',
        'Até 3 operadores / equipe',
        'Etiquetas térmicas com QR Code',
        'Rastreabilidade de Instrumentais',
        'Dossiê Sanitário RDC 1002 em PDF',
      ],
    },
    {
      id: 'PRO' as const,
      name: 'Clínica Pro',
      price: 149,
      period: '/mês',
      badge: 'Mais Popular',
      popular: true,
      description: 'O pacote completo para clínicas com alta rotina e exigência sanitária.',
      features: [
        'Até 4 Consultórios / Cadeiras',
        'Autoclaves & Seladoras ilimitadas',
        'Colaboradores ilimitados (ASB/TSB/RT)',
        'Alertas Proativos no WhatsApp',
        'Leitor de Câmera em Tempo Real (2s)',
        'Auditoria RDC 1002 com 1 Clique',
        'Suporte prioritário via WhatsApp',
      ],
    },
    {
      id: 'ENTERPRISE' as const,
      name: 'Redes & Franquias',
      price: 299,
      period: '/mês',
      badge: 'Multi-unidades',
      description: 'Para redes, policlínicas e franqueadoras com múltiplas filiais.',
      features: [
        'Múltiplas Filiais / Unidades',
        'Dashboard Consolidado da Matriz',
        'Auditoria Sanitária Centralizada',
        'Controle de Riscos de Interdição',
        'API de Integração com Prontuários',
        'Treinamento e Implantação Dedicados',
      ],
    },
  ];

  const currentPlanObj = plans.find((p) => p.id === selectedPlan) || plans[1];
  const mockPixCode = `00020126580014br.gov.bcb.pix0136b69b2d8e-73c1-4b10-8b63-95c029410313520400005303986540${currentPlanObj.price}.005802BR5920ODONTOSHIELD SAAS6009SAO PAULO62070503***6304E81A`;

  const handleCopyPix = () => {
    navigator.clipboard.writeText(mockPixCode);
    setPixCopied(true);
    setTimeout(() => setPixCopied(false), 2000);
  };

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsPaidSuccess(true);

      const updated: ClinicTenant = {
        ...clinic,
        planId: selectedPlan,
        planName: currentPlanObj.name,
        subscriptionStatus: 'ACTIVE',
        monthlyFee: currentPlanObj.price,
        trialDaysLeft: 30,
      };
      onPlanUpdated(updated);

      setTimeout(() => {
        setIsPaidSuccess(false);
        onClose();
      }, 1500);
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 md:p-6 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full my-auto overflow-hidden shadow-2xl flex flex-col max-h-[95vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho */}
        <div className="p-5 md:px-6 md:py-4 bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 shadow-md shadow-cyan-950/50">
              <Sparkles className="w-5 h-5 font-black" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center space-x-2">
                <span>Planos & Assinatura OdontoShield</span>
                <span className="text-cyan-400 text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-800">
                  SaaS B2B
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Segurança sanitária com retorno garantido: proteja sua clínica contra multas e interdições
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

        {/* Conteúdo dos Planos */}
        <div className="p-5 md:p-6 space-y-6 overflow-y-auto flex-1">
          {/* Card de Status Atual do Tenant */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                Estabelecimento Ativo
              </span>
              <div className="font-bold text-sm text-white flex items-center space-x-2">
                <span>{clinic.name}</span>
                <span className="text-xs font-mono text-slate-400">({clinic.cnpj || 'CNPJ não informado'})</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">Status da Assinatura</span>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                    clinic.subscriptionStatus === 'ACTIVE'
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                      : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                  }`}
                >
                  {clinic.subscriptionStatus === 'ACTIVE'
                    ? 'Assinatura Ativa'
                    : `Período de Teste Grátis (${clinic.trialDaysLeft || 14} dias)`}
                </span>
              </div>
            </div>
          </div>

          {/* Comparativo de Planos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((p) => {
              const isSelected = selectedPlan === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPlan(p.id)}
                  className={`rounded-2xl p-5 border cursor-pointer transition-all flex flex-col justify-between relative ${
                    isSelected
                      ? 'bg-slate-950 border-cyan-500 shadow-xl ring-2 ring-cyan-500/40'
                      : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {p.popular && (
                    <div className="absolute -top-2.5 right-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-[10px] uppercase px-2.5 py-0.5 rounded-full shadow">
                      Mais Escolhido
                    </div>
                  )}

                  <div className="space-y-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                        {p.badge}
                      </span>
                      <h4 className="text-base font-bold text-white">{p.name}</h4>
                      <p className="text-[11px] text-slate-400 mt-1">{p.description}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-800">
                      <div className="flex items-baseline space-x-1">
                        <span className="text-xs text-slate-400 font-bold">R$</span>
                        <span className="text-3xl font-black text-white">{p.price}</span>
                        <span className="text-xs text-slate-400">{p.period}</span>
                      </div>
                    </div>

                    <ul className="space-y-2 pt-2 border-t border-slate-800/60 text-xs text-slate-300">
                      {p.features.map((f, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                          <span className="text-[11px] leading-tight">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-800/80">
                    <button
                      type="button"
                      className={`w-full py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                        isSelected
                          ? 'bg-cyan-500 text-slate-950 shadow-md'
                          : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Plano Selecionado</span>
                        </>
                      ) : (
                        <span>Escolher este plano</span>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Área de Pagamento / Checkout Instantâneo */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Checkout Recorrente: {currentPlanObj.name} (R$ {currentPlanObj.price}/mês)
                </h4>
                <p className="text-[11px] text-slate-400">
                  Cancele quando quiser • Sem fidelidade • Nota Fiscal automática emitida para seu CNPJ
                </p>
              </div>

              {/* Seletor PIX vs Cartão */}
              <div className="flex bg-slate-900 p-0.5 rounded-xl border border-slate-800 text-xs shrink-0">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('pix')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center space-x-1.5 ${
                    paymentMethod === 'pix'
                      ? 'bg-emerald-500 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>PIX Instantâneo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('credit_card')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center space-x-1.5 ${
                    paymentMethod === 'credit_card'
                      ? 'bg-cyan-500 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Cartão de Crédito</span>
                </button>
              </div>
            </div>

            {/* Conteúdo do Método de Pagamento */}
            {paymentMethod === 'pix' ? (
              <div className="flex flex-col sm:flex-row items-center gap-5 pt-2">
                <div className="w-32 h-32 bg-white p-2 rounded-xl flex items-center justify-center shrink-0 border border-slate-300 shadow">
                  <QrCode className="w-24 h-24 text-slate-950" />
                </div>

                <div className="space-y-2 flex-1 w-full text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium">Chave PIX Copia e Cola:</span>
                    <button
                      type="button"
                      onClick={handleCopyPix}
                      className="text-emerald-400 hover:text-emerald-300 flex items-center space-x-1 font-bold"
                    >
                      {pixCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{pixCopied ? 'Código Copiado!' : 'Copiar Código PIX'}</span>
                    </button>
                  </div>

                  <input
                    type="text"
                    readOnly
                    value={mockPixCode}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-[10px] text-slate-300 font-mono select-all focus:outline-none"
                  />

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-400">
                      Liberação imediata assim que confirmado no Banco Central
                    </span>
                    <button
                      type="button"
                      onClick={handleSimulatePayment}
                      disabled={isProcessing}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs shadow-md transition disabled:opacity-50"
                    >
                      {isProcessing ? 'Confirmando no Banco Central...' : 'Simular Pagamento PIX'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Número do Cartão:</label>
                  <input
                    type="text"
                    placeholder="•••• •••• •••• 4242"
                    defaultValue="•••• •••• •••• 8821"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-400 block mb-1">Validade:</label>
                    <input
                      type="text"
                      placeholder="MM/AA"
                      defaultValue="12/29"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">CVV:</label>
                    <input
                      type="text"
                      placeholder="•••"
                      defaultValue="731"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2 flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleSimulatePayment}
                    disabled={isProcessing}
                    className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs shadow-md transition disabled:opacity-50"
                  >
                    {isProcessing ? 'Processando Cartão...' : `Confirmar Assinatura (R$ ${currentPlanObj.price}/mês)`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Alerta de Sucesso */}
          {isPaidSuccess && (
            <div className="p-4 bg-emerald-950 border border-emerald-600 rounded-2xl text-emerald-200 text-xs flex items-center space-x-2 animate-in zoom-in-95 duration-150">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <p className="font-bold">Assinatura Ativada com Sucesso!</p>
                <p className="text-[11px] text-emerald-300">
                  Sua clínica agora conta com conformidade contínua RDC 1002/2025.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Rodapé */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex items-center space-x-1.5 text-cyan-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Garantia de 30 dias: Satisfação total ou estorno integral</span>
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