'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  Camera,
  FileText,
  Wrench,
  Clock,
  ArrowRight,
  Check,
  X as XIcon,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Building2,
  Users,
  Lock,
  Play,
  HelpCircle,
  TrendingDown,
  ShieldAlert,
  Smartphone,
  Flame,
  Star,
  ExternalLink,
} from 'lucide-react';

export default function LandingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('annual');
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [chairsCount, setChairsCount] = useState<number>(2);
  const [activeTabFeature, setActiveTabFeature] = useState<'cme' | 'labels' | 'equipments' | 'pops' | 'dossier'>('cme');

  const plans = [
    {
      id: 'SOLO',
      name: 'Consultório Solo',
      badge: 'Para 1 Consultório',
      description: 'Ideal para cirurgiões-dentistas autônomos ou consultórios individuais com 1 cadeira.',
      priceMonthly: 79,
      priceAnnualMonthly: 63,
      features: [
        '1 Consultório Odontológico (1 Cadeira)',
        '1 Autoclave monitorada com fotos periciais',
        'Até 3 operadores da equipe (ASB/TSB/Dentista)',
        'Rastreabilidade com Código Curto manual (#2610-P01)',
        'Impressão de etiquetas térmicas e Pimaco A4',
        '8 POPs essenciais prontos para assinatura touch',
        'Dossiê Fiscal da Vigilância Sanitária em PDF',
      ],
      notIncluded: [
        'Alertas automáticos proativos no WhatsApp',
        'Leitor de câmera instantâneo na cadeira (2s)',
        'Dashboard multi-unidades / franquias',
      ],
      ctaText: 'Iniciar Teste de 30 Dias',
      popular: false,
    },
    {
      id: 'PRO',
      name: 'Clínica Pro',
      badge: 'O Mais Escolhido',
      description: 'O pacote completo de blindagem pericial para clínicas de alta rotina e exigência sanitária.',
      priceMonthly: 149,
      priceAnnualMonthly: 119,
      features: [
        'Até 4 Consultórios / Cadeiras odontológicas',
        'Autoclaves & Seladoras monitoradas ilimitadas',
        'Colaboradores ilimitados com login por PIN',
        'Alertas proativos no WhatsApp (testes biológicos e laudos)',
        'Leitor de Câmera em Tempo Real (vínculo em 2s)',
        'Integração com prontuários (Clinicorp, Simples Dental)',
        '8 POPs com assinaturas touch e hash SHA-256',
        'Dossiê Fiscal Consolidado em 1 clique',
        'Garantia Anti-Multa com risco zero',
      ],
      notIncluded: [
        'Dashboard multi-unidades matriz / filiais',
      ],
      ctaText: 'Garantir Plano Pro com Desconto',
      popular: true,
    },
    {
      id: 'ENTERPRISE',
      name: 'Redes & Franquias',
      badge: 'Corporativo & Multi-filiais',
      description: 'Para redes odontológicas, policlínicas e franqueadoras que exigem governança centralizada.',
      priceMonthly: 299,
      priceAnnualMonthly: 239,
      features: [
        'Múltiplas Filiais / Unidades franqueadas',
        'Dashboard Centralizado da Matriz com Compliance Score',
        'Controle central de riscos de interdição por filial',
        'Auditoria Sanitária corporativa em tempo real',
        'API de Integração com Prontuários e ERPs',
        'Treinamento e implantação com consultor dedicado',
        'Suporte prioritário 24/7 com canal VIP de WhatsApp',
      ],
      notIncluded: [],
      ctaText: 'Falar com Consultor de Expansão',
      popular: false,
    },
  ];

  const faqs = [
    {
      q: 'A minha Auxiliar (ASB) tem dificuldade com tecnologia. Ela vai conseguir usar?',
      a: 'Sim, e esse foi o nosso maior cuidado de design! O fluxo da ASB foi reduzido a apenas 3 toques no celular: ela abre o app, aponta a câmera para a fita da autoclave e clica em salvar. Demora menos de 30 segundos por carga. Além disso, incluímos 3 vídeos tutoriais verticais de 60 segundos no WhatsApp que ensinam qualquer colaborador em minutos.',
    },
    {
      q: 'Preciso comprar uma impressora térmica cara para rastrear os instrumentais?',
      a: 'Não! Desenvolvemos o sistema com o Código Curto inteligente (ex: #2610-P01). A sua auxiliar pode escrever o código com qualquer caneta permanente diretamente no papel grau cirúrgico. Se preferir etiquetas impressas, o sistema gera folhas comuns Pimaco A4 ou etiquetas térmicas.',
    },
    {
      q: 'Eu já uso um software odontológico (Simples Dental, Clinicorp, Dental Office). Por que preciso do OdontoShield?',
      a: 'Os softwares tradicionais focam na recepção: agenda de consultas, financeiro e odontograma. Eles não descem até a sala de esterilização. Nenhum deles guarda a foto pericial da fita Classe 5 ou da ampola incubada por 5 anos, nem gerencia o teste hidrostático do compressor ou o laudo radiométrico do raio-X. O OdontoShield não compete com o seu ERP; ele integra com ele para ser o seu escudo sanitário e pericial.',
    },
    {
      q: 'E se a internet na sala de esterilização for fraca ou cair?',
      a: 'O OdontoShield possui tecnologia PWA com modo offline resiliente. A auxiliar consegue registrar o ciclo normalmente sem sinal. Assim que o smartphone detectar conexão Wi-Fi ou dados móveis, os dados e fotos sobem automaticamente para a nuvem criptografada em segundo plano.',
    },
    {
      q: 'O fiscal da Vigilância Sanitária aceita o livro de autoclave no celular/computador?',
      a: 'Com certeza! A RDC 1002/2025 e a RDC 15/2012 da Anvisa autorizam e estimulam explicitamente registros informatizados, desde que garantam a rastreabilidade e a integridade das informações por no mínimo 5 anos. Na verdade, os fiscais preferem o Dossiê Digital porque todas as informações de temperatura, pressão e fotos dos testes estão auditadas e ordenadas cronologicamente.',
    },
    {
      q: 'Como funciona a Garantia Anti-Multa de Risco Zero?',
      a: 'Se a sua clínica mantiver os registros atualizados no OdontoShield e, durante a vigência da anuidade, for autuada pela Vigilância Sanitária por qualquer inconformidade nos livros e POPs cobertos pela plataforma, nós devolvemos 100% do valor pago pela assinatura e colocamos nossa assessoria sanitária à disposição para redigir sua defesa.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* ============================================================== */}
      {/* 1. HEADER NAVEGAÇÃO PÚBLICA                                    */}
      {/* ============================================================== */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/lp" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent">
                  OdontoShield
                </span>
                <span className="text-[10px] font-bold uppercase bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded-full">
                  RDC 1002/2025
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Governança & Biossegurança Odontológica</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
            <a href="#como-funciona" className="hover:text-cyan-400 transition">Como Funciona</a>
            <a href="#comparativo" className="hover:text-cyan-400 transition">Antes vs. Depois</a>
            <a href="#planos" className="hover:text-cyan-400 transition">Planos & Preços</a>
            <a href="#garantia" className="hover:text-cyan-400 transition">Garantia Anti-Multa</a>
            <a href="#faq" className="hover:text-cyan-400 transition">Dúvidas Frequentes</a>
          </nav>

          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800 transition hidden sm:inline-flex"
            >
              Acessar Painel
            </Link>
            <a
              href="#planos"
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/25 transition transform active:scale-95 flex items-center space-x-1.5"
            >
              <span>Testar 30 Dias Grátis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 space-y-24 md:space-y-32">
        {/* ============================================================== */}
        {/* 2. HERO SECTION COM IMPACTO VISUAL                             */}
        {/* ============================================================== */}
        <section className="relative pt-12 md:pt-20 pb-16 overflow-hidden">
          {/* Efeitos de Iluminação de Fundo */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/15 blur-[140px] pointer-events-none rounded-full" />
          <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-blue-600/10 blur-[120px] pointer-events-none rounded-full" />

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
            {/* Pill de Destaque Regulatório */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-cyan-500/40 text-cyan-300 text-xs font-semibold shadow-inner">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Conformidade Obrigatória com a Nova RDC 1002/2025 da Anvisa</span>
            </div>

            {/* Título Principal de Impacto */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              Sua clínica <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">100% blindada</span> contra multas e interdições da Vigilância Sanitária.
            </h1>

            {/* Subtítulo Claro e Direto */}
            <p className="max-w-3xl mx-auto text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
              A primeira plataforma de governança e perícia biológica para odontologia. Aposente o caderno manchado de autoclave: registre fotos periciais na nuvem, rastreie kits no paciente sem impressora cara e gere o <strong className="text-white font-semibold">Dossiê do Fiscal em 1 clique</strong>.
            </p>

            {/* Chamadas de Ação (CTAs) */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <a
                href="#planos"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-cyan-500 via-cyan-400 to-teal-400 hover:brightness-110 text-slate-950 font-black text-sm sm:text-base rounded-2xl shadow-xl shadow-cyan-500/25 transition transform active:scale-95 flex items-center justify-center space-x-2"
              >
                <span>BLINDAR MINHA CLÍNICA AGORA</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <Link
                href="/rastrear?token=ODONTO-20261024-001"
                target="_blank"
                className="w-full sm:w-auto px-6 py-4 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-bold text-sm rounded-2xl transition flex items-center justify-center space-x-2 group"
              >
                <QrCode className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition" />
                <span>Ver Demonstração de Rastreabilidade</span>
              </Link>
            </div>

            {/* Provas e Segurança */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-slate-400 font-medium">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Zero risco: 30 dias de teste grátis</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Dispensa impressora térmica</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Aceito em auditorias da VISA</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Pronto em 2 minutos</span>
              </div>
            </div>

            {/* Mockup / Pré-visualização do Hero Dashboard */}
            <div className="pt-10 max-w-4xl mx-auto">
              <div className="relative rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-2xl overflow-hidden group">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800 text-xs text-slate-400">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                    <span className="ml-2 font-mono text-[11px] text-slate-300">odontoshield.app / cme-auditoria</span>
                  </div>
                  <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold">
                    ✓ RDC 1002: 100% CONFORME
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Último Ciclo CME</span>
                    <div className="text-lg font-bold text-white mt-1">#2610-C1 (Cristófoli 21L)</div>
                    <div className="flex items-center space-x-1.5 text-xs text-emerald-400 mt-2 font-medium">
                      <Check className="w-3.5 h-3.5" />
                      <span>Fita Classe 5 OK (Foto Salva)</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Teste Biológico: Negativo (24h)</div>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Rastreabilidade Rápida</span>
                    <div className="text-lg font-bold text-cyan-400 mt-1 font-mono">#2610-P01</div>
                    <div className="text-xs text-slate-300 mt-1">Kit Cirurgia Periodontal Especial</div>
                    <div className="text-[11px] text-emerald-400 mt-2 font-medium">✓ Vinculado ao prontuário #4829</div>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Fiscal na Recepção?</span>
                    <div className="text-lg font-bold text-white mt-1">Dossiê 1-Clique</div>
                    <div className="text-xs text-slate-400 mt-1">8 POPs assinados + Laudos em dia</div>
                    <div className="mt-2 inline-flex items-center space-x-1 text-xs text-cyan-400 font-semibold">
                      <span>Gerar Auditoria VISA</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 3. ANTES vs. DEPOIS (O FIM DO CADERNO MANCHADO)                */}
        {/* ============================================================== */}
        <section id="comparativo" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Transformação Imediata</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              O que acontece quando o fiscal da Vigilância chega hoje?
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm">
              Compare a vulnerabilidade do modelo antigo com a tranquilidade da governança digital do OdontoShield.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* O Jeito Antigo (Alto Risco) */}
            <div className="bg-slate-900/60 border border-rose-500/30 rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-rose-500/10 text-rose-400 border-b border-l border-rose-500/30 px-4 py-1 rounded-bl-2xl text-xs font-bold uppercase">
                Como 85% dos consultórios fazem hoje
              </div>

              <div className="flex items-center space-x-3 text-rose-400 pt-2">
                <ShieldAlert className="w-6 h-6" />
                <h3 className="text-xl font-bold text-white">O Modelo Arcaico & Vulnerável</h3>
              </div>

              <ul className="space-y-4 text-sm text-slate-300">
                <li className="flex items-start space-x-3">
                  <XIcon className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <span><strong>Fitas químicas que desbotam:</strong> A fita colada com durex em caderno de espiral perde a cor em 6 meses, anulando a prova em perícia judicial.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <XIcon className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <span><strong>Pânico na recepção:</strong> Recepcionista e ASB revirando armários atrás da pasta empoeirada de POPs enquanto o fiscal aguarda irritado.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <XIcon className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <span><strong>Sem rastreabilidade no paciente:</strong> Impossível provar qual kit exato de fórceps foi aberto na boca de qual paciente caso haja alegação de hepatite ou infecção.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <XIcon className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <span><strong>Laudos esquecidos:</strong> Teste hidrostático do compressor ou laudo de fuga do raio-X vencidos sem que ninguém da clínica perceba.</span>
                </li>
              </ul>
            </div>

            {/* Com o OdontoShield (A Blindagem) */}
            <div className="bg-gradient-to-b from-slate-900 to-slate-900/90 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden shadow-xl shadow-emerald-950/20">
              <div className="absolute top-0 right-0 bg-emerald-500/10 text-emerald-400 border-b border-l border-emerald-500/40 px-4 py-1 rounded-bl-2xl text-xs font-bold uppercase">
                Com o OdontoShield
              </div>

              <div className="flex items-center space-x-3 text-emerald-400 pt-2">
                <ShieldCheck className="w-6 h-6" />
                <h3 className="text-xl font-bold text-white">Blindagem Pericial & Respaldo</h3>
              </div>

              <ul className="space-y-4 text-sm text-slate-300">
                <li className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Fotos periciais na nuvem por 5 anos:</strong> Registro da fita Classe 5 e da ampola incubada protegidos contra degradação física e rasuras.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Dossiê do Fiscal em 1 clique:</strong> Basta gerar o link ou PDF instantâneo na recepção com alvarás, ciclos, laudos e termos em segundos.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Rastreabilidade na cadeira em 2 segundos:</strong> Vínculo imediato do kit ao prontuário via código curto manual ou leitor de câmera.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Alertas no WhatsApp:</strong> Notificações ativas antes que qualquer laudo técnico ou teste biológico expire.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 4. OS 5 PILARES DA PLATAFORMA (COMO FUNCIONA)                  */}
        {/* ============================================================== */}
        <section id="como-funciona" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Funcionalidades Essenciais</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              Tudo o que sua clínica precisa para cumprir a RDC 1002/2025
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm">
              Desenvolvido ouvindo dentistas, fiscais sanitários e auxiliares para ser simples na sala de esterilização e inatacável na auditoria.
            </p>
          </div>

          {/* Abas dos 5 Pilares */}
          <div className="flex flex-wrap justify-center gap-2 border-b border-slate-800 pb-4">
            <button
              onClick={() => setActiveTabFeature('cme')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center space-x-2 ${
                activeTabFeature === 'cme'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>1. Livro Digital de Autoclave</span>
            </button>

            <button
              onClick={() => setActiveTabFeature('labels')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center space-x-2 ${
                activeTabFeature === 'labels'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>2. Rastreabilidade sem Impressora</span>
            </button>

            <button
              onClick={() => setActiveTabFeature('equipments')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center space-x-2 ${
                activeTabFeature === 'equipments'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
              }`}
            >
              <Wrench className="w-4 h-4" />
              <span>3. Laudos de Raio-X & Compressores</span>
            </button>

            <button
              onClick={() => setActiveTabFeature('pops')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center space-x-2 ${
                activeTabFeature === 'pops'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>4. 8 POPs Digitais Touch</span>
            </button>

            <button
              onClick={() => setActiveTabFeature('dossier')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center space-x-2 ${
                activeTabFeature === 'dossier'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>5. Dossiê Fiscal VISA</span>
            </button>
          </div>

          {/* Conteúdo da Aba Ativa */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10">
            {activeTabFeature === 'cme' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">CME & Esterilização Forense</span>
                  <h3 className="text-2xl font-bold text-white">Livro Digital de Autoclave com Fotos Indeléveis</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Sua ASB aponta a câmera do celular para a fita do integrador químico Classe 5 e para a ampola do teste biológico incubado 24h. O sistema armazena a prova pericial na nuvem com criptografia por 5 anos, atendendo à exigência legal da Anvisa sem perda de cor ou descolamento.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-400">
                    <li className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-cyan-400" />
                      <span>Registro de temperatura (°C), pressão (bar) e tempo de ciclo.</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-cyan-400" />
                      <span>Fotos armazenadas com hash imutável e carimbo de data/hora.</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-cyan-400" />
                      <span>Totalmente responsivo: funciona em qualquer celular da auxiliar.</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4 font-mono text-xs">
                  <div className="flex justify-between items-center text-slate-400 border-b border-slate-800 pb-2">
                    <span>LOTE #2610-C1</span>
                    <span className="text-emerald-400 font-bold">✓ APROVADO</span>
                  </div>
                  <div className="text-slate-300 space-y-1">
                    <div>Equipamento: Cristófoli Vitale Class 21L</div>
                    <div>Parâmetros: 134.2°C / 2.15 bar (45 min)</div>
                    <div>Operador: Maria Silva (ASB - CRO 44.890)</div>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-[11px] text-cyan-300 flex items-center justify-between">
                    <span>Foto Fita Classe 5 anexada</span>
                    <span className="text-emerald-400">100% Legível</span>
                  </div>
                </div>
              </div>
            )}

            {activeTabFeature === 'labels' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Economia Inteligente</span>
                  <h3 className="text-2xl font-bold text-white">Rastreabilidade Rápida sem Comprar Impressora Térmica</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Você não precisa gastar R$ 1.500 em impressoras industriais. O OdontoShield gera um <strong>Código Curto</strong> (ex: <code className="bg-slate-950 text-cyan-300 px-2 py-0.5 rounded font-mono">#2610-P01</code>) que sua equipe anota em 3 segundos no grau cirúrgico com caneta de retroprojetor.
                  </p>
                  <p className="text-xs text-slate-400">
                    Se você já tiver impressora térmica (Zebra, Elgin) ou folhas Pimaco A4, o sistema também gera etiquetas adesivas com QR Code prontas para impressão em 1 clique.
                  </p>
                </div>
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center space-y-4">
                  <div className="inline-block p-4 bg-white rounded-xl shadow-lg">
                    <QrCode className="w-24 h-24 text-slate-950 mx-auto" />
                    <div className="font-mono text-xs font-black text-slate-950 mt-1">#2610-P01</div>
                  </div>
                  <div className="text-xs text-slate-300">
                    Escaneável na cadeira odontológica pelo celular em 2 segundos para vincular ao paciente.
                  </div>
                </div>
              </div>
            )}

            {activeTabFeature === 'equipments' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Equipamentos Críticos</span>
                  <h3 className="text-2xl font-bold text-white">Gestão de Laudos e Manutenções Preventivas</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    A Vigilância não fiscaliza apenas a autoclave; ela exige o laudo radiométrico e teste de fuga do cabeçote do raio-X assinado por Físico Médico, além da purga diária e teste hidrostático da NR-13 para compressores.
                  </p>
                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300 flex items-center space-x-2">
                    <Clock className="w-4 h-4 shrink-0" />
                    <span>O sistema avisa 30 dias antes do vencimento e permite chamar o técnico credenciado no WhatsApp com 1 toque.</span>
                  </div>
                </div>
                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-white">Raio-X Gnatus Sommo 70kV</div>
                      <div className="text-slate-500 text-[10px]">Físico Médico Dr. Arnaldo Pires (ABFM)</div>
                    </div>
                    <span className="text-emerald-400 font-bold">Laudo Válido</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-white">Compressor Schulz Isento 60L</div>
                      <div className="text-slate-500 text-[10px]">Teste Hidrostático NR-13</div>
                    </div>
                    <span className="text-amber-400 font-bold">Vence em 25 dias</span>
                  </div>
                </div>
              </div>
            )}

            {activeTabFeature === 'pops' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Documentação Sanitária</span>
                  <h3 className="text-2xl font-bold text-white">8 POPs Obrigatórios com Assinatura Touchscreen</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Esqueça a farsa da pasta de POPs comprada pronta que ninguém lê. O OdontoShield já entrega os 8 POPs essenciais da RDC 1002 personalizados com o CNPJ da clínica.
                  </p>
                  <p className="text-xs text-slate-400">
                    Sua equipe assina na tela do celular com o dedo. Cada assinatura registra data, hora, IP e hash criptográfico SHA-256, comprovando treinamento efetivo da equipe em fiscalizações ou ações trabalhistas.
                  </p>
                </div>
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
                  <div className="p-2.5 bg-slate-900 rounded-lg flex justify-between items-center text-slate-300">
                    <span>POP-BIO-01: Desinfecção de Superfícies da Cadeira</span>
                    <span className="text-emerald-400 font-bold">5/5 Assinados</span>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-lg flex justify-between items-center text-slate-300">
                    <span>POP-CME-04: Operação da Autoclave e Testes</span>
                    <span className="text-emerald-400 font-bold">5/5 Assinados</span>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-lg flex justify-between items-center text-slate-300">
                    <span>POP-NSP-05: Protocolo de Acidentes Perfurocortantes</span>
                    <span className="text-emerald-400 font-bold">5/5 Assinados</span>
                  </div>
                </div>
              </div>
            )}

            {activeTabFeature === 'dossier' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">O Momento do Fiscal</span>
                  <h3 className="text-2xl font-bold text-white">Dossiê Fiscal Consolidado em 1 Clique</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Quando o auditor da Vigilância Sanitária solicitar o histórico, você não perde horas procurando papéis. Basta clicar em <strong>"Dossiê Fiscal"</strong>.
                  </p>
                  <p className="text-xs text-slate-400">
                    O sistema gera um link web de auditoria protegido por token ou um PDF de alta resolução com alvarás, ciclos dos últimos 12 meses, gráficos de conformidade e assinaturas dos POPs.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-emerald-950/60 to-slate-950 p-6 rounded-2xl border border-emerald-500/40 text-center space-y-3">
                  <FileText className="w-12 h-12 text-emerald-400 mx-auto" />
                  <div className="font-bold text-white text-base">Dossiê Sanitário RDC 1002</div>
                  <div className="text-xs text-slate-400">
                    Alvará Sanitário • Responsável Técnico • Livro CME • Laudos Físico Médico • POPs Assinados
                  </div>
                  <div className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-bold">
                    Pronto para Impressão ou Auditoria Digital
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ============================================================== */}
        {/* 5. SIMULADOR DE RISCO & CUSTO SANITÁRIO                        */}
        {/* ============================================================== */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/50 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-6 shadow-xl">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Calculadora de Proteção</span>
              <h2 className="text-xl sm:text-3xl font-bold text-white">
                Quanto custa a tranquilidade da sua clínica?
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Uma única interdição sanitária ou processo por contaminação cruzada pode custar de R$ 15.000 a mais de R$ 80.000.
              </p>
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex justify-between items-center text-sm font-semibold">
                <span className="text-slate-300">Quantos consultórios / cadeiras você opera?</span>
                <span className="text-cyan-400 font-bold text-lg">{chairsCount} {chairsCount === 1 ? 'Cadeira' : 'Cadeiras'}</span>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                value={chairsCount}
                onChange={(e) => setChairsCount(Number(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>1 cadeira (Solo)</span>
                <span>2 a 4 cadeiras (Clínica Plena)</span>
                <span>5+ cadeiras (Redes)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800 text-center">
              <div className="bg-slate-950/80 p-4 rounded-xl border border-rose-500/30">
                <div className="text-xs text-rose-400 font-bold uppercase">Risco Médio de Multa & Interdição</div>
                <div className="text-2xl font-black text-white mt-1">R$ 15.000 a R$ 50.000</div>
                <div className="text-[11px] text-slate-400 mt-1">Fora o dano irreparável à reputação da clínica</div>
              </div>

              <div className="bg-slate-950/80 p-4 rounded-xl border border-emerald-500/40">
                <div className="text-xs text-emerald-400 font-bold uppercase">Investimento no OdontoShield</div>
                <div className="text-2xl font-black text-cyan-400 mt-1">
                  {chairsCount === 1 ? 'R$ 2,63 / dia' : chairsCount <= 4 ? 'R$ 4,96 / dia' : 'R$ 9,96 / dia'}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Menos que um café para ter blindagem 100% pericial</div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 6. TABELA DE PREÇOS (TRANSPARÊNCIA TOTAL)                       */}
        {/* ============================================================== */}
        <section id="planos" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Planos & Preços Transparentes</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              Escolha o tamanho da sua proteção
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm">
              Sem taxas escondidas de implantação. Cancele a qualquer momento com garantia incondicional de 30 dias.
            </p>

            {/* Toggle Mensal / Anual */}
            <div className="pt-4 flex items-center justify-center space-x-3 text-xs sm:text-sm font-semibold">
              <span className={billingPeriod === 'monthly' ? 'text-white' : 'text-slate-400'}>Mensal</span>
              <button
                onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'annual' : 'monthly')}
                className="w-14 h-8 bg-slate-900 border border-slate-700 rounded-full p-1 transition flex items-center"
              >
                <div
                  className={`w-6 h-6 rounded-full bg-cyan-400 shadow-md transform transition ${
                    billingPeriod === 'annual' ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
              <span className={billingPeriod === 'annual' ? 'text-cyan-300' : 'text-slate-400'}>
                Anual <span className="bg-emerald-950 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full border border-emerald-800 font-bold ml-1">20% OFF</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {plans.map((plan) => {
              const price = billingPeriod === 'annual' ? plan.priceAnnualMonthly : plan.priceMonthly;
              return (
                <div
                  key={plan.id}
                  className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition relative ${
                    plan.popular
                      ? 'bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-cyan-500 shadow-2xl shadow-cyan-500/15 scale-105 z-10'
                      : 'bg-slate-900/80 border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-[11px] px-3.5 py-1 rounded-full uppercase tracking-wider shadow">
                      {plan.badge}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      {!plan.popular && (
                        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                          {plan.badge}
                        </span>
                      )}
                      <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                      <p className="text-xs text-slate-400 mt-1 min-h-[32px]">{plan.description}</p>
                    </div>

                    <div className="pt-2 pb-4 border-b border-slate-800">
                      <div className="flex items-baseline space-x-1">
                        <span className="text-sm font-medium text-slate-400">R$</span>
                        <span className="text-4xl font-extrabold text-white">{price}</span>
                        <span className="text-xs text-slate-400 font-medium">/mês</span>
                      </div>
                      <span className="text-[11px] text-slate-500 block mt-1">
                        {billingPeriod === 'annual' ? `Cobrado anualmente (R$ ${price * 12}/ano)` : 'Cobrança mensal sem fidelidade'}
                      </span>
                    </div>

                    <ul className="space-y-2.5 text-xs text-slate-300 pt-2">
                      {plan.features.map((f, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                      {plan.notIncluded.map((n, idx) => (
                        <li key={idx} className="flex items-start space-x-2 text-slate-500 line-through">
                          <XIcon className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                          <span>{n}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-8">
                    <Link
                      href="/"
                      className={`w-full py-3.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition ${
                        plan.popular
                          ? 'bg-gradient-to-r from-cyan-400 to-teal-400 hover:brightness-110 text-slate-950 shadow-lg shadow-cyan-500/25'
                          : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                      }`}
                    >
                      <span>{plan.ctaText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ============================================================== */}
        {/* 7. GARANTIA ANTI-MULTA & GRAND SLAM OFFER                      */}
        {/* ============================================================== */}
        <section id="garantia" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-br from-emerald-950/40 via-slate-900 to-cyan-950/40 border border-emerald-500/40 rounded-3xl p-6 sm:p-10 overflow-hidden shadow-2xl">
            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
              <div className="w-20 h-20 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/10">
                <ShieldCheck className="w-10 h-10 text-emerald-400" />
              </div>

              <div className="space-y-3 text-center sm:text-left">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Compromisso Contratual</span>
                <h3 className="text-2xl font-bold text-white">Garantia Anti-Multa com Risco Reverso</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Confiamos tanto no rigor pericial do OdontoShield que assumimos o risco por você: use o sistema normalmente. Se sua clínica for autuada pela Vigilância Sanitária por inconformidade nos livros e POPs cobertos pela plataforma, nós <strong className="text-white">devolvemos 100% da sua anuidade</strong> e disponibilizamos nossa consultoria sanitária para elaborar a sua defesa.
                </p>
                <div className="text-xs text-emerald-300 font-semibold pt-1">
                  ✓ Sem letras miúdas. Você não corre risco algum ao experimentar.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 8. FAQ INTERATIVO                                              */}
        {/* ============================================================== */}
        <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Tire Suas Dúvidas</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Perguntas Frequentes</h2>
            <p className="text-slate-400 text-xs sm:text-sm">Tudo o que você precisa saber antes de blindar seu consultório.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between text-sm font-semibold text-white hover:text-cyan-400 transition"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-cyan-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ============================================================== */}
        {/* 9. BANNER FINAL CTA                                            */}
        {/* ============================================================== */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="relative bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 rounded-3xl p-8 sm:p-12 text-center text-slate-950 space-y-6 shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent pointer-events-none" />

            <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              Não espere o fiscal da Vigilância Sanitária bater na sua recepção para se organizar.
            </h2>
            <p className="text-cyan-100 max-w-2xl mx-auto text-sm sm:text-base font-medium">
              Comece hoje mesmo com 30 dias de garantia incondicional e os 8 POPs essenciais da RDC 1002 já configurados.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#planos"
                className="w-full sm:w-auto px-8 py-4 bg-slate-950 hover:bg-slate-900 text-white font-bold text-sm rounded-2xl shadow-xl transition transform active:scale-95 flex items-center justify-center space-x-2"
              >
                <span>COMEÇAR TESTE GRÁTIS DE 30 DIAS</span>
                <ArrowRight className="w-4 h-4 text-cyan-400" />
              </a>

              <a
                href="https://wa.me/5511999999999?text=Ol%C3%A1!%20Gostaria%20de%20tirar%20d%C3%BAvidas%20sobre%20o%20OdontoShield%20para%20minha%20cl%C3%ADnica."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-2xl shadow transition flex items-center justify-center space-x-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Falar no WhatsApp</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* ============================================================== */}
      {/* 10. FOOTER INSTITUCIONAL                                       */}
      {/* ============================================================== */}
      <footer className="bg-slate-950 border-t border-slate-800 text-slate-500 text-xs py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="font-bold text-slate-200 text-sm">OdontoShield</span>
              <span className="text-[10px] text-slate-500">| Governança & Perícia Sanitária Odontológica</span>
            </div>

            <div className="flex items-center space-x-6 text-slate-400">
              <a href="#como-funciona" className="hover:text-cyan-400 transition">Como Funciona</a>
              <a href="#planos" className="hover:text-cyan-400 transition">Planos</a>
              <a href="#garantia" className="hover:text-cyan-400 transition">Garantia</a>
              <Link href="/rastrear" className="hover:text-cyan-400 transition">Portal de Rastreabilidade</Link>
              <Link href="/" className="hover:text-cyan-400 transition">Painel da Clínica</Link>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-600">
            <div>
              © 2026 OdontoShield Tecnologias em Saúde Ltda. Todos os direitos reservados.
            </div>
            <div>
              Em conformidade com a RDC 1002/2025, RDC 15/2012 e RDC 63/2011 da Anvisa.
            </div>
          </div>
        </div>
      </footer>

      {/* Botão Flutuante do WhatsApp */}
      <a
        href="https://wa.me/5511999999999?text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20o%20OdontoShield%20para%20minha%20cl%C3%ADnica."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 p-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-full shadow-2xl shadow-emerald-500/40 transition transform hover:scale-110 flex items-center space-x-2 font-bold text-xs"
        title="Falar no WhatsApp"
      >
        <MessageSquare className="w-5 h-5" />
        <span className="hidden sm:inline">Dúvidas no WhatsApp</span>
      </a>
    </div>
  );
}
