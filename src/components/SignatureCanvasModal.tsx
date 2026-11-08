'use client';

import React, { useRef, useState, useEffect } from 'react';
import { X, CheckCircle2, RotateCcw, PenTool, ShieldCheck, UserCheck, Users, Stethoscope } from 'lucide-react';
import { PopItem, PopSignatureRecord, TeamMember } from '@/lib/types';

interface SignatureCanvasModalProps {
  pop: PopItem;
  teamMembers?: TeamMember[];
  onClose: () => void;
  onSignatureSaved: (popId: string, record: PopSignatureRecord) => void;
}

export const SignatureCanvasModal: React.FC<SignatureCanvasModalProps> = ({
  pop,
  teamMembers = [],
  onClose,
  onSignatureSaved,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  // Inicializar com o primeiro membro não assinado ou o primeiro da lista
  const defaultMember =
    teamMembers.find(
      (m) => !pop.signatures.some((s) => s.collaboratorName.toLowerCase() === m.name.toLowerCase())
    ) || teamMembers[0];

  const [selectedMemberId, setSelectedMemberId] = useState<string>(defaultMember?.id || '');
  const [collaboratorName, setCollaboratorName] = useState(defaultMember?.name || 'Maria Silva');
  const [role, setRole] = useState(defaultMember?.roleName || 'Auxiliar em Saúde Bucal (ASB)');
  const [cpf, setCpf] = useState(defaultMember?.cpf || '234.567.890-11');
  const [councilNumber, setCouncilNumber] = useState(defaultMember?.councilNumber || '');
  const [councilState, setCouncilState] = useState(defaultMember?.councilState || 'SP');
  const [agreed, setAgreed] = useState(false);
  const [currentIp] = useState('189.120.45.10');

  // Ao selecionar um membro na lista suspensa
  const handleSelectMember = (memberId: string) => {
    setSelectedMemberId(memberId);
    const member = teamMembers.find((m) => m.id === memberId);
    if (member) {
      setCollaboratorName(member.name);
      setRole(member.roleName);
      setCpf(member.cpf || '');
      setCouncilNumber(member.councilNumber || '');
      setCouncilState(member.councilState || 'SP');
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.strokeStyle = '#06b6d4'; // Cyan-500
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleSave = () => {
    if (!hasDrawn || !agreed || !collaboratorName.trim()) return;
    const canvas = canvasRef.current;
    const signatureDataUrl = canvas ? canvas.toDataURL('image/png') : undefined;

    const record: PopSignatureRecord = {
      id: `sig-${Date.now()}`,
      collaboratorName: collaboratorName.trim(),
      role: role.trim(),
      cpf: cpf.trim(),
      councilNumber: councilNumber.trim() || undefined,
      councilState: councilNumber.trim() ? councilState.trim() : undefined,
      signedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      ipAddress: currentIp,
      sha256Hash: pop.fileSha256 || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      signatureDataUrl,
    };

    onSignatureSaved(pop.id, record);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 shrink-0">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-100 text-sm">
                Termo de Ciência Digital & Treinamento (RDC 1002/2025)
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                {pop.code} - {pop.title} (v{pop.version}.0)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo */}
        <div className="p-6 space-y-4 overflow-y-auto text-xs flex-1">
          {/* SELEÇÃO RÁPIDA DE COLABORADOR (DROPDOWN DA EQUIPE) */}
          {teamMembers.length > 0 && (
            <div className="bg-slate-950/70 p-3 rounded-xl border border-cyan-500/30 space-y-1.5">
              <label className="text-[11px] font-bold text-cyan-300 flex items-center space-x-1.5">
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                <span>Selecionar Colaborador da Equipe Cadastrada *</span>
              </label>
              <select
                value={selectedMemberId}
                onChange={(e) => handleSelectMember(e.target.value)}
                className="w-full bg-slate-900 border border-cyan-500/50 rounded-lg px-3 py-1.5 text-xs text-slate-100 font-medium focus:outline-none focus:border-cyan-400"
              >
                {teamMembers.map((m) => {
                  const alreadySigned = pop.signatures.some(
                    (s) => s.collaboratorName.toLowerCase() === m.name.toLowerCase()
                  );
                  return (
                    <option key={m.id} value={m.id}>
                      {m.name} — {m.roleName} {alreadySigned ? '(Já Assinou ✓)' : '(Pendente ⏳)'}
                    </option>
                  );
                })}
              </select>
            </div>
          )}

          {/* Identificação Profissional */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-medium text-slate-300 block mb-1">
                Nome Completo do Profissional *
              </label>
              <input
                type="text"
                required
                value={collaboratorName}
                onChange={(e) => setCollaboratorName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-slate-300 block mb-1">CPF *</label>
              <input
                type="text"
                required
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                placeholder="000.000.000-00"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-medium text-slate-300 block mb-1">
                Função / Cargo na Clínica *
              </label>
              <input
                type="text"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-300 block mb-1">
                Nº de Registro no CRO / UF (Se aplicável)
              </label>
              <div className="flex space-x-1.5">
                <input
                  type="text"
                  value={councilNumber}
                  onChange={(e) => setCouncilNumber(e.target.value)}
                  placeholder="Ex: 102.450 ou 44.890"
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                />
                <input
                  type="text"
                  maxLength={2}
                  value={councilState}
                  onChange={(e) => setCouncilState(e.target.value.toUpperCase())}
                  placeholder="SP"
                  className="w-14 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-100 text-center font-mono uppercase focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* Área de Assinatura Touch */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-medium text-slate-300 flex items-center space-x-1">
                <PenTool className="w-3.5 h-3.5 text-cyan-400" />
                <span>Rubrica / Assinatura Digital Touch (com dedo ou caneta): *</span>
              </label>
              <button
                type="button"
                onClick={clearCanvas}
                className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center space-x-1 font-medium transition cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Limpar quadro</span>
              </button>
            </div>

            <div className="bg-slate-950 border-2 border-dashed border-cyan-500/50 rounded-xl overflow-hidden relative touch-none shadow-inner">
              <canvas
                ref={canvasRef}
                width={500}
                height={160}
                className="w-full h-36 cursor-crosshair block"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
              {!hasDrawn && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-slate-500 text-xs">
                  <span>Desenhe sua assinatura touch aqui</span>
                </div>
              )}
            </div>
          </div>

          {/* Metadados Periciais */}
          <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl space-y-1 font-mono text-[10px] text-slate-400">
            <div className="flex justify-between">
              <span>HASH SHA-256 DO DOCUMENTO:</span>
              <span className="text-cyan-400 font-bold truncate max-w-[220px]">
                {pop.fileSha256}
              </span>
            </div>
            <div className="flex justify-between">
              <span>IP DO DISPOSITIVO & CARIMBO DE TEMPO:</span>
              <span className="text-slate-300">
                {currentIp} • {new Date().toISOString().replace('T', ' ').slice(0, 16)}
              </span>
            </div>
          </div>

          {/* Declaração e Checkbox com o texto exato exigido */}
          <label className="flex items-start space-x-2.5 cursor-pointer bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-300 hover:border-cyan-500/40 transition">
            <input
              type="checkbox"
              required
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 rounded border-slate-700 text-cyan-500 focus:ring-0 shrink-0 cursor-pointer"
            />
            <span className="leading-relaxed">
              Declaro que li, compreendi as instruções deste POP e recebi o devido treinamento prático para a sua execução, comprometendo-me a cumprir rigorosamente as rotinas de biossegurança exigidas pela RDC nº 1.002/2025.
            </span>
          </label>
        </div>

        {/* Rodapé */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/90 flex justify-end space-x-3 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!hasDrawn || !agreed || !collaboratorName.trim()}
            className="flex items-center space-x-2 px-5 py-2 text-xs font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg shadow-md transition cursor-pointer"
          >
            <UserCheck className="w-4 h-4" />
            <span>Validar & Gravar Ciência</span>
          </button>
        </div>
      </div>
    </div>
  );
};
