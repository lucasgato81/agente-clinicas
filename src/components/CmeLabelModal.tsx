'use client';

import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { SterilePackageItem } from '@/lib/types';
import { X, Printer, QrCode as QrIcon, CheckCircle2, PenTool, Grid, Copy, Check } from 'lucide-react';
import { PimacoSheetModal } from './PimacoSheetModal';

interface CmeLabelModalProps {
  pkg: SterilePackageItem | null;
  onClose: () => void;
}

export const CmeLabelModal: React.FC<CmeLabelModalProps> = ({ pkg, onClose }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [format, setFormat] = useState<'short_code' | 'thermal' | 'pimaco'>('short_code');
  const [copied, setCopied] = useState<boolean>(false);
  const [isPimacoOpen, setIsPimacoOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (pkg) {
      QRCode.toDataURL(pkg.qrCodeToken, {
        width: 180,
        margin: 1,
        color: {
          dark: '#0f172a',
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
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
        onClick={onClose}
      >
        <div
          className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Cabeçalho */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 shrink-0">
            <div className="flex items-center space-x-2">
              <QrIcon className="w-5 h-5 text-cyan-400" />
              <div>
                <h3 className="font-semibold text-slate-100 text-sm">Identificação & Rastreabilidade do Pacote</h3>
                <p className="text-[11px] text-slate-400">{pkg.description.slice(0, 36)}...</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Conteúdo */}
          <div className="p-6 space-y-5 overflow-y-auto flex-1">
            {/* Seletor de Modalidade (Zero Custo vs Térmica vs Folha A4) */}
            <div className="flex space-x-1.5 bg-slate-950 p-1 rounded-xl text-xs border border-slate-800">
              <button
                onClick={() => setFormat('short_code')}
                className={`flex-1 py-2 font-medium rounded-lg transition flex items-center justify-center space-x-1 ${
                  format === 'short_code'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>Código Curto (Caneta)</span>
              </button>

              <button
                onClick={() => setFormat('thermal')}
                className={`flex-1 py-2 font-medium rounded-lg transition flex items-center justify-center space-x-1 ${
                  format === 'thermal'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Térmica (50x30)</span>
              </button>

              <button
                onClick={() => setIsPimacoOpen(true)}
                className="flex-1 py-2 font-medium rounded-lg transition flex items-center justify-center space-x-1 text-slate-400 hover:text-cyan-300 hover:bg-slate-900"
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Folha Pimaco A4</span>
              </button>
            </div>

            {/* Visualização: Opção 1 - Código Curto (Zero Custo de Hardware) */}
            {format === 'short_code' && (
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-slate-950 to-slate-900 border-2 border-cyan-500/50 rounded-2xl p-6 text-center space-y-3 relative overflow-hidden">
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={handleCopyShortCode}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] flex items-center space-x-1 transition"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? 'Copiado!' : 'Copiar'}</span>
                    </button>
                  </div>

                  <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 block">
                    IDENTIFICADOR COMPACTO MANUAL
                  </span>

                  <div className="font-mono text-4xl sm:text-5xl font-black text-white tracking-widest py-2 bg-slate-950 rounded-xl border border-slate-800 shadow-inner">
                    {pkg.shortCode}
                  </div>

                  <div className="text-xs text-slate-300 space-y-1">
                    <p className="font-semibold text-slate-200">{pkg.description}</p>
                    <div className="flex justify-center space-x-4 text-[11px] text-slate-400 pt-1">
                      <span>Lote: <strong>{pkg.batchCode}</strong></span>
                      <span>Validade: <strong className="text-red-400">{pkg.expiresAt}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950/70 rounded-xl p-3 border border-slate-800 text-xs text-slate-300 space-y-1.5">
                  <div className="flex items-center space-x-1.5 text-cyan-400 font-semibold">
                    <PenTool className="w-4 h-4" />
                    <span>Instrução para a ASB (Zero Custo de Impressora)</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Escreva o código acima <strong>{pkg.shortCode}</strong> e a data de validade <strong>{pkg.expiresAt}</strong> com caneta permanente atóxica diretamente sobre a área plástica externa do grau cirúrgico. O dentista poderá digitar este código diretamente no prontuário para manter a rastreabilidade RDC 1002.
                  </p>
                </div>
              </div>
            )}

            {/* Visualização: Opção 2 - Etiqueta Térmica 50x30mm */}
            {format === 'thermal' && (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div
                    id="printable-label"
                    className="bg-white text-slate-900 border border-slate-300 rounded-lg p-3 w-[270px] shadow-lg flex flex-col justify-between"
                    style={{ minHeight: '160px' }}
                  >
                    <div className="border-b border-slate-300 pb-1.5 mb-1.5 flex justify-between items-start">
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-wider text-slate-900">
                          ODONTOSHIELD CME
                        </div>
                        <div className="text-[9px] font-bold text-cyan-800 flex items-center space-x-1">
                          <span>{pkg.shortCode}</span>
                          <span className="text-slate-500 font-normal">({pkg.batchCode})</span>
                        </div>
                      </div>
                      <span className="text-[8px] bg-slate-200 font-bold px-1 py-0.5 rounded text-slate-800">
                        {pkg.criticality === 'CRITICAL' ? 'CRÍTICO' : 'SEMICRÍTICO'}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      {qrDataUrl && (
                        <img
                          src={qrDataUrl}
                          alt="QR Code Lote"
                          className="w-16 h-16 border border-slate-200 rounded shrink-0"
                        />
                      )}
                      <div className="text-[9px] space-y-0.5 leading-tight flex-1">
                        <p className="font-bold text-slate-900 line-clamp-2">{pkg.description}</p>
                        <p className="text-slate-600">Emb: {pkg.packagedAt.slice(0, 10)}</p>
                        <p className="font-extrabold text-red-700">VAL: {pkg.expiresAt}</p>
                      </div>
                    </div>

                    <div className="border-t border-slate-200 pt-1 mt-1.5 text-[7px] text-slate-500 flex justify-between font-mono">
                      <span>RDC 1002/2025</span>
                      <span>{pkg.qrCodeToken}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={handlePrint}
                    className="flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-lg shadow-md transition"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Disparar Impressão Térmica</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Rodapé com Ações */}
          <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between shrink-0">
            <button
              onClick={() => setIsPimacoOpen(true)}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center space-x-1"
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Abrir Template A4 (30 Etiquetas Pimaco)</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>

      {isPimacoOpen && (
        <PimacoSheetModal pkg={pkg} onClose={() => setIsPimacoOpen(false)} />
      )}
    </>
  );
};
