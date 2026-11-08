'use client';

import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { X, Printer, Grid, FileText, CheckCircle2 } from 'lucide-react';
import { SterilePackageItem } from '@/lib/types';

interface PimacoSheetModalProps {
  pkg: SterilePackageItem;
  onClose: () => void;
}

export const PimacoSheetModal: React.FC<PimacoSheetModalProps> = ({ pkg, onClose }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [labelsCount, setLabelsCount] = useState<number>(30); // Folha padrão Pimaco 6180 (3x10 = 30)

  useEffect(() => {
    QRCode.toDataURL(pkg.qrCodeToken, {
      width: 90,
      margin: 0,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    }).then((url) => setQrDataUrl(url));
  }, [pkg]);

  const handlePrint = () => {
    window.print();
  };

  const labelsArray = Array.from({ length: labelsCount });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full my-6 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Barra Superior */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-2">
            <Grid className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="font-semibold text-sm">
                Folha A4 de Etiquetas Pimaco (Zero Custo de Hardware)
              </h3>
              <p className="text-[11px] text-slate-400">
                Padrão 3 colunas x 10 linhas (Pimaco 6180 / 6081) para impressoras jato de tinta ou laser comuns
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-xs">
              <span className="text-slate-400">Qtd Etiquetas:</span>
              <select
                value={labelsCount}
                onChange={(e) => setLabelsCount(parseInt(e.target.value))}
                className="bg-transparent text-cyan-400 font-bold focus:outline-none cursor-pointer"
              >
                <option value={10}>10 etiquetas</option>
                <option value={20}>20 etiquetas</option>
                <option value={30}>30 etiquetas (Folha Inteira)</option>
              </select>
            </div>

            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-xs shadow-md transition"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir Folha A4</span>
            </button>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Pré-visualização da Folha A4 */}
        <div className="p-6 overflow-y-auto bg-slate-950 flex justify-center">
          <div
            id="pimaco-sheet-container"
            className="bg-white text-slate-900 p-4 rounded-lg shadow-xl w-full max-w-[800px] border border-slate-300"
            style={{ minHeight: '1000px' }}
          >
            <div className="text-[10px] text-slate-400 border-b border-slate-200 pb-1 mb-3 flex justify-between font-mono">
              <span>ODONTOSHIELD • RDC 1002/2025 • MODELO PIMACO 6180 (30 ETIQUETAS)</span>
              <span>LOTE: {pkg.batchCode}</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {labelsArray.map((_, idx) => (
                <div
                  key={idx}
                  className="border border-dashed border-slate-300 rounded p-1.5 flex flex-col justify-between text-[8px] bg-slate-50 hover:bg-white transition"
                  style={{ height: '95px' }}
                >
                  <div className="flex justify-between items-start leading-tight">
                    <div>
                      <span className="font-extrabold text-cyan-900 block text-[9px]">
                        {pkg.shortCode}
                      </span>
                      <span className="font-mono text-[7px] text-slate-500">{pkg.batchCode}</span>
                    </div>
                    <span className="font-bold text-[7px] bg-slate-200 px-1 py-0.2 rounded text-slate-800">
                      {pkg.criticality === 'CRITICAL' ? 'CRÍTICO' : 'SEMICRÍTICO'}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1.5 my-1">
                    {qrDataUrl && (
                      <img
                        src={qrDataUrl}
                        alt="QR Code"
                        className="w-10 h-10 border border-slate-300 rounded shrink-0"
                      />
                    )}
                    <div className="leading-tight overflow-hidden">
                      <p className="font-bold text-slate-900 line-clamp-2 text-[8px]">
                        {pkg.description}
                      </p>
                      <p className="text-slate-600 text-[7px]">Emb: {pkg.packagedAt.slice(0, 10)}</p>
                      <p className="font-extrabold text-red-700 text-[8px]">VAL: {pkg.expiresAt}</p>
                    </div>
                  </div>

                  <div className="text-[6.5px] text-slate-400 border-t border-slate-200 pt-0.5 flex justify-between font-mono">
                    <span>OdontoShield</span>
                    <span>Anvisa RDC 1002</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
