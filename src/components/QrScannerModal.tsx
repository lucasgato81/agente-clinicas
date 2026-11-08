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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 md:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150 max-h-[95vh] flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho Fixo */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/90 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-950/50">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm flex items-center space-x-1.5">
                <span>Leitor de QR Code & Vínculo ao Paciente</span>
                <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800 px-1.5 py-0.2 rounded font-mono">
                  RDC 1002
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Aponte a câmera para a embalagem estéril para vincular em 2 segundos
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
              title={soundEnabled ? 'Silenciar Bip' : 'Ativar Bip Sonoro'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar"
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Corpo Rolável */}
        <div className="p-4 md:p-6 space-y-4 overflow-y-auto flex-1">
          {/* Seção Superior: Visor de Câmera Real com html5-qrcode */}
          <div className="relative bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden p-3 text-center">
            {/* Contêiner da Câmera */}
            <div className="relative mx-auto max-w-sm rounded-xl overflow-hidden bg-black/60 aspect-square flex items-center justify-center">
              <div id={readerElementId} className="w-full h-full" />

              {/* Mira visual animada de scanner */}
              {cameraState === 'running' && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="w-56 h-56 border-2 border-cyan-400/80 rounded-2xl relative">
                    {/* Linha laser de escaneamento */}
                    <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#22d3ee] animate-bounce" />
                    {/* Cantoneiras */}
                    <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
                    <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-cyan-400" />
                  </div>
                </div>
              )}

              {/* Estado de Carregando / Erro */}
              {cameraState === 'starting' && (
                <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center space-y-2 text-slate-400 text-xs">
                  <RefreshCw className="w-6 h-6 animate-spin text-cyan-400" />
                  <span>Iniciando câmera...</span>
                </div>
              )}

              {cameraState === 'error' && (
                <div className="absolute inset-0 bg-slate-950/95 p-4 flex flex-col items-center justify-center text-center space-y-3">
                  <Camera className="w-10 h-10 text-slate-600" />
                  <p className="text-xs text-amber-300 max-w-xs">{cameraError || 'Câmera não disponível.'}</p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold shadow transition"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Carregar Foto do QR</span>
                  </button>
                </div>
              )}
            </div>

            {/* Barra de Controles da Câmera */}
            <div className="mt-3 flex items-center justify-between text-xs text-slate-400 px-2">
              <div className="flex items-center space-x-2">
                {camerasList.length > 1 && (
                  <button
                    type="button"
                    onClick={handleSwitchCamera}
                    className="flex items-center space-x-1 px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-cyan-400 hover:text-cyan-300 transition"
                    title="Alternar entre câmera frontal e traseira"
                  >
                    <SwitchCamera className="w-3.5 h-3.5" />
                    <span>Alternar Câmera</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center space-x-1 px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-300 hover:text-white transition"
                >
                  <Upload className="w-3.5 h-3.5" />
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

              <span className="text-[11px] text-cyan-400 font-mono">
                {cameraState === 'running' ? '● Câmera Ativa' : '○ Standby'}
              </span>
            </div>

            {/* Busca Manual / Digitação de Código Curto */}
            <form onSubmit={handleManualSearch} className="mt-3 pt-3 border-t border-slate-800/80 flex gap-2">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  placeholder="Ou digite o Código Curto (ex: PK-8291 ou ODONTO-...)"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>
              <button
                type="submit"
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs transition shrink-0"
              >
                Localizar
              </button>
            </form>

            {/* Atalhos Rápidos para Demonstração */}
            <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Atalhos rápidos para teste:</span>
              <div className="flex flex-wrap gap-1">
                {packages
                  .filter((p) => p.status === 'STERILIZED')
                  .slice(0, 3)
                  .map((pkg) => (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => handleSimulateScan(pkg)}
                      className="px-2 py-0.5 text-[10px] bg-slate-900 hover:bg-cyan-950 hover:text-cyan-300 text-slate-400 border border-slate-800 hover:border-cyan-700 rounded-md transition"
                    >
                      {pkg.shortCode} ({pkg.description.slice(0, 14)}...)
                    </button>
                  ))}
              </div>
            </div>
          </div>

          {/* Dados do Pacote Escaneado */}
          {selectedPkg ? (
            <div className="bg-slate-950/80 border border-cyan-500/40 rounded-2xl p-4 space-y-3 shadow-lg ring-1 ring-cyan-500/20 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider font-mono">
                      {selectedPkg.batchCode} • {selectedPkg.shortCode}
                    </span>
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                      {selectedPkg.criticality === 'CRITICAL' ? 'Artigo Crítico' : 'Semicrítico'}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white mt-0.5">{selectedPkg.description}</h4>
                  <p className="text-xs text-slate-400">Embalagem: {selectedPkg.packageType}</p>
                </div>

                {selectedPkg.status === 'IN_PROCESS' ? (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-950 text-amber-300 border border-amber-800">
                    EM ANDAMENTO NA AUTOCLAVE
                  </span>
                ) : (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>ESTÉRIL & VÁLIDO</span>
                  </span>
                )}
              </div>

              {selectedPkg.status === 'IN_PROCESS' && (
                <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-800/60 text-[11px] text-amber-300 flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>
                    Este pacote ainda está em ciclo de autoclave. Ele só pode ser aberto após a liberação da carga na CME.
                  </span>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs border-t border-slate-800 pt-2.5 text-slate-300 bg-slate-900/60 p-2.5 rounded-xl">
                <div>
                  <span className="text-slate-400 text-[10px] block">Data Esterilização:</span>
                  <span className="font-medium">{selectedPkg.packagedAt}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Validade da Barreira:</span>
                  <span className="text-cyan-300 font-bold">{selectedPkg.expiresAt}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Lote CME:</span>
                  <span className="font-mono text-cyan-300 font-bold">{selectedPkg.batchCode}</span>
                </div>
              </div>

              {/* Formulário de Vínculo com o Paciente */}
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <div>
                  <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5 mb-1">
                    <User className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Nome ou Prontuário do Paciente *</span>
                  </label>
                  <input
                    type="text"
                    disabled={selectedPkg.status === 'IN_PROCESS'}
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="Ex: Carlos Eduardo Silveira (Prontuário #4830)"
                    autoFocus
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 disabled:opacity-50"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="text-xs font-medium text-slate-300 flex items-center space-x-1 mb-1">
                      <Stethoscope className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Cirurgião-Dentista</span>
                    </label>
                    <select
                      disabled={selectedPkg.status === 'IN_PROCESS'}
                      value={dentistName}
                      onChange={(e) => setDentistName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 disabled:opacity-50"
                    >
                      <option value="Dr. Lucas Ribeiro (RT)">Dr. Lucas Ribeiro (RT)</option>
                      <option value="Dra. Camila Vasconcelos">Dra. Camila Vasconcelos</option>
                      <option value="Dr. Henrique Souza">Dr. Henrique Souza</option>
                      <option value="Dr. Rodrigo Mendes">Dr. Rodrigo Mendes</option>
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
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 disabled:opacity-50"
                    >
                      <option value="Consultório 01 (Cirúrgico)">Consultório 01 (Cirúrgico)</option>
                      <option value="Consultório 02 (Clínica Geral)">Consultório 02 (Clínica Geral)</option>
                      <option value="Consultório 03 (Ortodontia)">Consultório 03 (Ortodontia)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">
                      Procedimento
                    </label>
                    <select
                      disabled={selectedPkg.status === 'IN_PROCESS'}
                      value={procedureType}
                      onChange={(e) => setProcedureType(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 disabled:opacity-50"
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
            <div className="bg-slate-950/40 border border-dashed border-slate-800 rounded-2xl p-6 text-center text-xs text-slate-400 space-y-1">
              <Camera className="w-6 h-6 mx-auto text-slate-600 mb-1" />
              <p className="font-medium text-slate-300">Nenhum pacote selecionado</p>
              <p className="text-[11px] text-slate-500">
                Aponte a câmera para o QR Code da embalagem ou use os atalhos acima para testar.
              </p>
            </div>
          )}

          {isSuccess && (
            <div className="bg-emerald-950/90 border border-emerald-600 text-emerald-200 text-xs p-3.5 rounded-2xl flex items-center space-x-2.5 animate-in zoom-in-95 duration-150">
              <Check className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <p className="font-bold">Abertura e Vínculo Confirmados com Sucesso!</p>
                <p className="text-[11px] text-emerald-300/90">
                  Rastreabilidade RDC 1002 gravada e associada ao prontuário do paciente.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Rodapé Fixo */}
        <div className="px-5 py-4 border-t border-slate-800 bg-slate-900/95 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
          >
            Cancelar (ESC)
          </button>
          <button
            type="button"
            onClick={handleConfirmUsage}
            disabled={!selectedPkg || selectedPkg.status === 'IN_PROCESS' || !patientName.trim()}
            className="flex items-center space-x-2 px-5 py-2.5 text-xs font-bold bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 rounded-xl shadow-lg shadow-cyan-950/50 transition active:scale-98"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirmar Abertura & Vincular (2s)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
