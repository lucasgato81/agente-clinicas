'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Camera,
  CheckCircle2,
  AlertCircle,
  User,
  Stethoscope,
  Check,
  SwitchCamera,
  Upload,
  RefreshCw,
  Search,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { SterilePackageItem } from '@/lib/types';
import { Html5Qrcode } from 'html5-qrcode';

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
  const [procedureType, setProcedureType] = useState<string>('Cirurgia / Exodontia');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [manualCode, setManualCode] = useState<string>('');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Estados da Câmera
  const [cameraState, setCameraState] = useState<'starting' | 'running' | 'error' | 'stopped'>('starting');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [camerasList, setCamerasList] = useState<Array<{ id: string; label: string }>>([]);
  const [currentCameraIndex, setCurrentCameraIndex] = useState<number>(0);

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const readerElementId = 'html5-qr-reader-container';

  // Toca bip agradável de sucesso
  const playBeep = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const audioCtx = new AudioCtx();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.18);
    } catch {
      // Ignora se áudio for bloqueado pelo navegador
    }
  };

  // Vibração tátil no celular
  const triggerHaptic = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([80, 40, 80]);
    }
  };

  // Trata código detectado (seja por câmera, upload ou digitação)
  const processScannedCode = (rawCode: string) => {
    let cleanCode = rawCode.trim();

    // Se for URL completa (ex: https://.../rastrear?token=ODONTO-20261024-001)
    if (cleanCode.includes('token=')) {
      cleanCode = cleanCode.split('token=')[1].split('&')[0];
    } else if (cleanCode.includes('/rastrear/')) {
      cleanCode = cleanCode.split('/rastrear/')[1].split('?')[0];
    }

    setScannedToken(cleanCode);

    // Busca pacote correspondente
    const found = packages.find(
      (p) =>
        p.qrCodeToken.toLowerCase() === cleanCode.toLowerCase() ||
        p.shortCode.toLowerCase() === cleanCode.toLowerCase() ||
        p.id.toLowerCase() === cleanCode.toLowerCase()
    );

    if (found) {
      playBeep();
      triggerHaptic();
      setSelectedPkg(found);
      setCameraError(null);
    } else {
      setSelectedPkg(null);
      setCameraError(`Código "${cleanCode}" lido com sucesso, mas nenhum pacote com este código foi localizado no inventário.`);
    }
  };

  // Inicializa o leitor de câmera
  useEffect(() => {
    let isMounted = true;

    const startScanner = async () => {
      try {
        setCameraState('starting');
        setCameraError(null);

        // Aguarda renderização do elemento no DOM
        await new Promise((r) => setTimeout(r, 200));

        const readerElem = document.getElementById(readerElementId);
        if (!readerElem || !isMounted) return;

        // Limpa instância prévia se houver
        if (scannerRef.current) {
          try {
            await scannerRef.current.stop();
          } catch {
            // Silencioso
          }
          scannerRef.current.clear();
        }

        const html5QrCode = new Html5Qrcode(readerElementId);
        scannerRef.current = html5QrCode;

        // Lista câmeras disponíveis
        try {
          const devices = await Html5Qrcode.getCameras();
          if (devices && devices.length > 0 && isMounted) {
            setCamerasList(devices);
          }
        } catch {
          // Navegador pode solicitar permissão antes de listar
        }

        const config = {
          fps: 12,
          qrbox: { width: 230, height: 230 },
          aspectRatio: 1.0,
        };

        // Inicia com a câmera traseira (environment) ou ID disponível
        await html5QrCode.start(
          { facingMode: 'environment' },
          config,
          (decodedText) => {
            if (isMounted) {
              processScannedCode(decodedText);
            }
          },
          () => {
            // Falhas de frame normais enquanto busca QR são ignoradas
          }
        );

        if (isMounted) {
          setCameraState('running');
        }
      } catch (err: unknown) {
        if (isMounted) {
          console.warn('[QR SCANNER CAMERA ERROR]', err);
          setCameraState('error');
          const errorString = String(err);
          if (errorString.includes('NotAllowedError') || errorString.includes('Permission')) {
            setCameraError('Permissão de acesso à câmera foi negada. Permita o uso da câmera no navegador ou utilize a busca manual.');
          } else {
            setCameraError('Nenhuma câmera encontrada ou dispositivo em uso por outro aplicativo.');
          }
        }
      }
    };

    startScanner();

    // Limpeza ao desmontar
    return () => {
      isMounted = false;
      if (scannerRef.current) {
        if (scannerRef.current.isScanning) {
          scannerRef.current
            .stop()
            .then(() => {
              scannerRef.current?.clear();
            })
            .catch(() => {
              // Silencioso ao fechar
            });
        }
      }
    };
  }, []);

  // Alternar entre câmeras (frontal e traseira)
  const handleSwitchCamera = async () => {
    if (!scannerRef.current || camerasList.length < 2) return;

    try {
      if (scannerRef.current.isScanning) {
        await scannerRef.current.stop();
      }
      const nextIndex = (currentCameraIndex + 1) % camerasList.length;
      setCurrentCameraIndex(nextIndex);
      const nextCameraId = camerasList[nextIndex].id;

      await scannerRef.current.start(
        nextCameraId,
        { fps: 12, qrbox: { width: 230, height: 230 } },
        (decodedText) => processScannedCode(decodedText),
        () => {}
      );
      setCameraState('running');
    } catch (e) {
      console.warn('Erro ao alternar câmera:', e);
    }
  };

  // Escanear arquivo de imagem (Upload de foto do QR Code)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !scannerRef.current) return;

    try {
      const decodedText = await scannerRef.current.scanFile(file, true);
      processScannedCode(decodedText);
    } catch {
      setCameraError('Não foi possível identificar um QR Code válido na imagem selecionada.');
    }
  };

  // Fechar com a tecla ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSimulateScan = (pkg: SterilePackageItem) => {
    processScannedCode(pkg.qrCodeToken);
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    processScannedCode(manualCode);
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-3 md:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white border border-[#E2ECE6] rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150 max-h-[95vh] flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho Fixo */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2ECE6] bg-white shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-teal-900/10">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-1.5">
                <span>Leitor de QR Code & Vínculo ao Paciente</span>
                <span className="text-[10px] bg-teal-50 text-teal-800 border border-teal-200 px-1.5 py-0.2 rounded font-mono font-bold">
                  RDC 1002
                </span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Aponte a câmera para a embalagem estéril para vincular em 2 segundos
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="text-slate-400 hover:text-teal-700 p-1.5 rounded-lg hover:bg-slate-100 transition"
              title={soundEnabled ? 'Silenciar Bip' : 'Ativar Bip Sonoro'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-teal-600" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar"
              className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Corpo Rolável */}
        <div className="p-4 md:p-6 space-y-4 overflow-y-auto flex-1 bg-white">
          {/* Seção Superior: Visor de Câmera Real com html5-qrcode */}
          <div className="relative bg-[#F4F8F6] border border-[#E2ECE6] rounded-2xl overflow-hidden p-3 text-center">
            {/* Contêiner da Câmera */}
            <div className="relative mx-auto max-w-sm rounded-xl overflow-hidden bg-black/80 aspect-square flex items-center justify-center shadow-inner">
              <div id={readerElementId} className="w-full h-full" />

              {/* Mira visual animada de scanner */}
              {cameraState === 'running' && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="w-56 h-56 border-2 border-teal-400/90 rounded-2xl relative shadow-[0_0_15px_rgba(20,184,166,0.3)]">
                    {/* Linha laser de escaneamento */}
                    <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-teal-400 to-transparent shadow-[0_0_12px_#2dd4bf] animate-bounce" />
                    {/* Cantoneiras */}
                    <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-teal-400" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-teal-400" />
                    <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-teal-400" />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-teal-400" />
                  </div>
                </div>
              )}

              {/* Estado de Carregando / Erro */}
              {cameraState === 'starting' && (
                <div className="absolute inset-0 bg-slate-900/80 flex flex-col items-center justify-center space-y-2 text-white text-xs">
                  <RefreshCw className="w-6 h-6 animate-spin text-teal-400" />
                  <span>Iniciando câmera...</span>
                </div>
              )}

              {cameraState === 'error' && (
                <div className="absolute inset-0 bg-slate-900/95 p-4 flex flex-col items-center justify-center text-center space-y-3">
                  <Camera className="w-10 h-10 text-slate-500" />
                  <p className="text-xs text-amber-300 max-w-xs">{cameraError || 'Câmera não disponível.'}</p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow transition"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Carregar Foto do QR</span>
                  </button>
                </div>
              )}
            </div>

            {/* Barra de Controles da Câmera */}
            <div className="mt-3 flex items-center justify-between text-xs text-slate-600 px-2">
              <div className="flex items-center space-x-2">
                {camerasList.length > 1 && (
                  <button
                    type="button"
                    onClick={handleSwitchCamera}
                    className="flex items-center space-x-1 px-2.5 py-1 bg-white hover:bg-slate-50 border border-[#E2ECE6] rounded-lg text-teal-700 font-medium transition shadow-xs"
                    title="Alternar entre câmera frontal e traseira"
                  >
                    <SwitchCamera className="w-3.5 h-3.5 text-teal-600" />
                    <span>Alternar Câmera</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center space-x-1 px-2.5 py-1 bg-white hover:bg-slate-50 border border-[#E2ECE6] rounded-lg text-slate-700 font-medium transition shadow-xs"
                >
                  <Upload className="w-3.5 h-3.5 text-slate-500" />
                  <span>Foto/Arquivo</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>

              <span className="text-[11px] text-teal-700 font-mono font-semibold">
                {cameraState === 'running' ? '● Câmera Ativa' : '○ Standby'}
              </span>
            </div>

            {/* Busca Manual / Digitação de Código Curto */}
            <form onSubmit={handleManualSearch} className="mt-3 pt-3 border-t border-[#E2ECE6] flex gap-2">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  placeholder="Ou digite o Código Curto (ex: PK-8291 ou ODONTO-...)"
                  className="w-full bg-white border border-[#E2ECE6] rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 font-mono"
                />
              </div>
              <button
                type="submit"
                className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-xs transition shadow-xs shrink-0"
              >
                Localizar
              </button>
            </form>

            {/* Atalhos Rápidos para Demonstração */}
            <div className="mt-2.5 pt-2 border-t border-[#E2ECE6] flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Atalhos rápidos para teste:</span>
              <div className="flex flex-wrap gap-1">
                {packages
                  .filter((p) => p.status === 'STERILIZED')
                  .slice(0, 3)
                  .map((pkg) => (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => handleSimulateScan(pkg)}
                      className="px-2 py-0.5 text-[10px] bg-white hover:bg-teal-50 hover:text-teal-800 text-slate-700 border border-[#E2ECE6] hover:border-teal-300 rounded-md transition shadow-2xs"
                    >
                      {pkg.shortCode} ({pkg.description.slice(0, 14)}...)
                    </button>
                  ))}
              </div>
            </div>
          </div>

          {/* Dados do Pacote Escaneado */}
          {selectedPkg ? (
            <div className="bg-teal-50/50 border border-teal-200 rounded-2xl p-4 space-y-3 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] uppercase font-bold text-teal-800 tracking-wider font-mono">
                      {selectedPkg.batchCode} • {selectedPkg.shortCode}
                    </span>
                    <span className="text-[10px] bg-white border border-[#E2ECE6] text-slate-700 px-1.5 py-0.5 rounded font-medium">
                      {selectedPkg.criticality === 'CRITICAL' ? 'Artigo Crítico' : 'Semicrítico'}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mt-0.5">{selectedPkg.description}</h4>
                  <p className="text-xs text-slate-600">Embalagem: {selectedPkg.packageType}</p>
                </div>

                {selectedPkg.status === 'IN_PROCESS' ? (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200">
                    EM ANDAMENTO NA AUTOCLAVE
                  </span>
                ) : (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#DCFCE7] text-emerald-800 border border-emerald-300 flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>ESTÉRIL & VÁLIDO</span>
                  </span>
                )}
              </div>

              {selectedPkg.status === 'IN_PROCESS' && (
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                  <span>
                    Este pacote ainda está em ciclo de autoclave. Ele só pode ser aberto após a liberação da carga na CME.
                  </span>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs border-t border-teal-100 pt-2.5 text-slate-700 bg-white p-2.5 rounded-xl border border-[#E2ECE6]">
                <div>
                  <span className="text-slate-500 text-[10px] block">Data Esterilização:</span>
                  <span className="font-semibold text-slate-800">{selectedPkg.packagedAt}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Validade da Barreira:</span>
                  <span className="text-teal-700 font-bold">{selectedPkg.expiresAt}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Lote CME:</span>
                  <span className="font-mono text-teal-800 font-bold">{selectedPkg.batchCode}</span>
                </div>
              </div>

              {/* Formulário de Vínculo com o Paciente */}
              <div className="space-y-3 pt-2 border-t border-teal-200/70">
                <div>
                  <label className="text-xs font-semibold text-slate-800 flex items-center space-x-1.5 mb-1">
                    <User className="w-3.5 h-3.5 text-teal-600" />
                    <span>Nome ou Prontuário do Paciente *</span>
                  </label>
                  <input
                    type="text"
                    disabled={selectedPkg.status === 'IN_PROCESS'}
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="Ex: Carlos Eduardo Silveira (Prontuário #4830)"
                    autoFocus
                    className="w-full bg-white border border-[#E2ECE6] rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 disabled:opacity-50"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="text-xs font-medium text-slate-700 flex items-center space-x-1 mb-1">
                      <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                      <span>Cirurgião-Dentista</span>
                    </label>
                    <select
                      disabled={selectedPkg.status === 'IN_PROCESS'}
                      value={dentistName}
                      onChange={(e) => setDentistName(e.target.value)}
                      className="w-full bg-white border border-[#E2ECE6] rounded-xl px-2 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-teal-600 disabled:opacity-50"
                    >
                      <option value="Dr. Lucas Ribeiro (RT)">Dr. Lucas Ribeiro (RT)</option>
                      <option value="Dra. Camila Vasconcelos">Dra. Camila Vasconcelos</option>
                      <option value="Dr. Henrique Souza">Dr. Henrique Souza</option>
                      <option value="Dr. Rodrigo Mendes">Dr. Rodrigo Mendes</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-700 block mb-1">
                      Cadeira / Consultório
                    </label>
                    <select
                      disabled={selectedPkg.status === 'IN_PROCESS'}
                      value={chair}
                      onChange={(e) => setChair(e.target.value)}
                      className="w-full bg-white border border-[#E2ECE6] rounded-xl px-2 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-teal-600 disabled:opacity-50"
                    >
                      <option value="Consultório 01 (Cirúrgico)">Consultório 01 (Cirúrgico)</option>
                      <option value="Consultório 02 (Clínica Geral)">Consultório 02 (Clínica Geral)</option>
                      <option value="Consultório 03 (Ortodontia)">Consultório 03 (Ortodontia)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-700 block mb-1">
                      Procedimento
                    </label>
                    <select
                      disabled={selectedPkg.status === 'IN_PROCESS'}
                      value={procedureType}
                      onChange={(e) => setProcedureType(e.target.value)}
                      className="w-full bg-white border border-[#E2ECE6] rounded-xl px-2 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-teal-600 disabled:opacity-50"
                    >
                      <option value="Cirurgia / Exodontia">Cirurgia / Exodontia</option>
                      <option value="Implante Dentário">Implante Dentário</option>
                      <option value="Endodontia (Canal)">Endodontia (Canal)</option>
                      <option value="Periodontia / Raspagem">Periodontia / Raspagem</option>
                      <option value="Dentística / Restauração">Dentística / Restauração</option>
                      <option value="Profilaxia / Limpeza">Profilaxia / Limpeza</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#F8FAF9] border border-dashed border-[#E2ECE6] rounded-2xl p-6 text-center text-xs text-slate-500 space-y-1">
              <Camera className="w-6 h-6 mx-auto text-teal-600/70 mb-1" />
              <p className="font-semibold text-slate-700">Nenhum pacote selecionado</p>
              <p className="text-[11px] text-slate-500">
                Aponte a câmera para o QR Code da embalagem ou use os atalhos acima para testar.
              </p>
            </div>
          )}

          {isSuccess && (
            <div className="bg-[#DCFCE7] border border-emerald-300 text-emerald-900 text-xs p-3.5 rounded-2xl flex items-center space-x-2.5 animate-in zoom-in-95 duration-150">
              <Check className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold">Abertura e Vínculo Confirmados com Sucesso!</p>
                <p className="text-[11px] text-emerald-800">
                  Rastreabilidade RDC 1002 gravada e associada ao prontuário do paciente.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Rodapé Fixo */}
        <div className="px-5 py-4 border-t border-[#E2ECE6] bg-[#F8FAF9] flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-xl transition"
          >
            Cancelar (ESC)
          </button>
          <button
            type="button"
            onClick={handleConfirmUsage}
            disabled={!selectedPkg || selectedPkg.status === 'IN_PROCESS' || !patientName.trim()}
            className="flex items-center space-x-2 px-5 py-2.5 text-xs font-bold bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl shadow-md transition active:scale-98"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirmar Abertura & Vincular (2s)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
