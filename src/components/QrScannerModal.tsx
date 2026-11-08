'use client';

import React, { useState, useEffect } from 'react';
import { X, Camera, CheckCircle2, AlertCircle, User, Stethoscope, Check } from 'lucide-react';
import { SterilePackageItem } from '@/lib/types';

interface QrScannerModalProps {
  packages: SterilePackageItem[];
  onClose: () => void;
  onPackageConsumed: (pkgId: string, patientName: string, dentistName: string) => void;
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({ packages, onClose, onPackageConsumed }) => {
  const [scannedToken, setScannedToken] = useState<string>('');
  const [selectedPkg, setSelectedPkg] = useState<SterilePackageItem | null>(null);
  const [patientName, setPatientName] = useState<string>('');
  const [dentistName, setDentistName] = useState<string>('Dra. Camila Vasconcelos');
  const [chair, setChair] = useState<string>('Consultório 01');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // Fechar com a tecla ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSimulateScan = (pkg: SterilePackageItem) => {
    setScannedToken(pkg.qrCodeToken);
    setSelectedPkg(pkg);
  };

  const handleManualSearch = (token: string) => {
    setScannedToken(token);
    const found = packages.find((p) => p.qrCodeToken.toLowerCase() === token.trim().toLowerCase());
    setSelectedPkg(found || null);
  };

  const handleConfirmUsage = () => {
    if (!selectedPkg || !patientName.trim()) return;
    onPackageConsumed(selectedPkg.id, patientName, dentistName);
    setIsSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho Fixo */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 shrink-0">
          <div className="flex items-center space-x-2">
            <Camera className="w-5 h-5 text-cyan-400" />
            <h3 className="font-semibold text-slate-100 text-sm">Leitor PWA & Vínculo ao Prontuário</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo Rolável */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Simulação de Visor de Câmera */}
          <div className="relative bg-slate-950 border border-slate-800 rounded-xl overflow-hidden p-5 text-center">
            <div className="w-40 h-40 mx-auto border-2 border-dashed border-cyan-500/60 rounded-xl flex flex-col items-center justify-center p-4 relative group">
              <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-transparent to-cyan-500/10 animate-pulse" />
              <Camera className="w-9 h-9 text-cyan-400 mb-2" />
              <span className="text-[11px] text-slate-400">Aponte a câmera para o QR Code da embalagem</span>
            </div>

            {/* Atalho de teste rápido */}
            <div className="mt-3 pt-3 border-t border-slate-800/80">
              <span className="text-[11px] text-slate-400 block mb-2 font-medium">Ou clique em um pacote disponível:</span>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {packages
                  .filter((p) => p.status === 'STERILIZED')
                  .slice(0, 3)
                  .map((pkg) => (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => handleSimulateScan(pkg)}
                      className="px-2.5 py-1 text-[11px] bg-slate-800 hover:bg-cyan-950 hover:text-cyan-300 text-slate-300 border border-slate-700 hover:border-cyan-700 rounded-md transition"
                    >
                      {pkg.description.slice(0, 22)}...
                    </button>
                  ))}
              </div>
            </div>
          </div>

          {/* Dados do Pacote Escaneado */}
          {selectedPkg ? (
            <div className="bg-slate-800/50 border border-slate-700/80 rounded-xl p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
                    {selectedPkg.batchCode}
                  </span>
                  <h4 className="text-sm font-semibold text-slate-100">{selectedPkg.description}</h4>
                  <p className="text-xs text-slate-400">Tipo: {selectedPkg.packageType}</p>
                </div>
                {selectedPkg.status === 'IN_PROCESS' ? (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                    EM ANDAMENTO NA AUTOCLAVE
                  </span>
                ) : (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    ESTÉRIL & VÁLIDO
                  </span>
                )}
              </div>

              {selectedPkg.status === 'IN_PROCESS' && (
                <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-800/60 text-[11px] text-amber-300">
                  ⚠️ <strong>Atenção Sanitária:</strong> Este pacote pertence a uma carga em esterilização. Ele só poderá ser vinculado e aberto após o <strong>Passo 2 (Concluir & Liberar Lote)</strong> na CME.
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-700/60 pt-2 text-slate-300">
                <div>
                  <span className="text-slate-400 text-[10px] block">Data Esterilização:</span>
                  <span>{selectedPkg.packagedAt}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Validade da Barreira:</span>
                  <span className="text-cyan-300 font-semibold">{selectedPkg.expiresAt}</span>
                </div>
              </div>

              {/* Formulário de Vínculo com Paciente */}
              <div className="space-y-3 pt-2 border-t border-slate-700/60">
                <div>
                  <label className="text-xs font-medium text-slate-300 flex items-center space-x-1.5 mb-1">
                    <User className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Nome ou Prontuário do Paciente *</span>
                  </label>
                  <input
                    type="text"
                    disabled={selectedPkg.status === 'IN_PROCESS'}
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="Ex: Carlos Eduardo (Prontuário #4830)"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 disabled:opacity-50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-medium text-slate-300 flex items-center space-x-1 mb-1">
                      <Stethoscope className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Cirurgião-Dentista</span>
                    </label>
                    <select
                      disabled={selectedPkg.status === 'IN_PROCESS'}
                      value={dentistName}
                      onChange={(e) => setDentistName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 disabled:opacity-50"
                    >
                      <option value="Dra. Camila Vasconcelos">Dra. Camila Vasconcelos</option>
                      <option value="Dr. Rodrigo Mendes">Dr. Rodrigo Mendes (RT)</option>
                      <option value="Dr. Henrique Souza">Dr. Henrique Souza</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">
                      Cadeira / Consultório
                    </label>
                    <select
                      disabled={selectedPkg.status === 'IN_PROCESS'}
                      value={chair}
                      onChange={(e) => setChair(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 disabled:opacity-50"
                    >
                      <option value="Consultório 01">Consultório 01</option>
                      <option value="Consultório 02">Consultório 02</option>
                      <option value="Consultório 03">Consultório 03</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-800/30 border border-dashed border-slate-800 rounded-xl p-4 text-center text-xs text-slate-400">
              Nenhum pacote selecionado ainda. Aponte a câmera ou selecione um pacote acima.
            </div>
          )}

          {isSuccess && (
            <div className="bg-emerald-950/80 border border-emerald-700 text-emerald-200 text-xs p-3 rounded-xl flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Pacote consumido e rastreabilidade gravada com sucesso!</span>
            </div>
          )}
        </div>

        {/* Rodapé Fixo */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/90 flex justify-end space-x-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
          >
            Cancelar (ESC)
          </button>
          <button
            type="button"
            onClick={handleConfirmUsage}
            disabled={!selectedPkg || selectedPkg.status === 'IN_PROCESS' || !patientName.trim()}
            className="flex items-center space-x-2 px-4 py-2 text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 rounded-lg shadow-md transition"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirmar Abertura & Vínculo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
