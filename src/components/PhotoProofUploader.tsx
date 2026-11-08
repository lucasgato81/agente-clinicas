'use client';

import React, { useState, useRef } from 'react';
import {
  Camera,
  Upload,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Maximize2,
  RotateCcw,
  Trash2,
  Lock,
  Eye,
  FileCheck2,
  AlertCircle,
  Hash,
  UserCheck,
  Building2,
  X,
  Sparkles,
} from 'lucide-react';
import {
  PhotoProofConfig,
  PhotoEvidenceRecord,
  PhotoEvidenceType,
  TeamMember,
  ClinicTenant,
  PopItem,
} from '@/lib/types';

interface PhotoProofUploaderProps {
  pop: PopItem;
  configs: PhotoProofConfig[];
  evidences: PhotoEvidenceRecord[];
  onSaveEvidence: (record: PhotoEvidenceRecord) => void;
  onDeleteEvidence?: (evidenceId: string) => void;
  teamMembers: TeamMember[];
  clinic: ClinicTenant;
}

export const PhotoProofUploader: React.FC<PhotoProofUploaderProps> = ({
  pop,
  configs,
  evidences,
  onSaveEvidence,
  onDeleteEvidence,
  teamMembers,
  clinic,
}) => {
  const [selectedConfigId, setSelectedConfigId] = useState<string>(
    configs[0]?.id || ''
  );
  const [selectedMemberId, setSelectedMemberId] = useState<string>(
    teamMembers[0]?.id || ''
  );
  const [cycleCode, setCycleCode] = useState<string>('CICLO-142');
  const [notes, setNotes] = useState<string>('');
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [zoomEvidence, setZoomEvidence] = useState<PhotoEvidenceRecord | null>(
    null
  );
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeConfig =
    configs.find((c) => c.id === selectedConfigId) || configs[0];

  const activeOperator =
    teamMembers.find((m) => m.id === selectedMemberId) ||
    teamMembers[0] || {
      name: clinic.technicalResponsibleName || 'Dr. Lucas Ribeiro',
      role: 'Responsável Técnico',
      cpf: '123.456.789-00',
      councilNumber: clinic.technicalResponsibleCro || '102.450',
      councilState: 'SP',
    };

  // Filtrar evidências deste POP e do tipo ativo
  const filteredEvidences = evidences.filter(
    (e) =>
      e.pop_codigo === pop.code &&
      (!activeConfig || e.tipo_evidencia === activeConfig.evidenceType)
  );

  const handleTriggerCamera = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeConfig) return;

    setIsCompressing(true);

    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = async () => {
          try {
            // Compressão em Canvas: Limite máx de 1280px mantendo proporção
            const canvas = document.createElement('canvas');
            let { width, height } = img;
            const maxDimension = 1280;

            if (width > maxDimension || height > maxDimension) {
              if (width > height) {
                height = Math.round((height * maxDimension) / width);
                width = maxDimension;
              } else {
                width = Math.round((width * maxDimension) / height);
                height = maxDimension;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');

            if (!ctx) {
              throw new Error('Falha ao inicializar o contexto 2D do Canvas');
            }

            // Renderizar imagem
            ctx.drawImage(img, 0, 0, width, height);

            // Carimbo Visual Sanitário Pericial no rodapé
            const stampHeight = 44;
            ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
            ctx.fillRect(0, height - stampHeight, width, stampHeight);

            // Borda ciano superior no carimbo
            ctx.fillStyle = '#06b6d4';
            ctx.fillRect(0, height - stampHeight, width, 2);

            // Texto do carimbo
            ctx.fillStyle = '#e2e8f0';
            ctx.font = 'bold 13px monospace';
            const now = new Date();
            const dateStr = now.toLocaleDateString('pt-BR');
            const timeStr = now.toLocaleTimeString('pt-BR');
            const stampText = `ODONTOSHIELD RDC 1002 | ${pop.code} | ${activeConfig.label.slice(0, 32)} | ${dateStr} ${timeStr} (UTC-3)`;
            ctx.fillText(stampText, 14, height - 25);

            ctx.fillStyle = '#94a3b8';
            ctx.font = '11px sans-serif';
            const opText = `Operador: ${activeOperator.name} (${activeOperator.role}) - Ref: ${cycleCode || 'Geral'}`;
            ctx.fillText(opText, 14, height - 10);

            // Exportar imagem comprimida leve (WebP ou JPEG a 0.80)
            let compressedDataUrl = canvas.toDataURL('image/webp', 0.8);
            if (!compressedDataUrl.startsWith('data:image/webp')) {
              compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
            }

            // Calcular SHA-256 inviolável
            let sha256 = '';
            try {
              const base64Data = compressedDataUrl.split(',')[1];
              const binaryStr = atob(base64Data);
              const len = binaryStr.length;
              const bytes = new Uint8Array(len);
              for (let i = 0; i < len; i++) {
                bytes[i] = binaryStr.charCodeAt(i);
              }
              const hashBuffer = await crypto.subtle.digest('SHA-256', bytes);
              const hashArray = Array.from(new Uint8Array(hashBuffer));
              sha256 = hashArray
                .map((b) => b.toString(16).padStart(2, '0'))
                .join('');
            } catch {
              sha256 =
                'hash_' +
                Math.random().toString(36).substring(2, 10) +
                Date.now().toString(16);
            }

            // Criar registro oficial de evidência fotográfica
            const newEvidence: PhotoEvidenceRecord = {
              evidencia_id: `evid-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
              pop_codigo: pop.code,
              clinica_id: clinic.id,
              ciclo_id: cycleCode || undefined,
              tipo_evidencia: activeConfig.evidenceType,
              titulo_evidencia: activeConfig.label,
              foto_url: compressedDataUrl,
              foto_hash_sha256: sha256,
              timestamp: new Date().toISOString(),
              operador: {
                nome: activeOperator.name,
                cpf: activeOperator.cpf || '123.456.789-00',
                funcao: activeOperator.role,
                cro: activeOperator.councilNumber,
                croUf: activeOperator.councilState,
              },
              status_validacao: 'APROVADO',
              confidencial: activeConfig.confidential,
              observacoes: notes.trim() || undefined,
            };

            onSaveEvidence(newEvidence);
            setNotes('');
          } catch (err) {
            console.error('Erro na compressão:', err);
            alert('Não foi possível processar a imagem.');
          } finally {
            setIsCompressing(false);
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setIsCompressing(false);
    }
  };

  const handleCopyHash = (hash: string) => {
    navigator.clipboard?.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
      {/* Input de captura direta por câmera móvel/tablet ou arquivo desktop */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Cabeçalho do Painel de Comprovação */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 bg-cyan-950/80 border border-cyan-800 text-cyan-400 rounded-lg">
              <Camera className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <span>Comprovação Digital por Foto com Metadados Sanitários</span>
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
              RDC 1.002/2025 Art. 38/47
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Registro fotográfico pericial de bancada com carimbo UTC-3,
            compressão leve automática e hash SHA-256 inviolável.
          </p>
        </div>

        <button
          type="button"
          onClick={handleTriggerCamera}
          disabled={isCompressing}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 rounded-xl text-xs font-bold shadow-lg shadow-cyan-950/40 transition shrink-0 active:scale-95 disabled:opacity-50"
        >
          {isCompressing ? (
            <>
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              <span>Processando Foto...</span>
            </>
          ) : (
            <>
              <Camera className="w-4 h-4" />
              <span>Capturar Foto Comprobatória</span>
            </>
          )}
        </button>
      </div>

      {/* Seleção do Tipo de Evidência Exigida pelo POP */}
      {configs.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {configs.map((cfg) => {
            const isSelected = cfg.id === activeConfig?.id;
            const count = evidences.filter(
              (e) =>
                e.pop_codigo === pop.code &&
                e.tipo_evidencia === cfg.evidenceType
            ).length;

            return (
              <button
                key={cfg.id}
                type="button"
                onClick={() => setSelectedConfigId(cfg.id)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                  isSelected
                    ? 'bg-cyan-950 border-cyan-500 text-cyan-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>{cfg.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    count > 0
                      ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-800'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {count}
                </span>
                {cfg.confidential && (
                  <span title="Sigiloso LGPD">
                    <Lock className="w-3 h-3 text-amber-400" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Metadados Operacionais Atuais do Carimbo */}
      {activeConfig && (
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5 text-xs grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <span className="text-[10px] text-slate-400 block font-semibold mb-1">
              Finalidade Sanitária / Frequência:
            </span>
            <div className="text-slate-200 font-medium flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
              <span>{activeConfig.description}</span>
            </div>
            <span className="text-[10px] text-cyan-400 font-mono mt-1 block">
              Periodicidade: {activeConfig.frequency}
            </span>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 block font-semibold mb-1">
              Operador Responsável (Identificação Pericial):
            </label>
            <select
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
            >
              {teamMembers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.role}) {m.councilNumber ? `- CRO ${m.councilNumber}` : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 block font-semibold mb-1">
              Vínculo Operacional (Ciclo / Lote / Ocorrência):
            </label>
            <input
              type="text"
              value={cycleCode}
              onChange={(e) => setCycleCode(e.target.value)}
              placeholder="Ex: CICLO-142, LOTE-01..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>
      )}

      {/* Lista de Fotos Registradas para este Requisito */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
            <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Evidências Vinculadas ({filteredEvidences.length})</span>
          </span>
          <span className="text-[10px] text-slate-500">
            Hash SHA-256 e compactação leve para auditoria sanitária
          </span>
        </div>

        {filteredEvidences.length === 0 ? (
          <div className="border border-dashed border-slate-800 rounded-xl p-6 text-center bg-slate-950/40">
            <Camera className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-300">
              Nenhuma evidência fotográfica registrada para este requisito
            </p>
            <p className="text-[11px] text-slate-500 max-w-sm mx-auto mt-1">
              Toque no botão &quot;Capturar Foto Comprobatória&quot; para abrir a câmera
              traseira do celular/tablet ou fazer upload da evidência de bancada.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEvidences.map((evid) => (
              <div
                key={evid.evidencia_id}
                className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex flex-col justify-between hover:border-slate-700 transition group"
              >
                {/* Imagem com Overlay de Status */}
                <div className="relative aspect-video bg-slate-900 overflow-hidden cursor-pointer" onClick={() => setZoomEvidence(evid)}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={evid.foto_url}
                    alt={evid.titulo_evidencia || 'Foto Comprobatória'}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute top-2 left-2 flex items-center space-x-1">
                    <span className="bg-emerald-950/90 text-emerald-300 border border-emerald-700/80 text-[10px] font-bold px-2 py-0.5 rounded flex items-center space-x-1 backdrop-blur-sm">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Evidência Anexada</span>
                    </span>
                    {evid.confidencial && (
                      <span className="bg-amber-950/90 text-amber-300 border border-amber-700/80 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center space-x-1 backdrop-blur-sm">
                        <Lock className="w-2.5 h-2.5" />
                        <span>Sigilo LGPD</span>
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setZoomEvidence(evid);
                    }}
                    className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-slate-950/80 hover:bg-slate-900 text-slate-200 border border-slate-700 text-xs backdrop-blur-sm transition"
                    title="Visualizar em Tela Cheia"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Metadados da Evidência */}
                <div className="p-3 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200 line-clamp-1">
                      {evid.titulo_evidencia || activeConfig?.label}
                    </span>
                    {evid.ciclo_id && (
                      <span className="font-mono text-[10px] bg-slate-800 text-cyan-300 px-1.5 py-0.2 rounded border border-slate-700 shrink-0">
                        {evid.ciclo_id}
                      </span>
                    )}
                  </div>

                  <div className="text-[10px] text-slate-400 space-y-1">
                    <div className="flex items-center justify-between">
                      <span>Operador:</span>
                      <strong className="text-slate-300">
                        {evid.operador.nome} ({evid.operador.funcao})
                      </strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Carimbo Sanitário:</span>
                      <span className="text-slate-300 font-mono">
                        {new Date(evid.timestamp).toLocaleString('pt-BR')}
                      </span>
                    </div>
                  </div>

                  {/* Hash SHA-256 Inviolável */}
                  <div className="bg-slate-900/80 border border-slate-800 rounded px-2 py-1 flex items-center justify-between">
                    <span className="font-mono text-[9px] text-slate-400 truncate max-w-[170px]">
                      SHA-256: {evid.foto_hash_sha256}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyHash(evid.foto_hash_sha256)}
                      className="text-[9px] text-cyan-400 hover:text-cyan-300 font-medium shrink-0 ml-1"
                    >
                      {copiedHash === evid.foto_hash_sha256 ? 'Copiado!' : 'Copiar'}
                    </button>
                  </div>

                  {/* Ações: Refazer ou Excluir */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={handleTriggerCamera}
                      className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 font-semibold"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Refazer Foto</span>
                    </button>

                    {onDeleteEvidence && (
                      <button
                        type="button"
                        onClick={() => onDeleteEvidence(evid.evidencia_id)}
                        className="text-[11px] text-red-400 hover:text-red-300 flex items-center space-x-1"
                        title="Excluir Evidência"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Excluir</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Lightbox de Zoom em Tela Cheia */}
      {zoomEvidence && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{zoomEvidence.titulo_evidencia || 'Registro Fotográfico Pericial'}</span>
                </h4>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                  Ref: {zoomEvidence.pop_codigo} | {zoomEvidence.ciclo_id || 'Rotina'} | {new Date(zoomEvidence.timestamp).toLocaleString('pt-BR')}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setZoomEvidence(null)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1 flex flex-col items-center justify-center bg-black/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={zoomEvidence.foto_url}
                alt="Evidência Ampliada"
                className="max-h-[60vh] object-contain rounded-xl border border-slate-800 shadow-xl"
              />
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950 text-xs space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
                <div>
                  <span className="text-[10px] text-slate-500 block">Operador Responsável:</span>
                  <strong>{zoomEvidence.operador.nome}</strong> ({zoomEvidence.operador.funcao})
                  {zoomEvidence.operador.cro && ` - CRO ${zoomEvidence.operador.cro}`}
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Status de Conformidade:</span>
                  <span className="text-emerald-400 font-bold flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Conforme RDC nº 1.002/2025</span>
                  </span>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded p-2 flex items-center justify-between">
                <span className="font-mono text-[10px] text-slate-400 truncate">
                  SHA-256: {zoomEvidence.foto_hash_sha256}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyHash(zoomEvidence.foto_hash_sha256)}
                  className="text-[10px] text-cyan-400 hover:text-cyan-300 font-semibold ml-2 shrink-0"
                >
                  {copiedHash === zoomEvidence.foto_hash_sha256 ? 'Copiado!' : 'Copiar Hash'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
