'use client';

import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { SterilePackageItem } from '@/lib/types';
import {
  X,
  Printer,
  QrCode as QrIcon,
  CheckCircle2,
  PenTool,
  Grid,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Tag,
} from 'lucide-react';
import { PimacoSheetModal } from './PimacoSheetModal';

interface CmeLabelModalProps {
  pkg: SterilePackageItem | null;
  onClose: () => void;
}

export const CmeLabelModal: React.FC<CmeLabelModalProps> = ({ pkg, onClose }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [format, setFormat] = useState<'thermal' | 'short_code' | 'pimaco'>('thermal');
  const [thermalSize, setThermalSize] = useState<'50x30' | '40x25'>('50x30');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [isPimacoOpen, setIsPimacoOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const getPublicUrl = () => {
    if (!pkg) return '';
    const origin =
      typeof window !== 'undefined'
        ? window.location.origin
        : 'https://agente-clinicas.onrender.com';
    return `${origin}/rastrear?token=${encodeURIComponent(pkg.qrCodeToken)}`;
  };

  useEffect(() => {
    if (pkg) {
      const publicUrl = getPublicUrl();
      QRCode.toDataURL(publicUrl, {
        width: 200,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      }).then((url) => setQrDataUrl(url));
    }
  }, [pkg]);

  if (!pkg) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyShortCode = () => {
    navigator.clipboard.writeText(pkg.shortCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyPublicLink = () => {
    navigator.clipboard.writeText(getPublicUrl());
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-3 md:p-4 overflow-y-auto"
        onClick={onClose}
      >
        <div
          className="bg-white border border-[#E2ECE6] rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150 max-h-[95vh] flex flex-col my-auto text-slate-800"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Cabeçalho */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2ECE6] bg-gradient-to-b from-[#F4F8F6] to-white shrink-0">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-teal-700/20">
                <Tag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-1.5">
                  <span>Etiqueta CME com QR Code</span>
                  <span className="text-[10px] bg-teal-50 text-teal-800 border border-teal-300 px-2 py-0.5 rounded-full font-mono">
                    RDC 1002
                  </span>
                </h3>
                <p className="text-[11px] text-slate-500 truncate max-w-xs">{pkg.description}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-800 p-1.5 rounded-lg hover:bg-slate-100 transition"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Conteúdo */}
          <div className="p-5 md:p-6 space-y-4 overflow-y-auto flex-1">
            {/* Seletor de Modalidade (Térmica vs Manual vs Folha Pimaco) */}
            <div className="flex space-x-1 bg-[#F4F8F6] p-1 rounded-2xl text-xs border border-[#E2ECE6]">
              <button
                type="button"
                onClick={() => setFormat('thermal')}
                className={`flex-1 py-2 font-bold rounded-xl transition flex items-center justify-center space-x-1.5 ${
                  format === 'thermal'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Impressora Térmica</span>
              </button>

              <button
                type="button"
                onClick={() => setFormat('short_code')}
                className={`flex-1 py-2 font-medium rounded-xl transition flex items-center justify-center space-x-1.5 ${
                  format === 'short_code'
                    ? 'bg-teal-600 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>Caneta / Manual</span>
              </button>

              <button
                type="button"
                onClick={() => setIsPimacoOpen(true)}
                className="flex-1 py-2 font-medium rounded-xl transition flex items-center justify-center space-x-1.5 text-slate-600 hover:text-teal-700 hover:bg-white"
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Folha Pimaco A4</span>
              </button>
            </div>

            {/* Visualização: Opção Térmica */}
            {format === 'thermal' && (
              <div className="space-y-4">
                {/* Tamanho da Etiqueta */}
                <div className="flex items-center justify-between text-xs px-1">
                  <span className="text-slate-600 font-medium">Tamanho da Bobina Térmica:</span>
                  <div className="flex space-x-1 bg-[#F4F8F6] p-0.5 rounded-lg border border-[#E2ECE6]">
                    <button
                      type="button"
                      onClick={() => setThermalSize('50x30')}
                      className={`px-2.5 py-1 rounded text-[11px] font-semibold transition ${
                        thermalSize === '50x30'
                          ? 'bg-white text-teal-800 border border-teal-300 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      50 x 30 mm (Padrão Odonto)
                    </button>
                    <button
                      type="button"
                      onClick={() => setThermalSize('40x25')}
                      className={`px-2.5 py-1 rounded text-[11px] font-semibold transition ${
                        thermalSize === '40x25'
                          ? 'bg-white text-teal-800 border border-teal-300 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      40 x 25 mm (Compacto)
                    </button>
                  </div>
                </div>

                {/* Preview Fiel da Etiqueta Térmica */}
                <div className="flex justify-center py-2">
                  <div
                    id="printable-label"
                    className={`bg-white text-slate-950 border border-slate-300 rounded-lg p-2.5 shadow-md flex flex-col justify-between transition-all ${
                      thermalSize === '50x30' ? 'w-[280px] h-[170px]' : 'w-[240px] h-[150px]'
                    }`}
                  >
                    {/* Linha 1: Clínica / RDC / Criticidade */}
                    <div className="border-b border-black pb-1 flex justify-between items-start">
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-wider text-black leading-none">
                          ODONTOSHIELD CME
                        </div>
                        <div className="text-[8px] font-mono text-slate-700 font-semibold mt-0.5">
                          Lote: {pkg.batchCode} • {pkg.shortCode}
                        </div>
                      </div>
                      <span className="text-[7px] bg-black text-white font-black px-1.5 py-0.5 rounded uppercase">
                        {pkg.criticality === 'CRITICAL' ? 'Artigo Crítico' : 'Semicrítico'}
                      </span>
                    </div>

                    {/* Linha 2: QR Code e Dados do Pacote */}
                    <div className="flex items-center space-x-2 py-1">
                      {qrDataUrl ? (
                        <img
                          src={qrDataUrl}
                          alt="QR Code Rastreabilidade"
                          className={`${
                            thermalSize === '50x30' ? 'w-16 h-16' : 'w-13 h-13'
                          } border border-slate-300 rounded shrink-0`}
                        />
                      ) : (
                        <div className="w-16 h-16 bg-slate-200 rounded animate-pulse" />
                      )}
                      <div className="text-[9px] space-y-0.5 leading-tight flex-1">
                        <p className="font-extrabold text-black line-clamp-2">{pkg.description}</p>
                        <p className="text-[8px] text-slate-700">Emb: {pkg.packagedAt.slice(0, 10)}</p>
                        <p className="font-black text-red-700 text-[10px]">VAL: {pkg.expiresAt}</p>
                      </div>
                    </div>

                    {/* Linha 3: Rodapé Legal */}
                    <div className="border-t border-black pt-1 text-[7px] text-black flex justify-between font-mono font-semibold">
                      <span>RDC 1002/2025</span>
                      <span>{pkg.qrCodeToken}</span>
                    </div>
                  </div>
                </div>

                {/* Botões de Ação de Impressão */}
                <div className="flex flex-col sm:flex-row gap-2 justify-center pt-1">
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="flex items-center justify-center space-x-2 px-5 py-2.5 text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-md transition active:scale-98"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Imprimir na Térmica (Argox/Zebra/Elgin)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyPublicLink}
                    className="flex items-center justify-center space-x-1.5 px-3 py-2 text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-[#E2ECE6] rounded-xl transition shadow-2xs"
                    title="Copia o link público de verificação sanitária"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Link Copiado!' : 'Copiar Link Público'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Visualização: Opção Código Curto Manual (Identidade Grau Cirúrgico) */}
            {format === 'short_code' && (
              <div className="space-y-4">
                <div className="bg-white border-2 border-dashed border-teal-500 rounded-2xl p-6 text-center space-y-3 relative overflow-hidden shadow-xs">
                  <div className="absolute top-3 right-3">
                    <button
                      type="button"
                      onClick={handleCopyShortCode}
                      className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] flex items-center space-x-1 transition"
                    >
                      {copiedCode ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedCode ? 'Copiado!' : 'Copiar'}</span>
                    </button>
                  </div>

                  <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800 block">
                    ETIQUETA ADESIVA DE GRAU CIRÚRGICO (CANETA ATÓXICA)
                  </span>

                  <div className="font-mono text-4xl sm:text-5xl font-black text-slate-900 tracking-widest py-3 bg-[#F4F8F6] rounded-2xl border border-[#E2ECE6] shadow-inner">
                    {pkg.shortCode}
                  </div>

                  <div className="text-xs text-slate-600 space-y-1">
                    <p className="font-bold text-slate-900">{pkg.description}</p>
                    <div className="flex justify-center space-x-4 text-[11px] text-slate-600 pt-1">
                      <span>
                        Lote: <strong>{pkg.batchCode}</strong>
                      </span>
                      <span>
                        Validade: <strong className="text-rose-600">{pkg.expiresAt}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-teal-50/70 rounded-2xl p-3.5 border border-teal-200 text-xs text-teal-950 space-y-1.5">
                  <div className="flex items-center space-x-1.5 text-teal-900 font-bold">
                    <PenTool className="w-4 h-4 text-teal-700" />
                    <span>Instrução para a ASB / TSB (Zero Custo de Equipamento):</span>
                  </div>
                  <p className="text-[11px] text-teal-900/80 leading-relaxed">
                    Escreva o código <strong>{pkg.shortCode}</strong> e a data de validade <strong>{pkg.expiresAt}</strong> com caneta permanente atóxica diretamente sobre a área plástica externa do grau cirúrgico. No atendimento, o dentista pode apenas digitar este código no leitor em 2 segundos.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Rodapé com Link do Passaporte Público */}
          <div className="px-6 py-3.5 border-t border-[#E2ECE6] bg-[#F4F8F6] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-2 shrink-0">
            <a
              href={getPublicUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-700 hover:text-teal-800 font-semibold flex items-center space-x-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Ver Passaporte de Biossegurança Online</span>
            </a>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>

      {isPimacoOpen && <PimacoSheetModal pkg={pkg} onClose={() => setIsPimacoOpen(false)} />}
    </>
  );
};