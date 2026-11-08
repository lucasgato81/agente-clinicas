'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Sparkles,
  Wrench,
  FileText,
  AlertTriangle,
  QrCode,
  Camera,
  CheckCircle2,
  Clock,
  Printer,
  Calendar,
  Building2,
  Stethoscope,
  Plus,
  ArrowUpRight,
  Search,
  Check,
  ChevronRight,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  MessageCircle,
  History,
  PenTool,
  AlertCircle,
  UserCheck,
  Users,
  Save,
  UserPlus,
  Phone,
  Mail,
  MapPin,
  FileBadge,
  Edit2,
  Trash2,
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { CmeLabelModal } from '@/components/CmeLabelModal';
import { QrScannerModal } from '@/components/QrScannerModal';
import { NewCycleModal } from '@/components/NewCycleModal';
import { DossierModal } from '@/components/DossierModal';
import { SignatureCanvasModal } from '@/components/SignatureCanvasModal';
import { PhotoLightboxModal } from '@/components/PhotoLightboxModal';
import { MaintenanceModal } from '@/components/MaintenanceModal';
import { NewIncidentModal } from '@/components/NewIncidentModal';
import { NewMemberModal } from '@/components/NewMemberModal';
import { OnboardingReadinessWidget } from '@/components/OnboardingReadinessWidget';
import { InstrumentsCatalog } from '@/components/InstrumentsCatalog';
import { NewInstrumentModal } from '@/components/NewInstrumentModal';
import { NewKitModal } from '@/components/NewKitModal';
import { FinalizeCycleModal } from '@/components/FinalizeCycleModal';
import { EquipmentModal } from '@/components/EquipmentModal';
import { PatientSafetyCenter } from '@/components/PatientSafetyCenter';
import { TraceabilityModule } from '@/components/TraceabilityModule';
import { PopsModule } from '@/components/PopsModule';
import { LoginModal } from '@/components/LoginModal';
import {
  CURRENT_CLINIC,
  CURRENT_USER,
  EMPTY_NEW_CLINIC,
  EMPTY_NEW_USER,
  EMPTY_NEW_TEAM_MEMBERS,
  MOCK_AUTOCLAVES,
  MOCK_CME_BATCHES,
  MOCK_PACKAGES,
  MOCK_EQUIPMENTS,
  MOCK_POPS,
  MOCK_INCIDENTS,
  MOCK_ROUTINE_CHECKLIST,
  MOCK_TEAM_MEMBERS,
  MOCK_INSTRUMENTS,
  MOCK_KIT_TEMPLATES,
} from '@/lib/mockData';
import {
  SterilePackageItem,
  CmeBatchItem,
  PopItem,
  EquipmentItem,
  RoutineChecklistItem,
  PopSignatureRecord,
  SafetyIncidentItem,
  ClinicTenant,
  UserProfile,
  TeamMember,
  DentalInstrument,
  InstrumentKitTemplate,
  PhotoEvidenceRecord,
  AutoclaveItem,
} from '@/lib/types';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Modo de Demonstração: Novo Usuário (Onboarding) vs Clínica Completa
  const [isNewClinicMode, setIsNewClinicMode] = useState<boolean>(true);

  // Estado da Clínica e Usuário Atual (Inicia no modo Novo Usuário)
  const [clinic, setClinic] = useState<ClinicTenant>(EMPTY_NEW_CLINIC);
  const [currentUser, setCurrentUser] = useState<UserProfile>(EMPTY_NEW_USER);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(EMPTY_NEW_TEAM_MEMBERS);
  const [equipments, setEquipments] = useState<EquipmentItem[]>([]);
  const [batches, setBatches] = useState<CmeBatchItem[]>([]);
  const [packages, setPackages] = useState<SterilePackageItem[]>([]);
  const [pops, setPops] = useState<PopItem[]>(
    MOCK_POPS.map((p) => ({ ...p, signaturesCount: 0, signatures: [], status: 'REVIEW_DUE' }))
  );
  const [checklist, setChecklist] = useState<RoutineChecklistItem[]>(MOCK_ROUTINE_CHECKLIST);
  const [incidents, setIncidents] = useState<SafetyIncidentItem[]>([]);
  const [instruments, setInstruments] = useState<DentalInstrument[]>([]);
  const [kitTemplates, setKitTemplates] = useState<InstrumentKitTemplate[]>([]);

  // Modais de Controle
  const [selectedLabelPkg, setSelectedLabelPkg] = useState<SterilePackageItem | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [isNewCycleOpen, setIsNewCycleOpen] = useState<boolean>(false);
  const [isDossierOpen, setIsDossierOpen] = useState<boolean>(false);
  const [signingPop, setSigningPop] = useState<PopItem | null>(null);
  const [maintenanceEquip, setMaintenanceEquip] = useState<EquipmentItem | null>(null);
  const [isEquipmentModalOpen, setIsEquipmentModalOpen] = useState<boolean>(false);
  const [editingEquipment, setEditingEquipment] = useState<EquipmentItem | null>(null);
  const [isNewIncidentOpen, setIsNewIncidentOpen] = useState<boolean>(false);
  const [isNewMemberOpen, setIsNewMemberOpen] = useState<boolean>(false);
  const [isNewInstrumentOpen, setIsNewInstrumentOpen] = useState<boolean>(false);
  const [editingInstrument, setEditingInstrument] = useState<DentalInstrument | null>(null);
  const [isNewKitOpen, setIsNewKitOpen] = useState<boolean>(false);
  const [selectedKitForCme, setSelectedKitForCme] = useState<InstrumentKitTemplate | undefined>(undefined);
  const [finalizingBatch, setFinalizingBatch] = useState<CmeBatchItem | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // Sincronização em tempo real (PostgreSQL / Nuvem Render) e Restauração de Sessão
  useEffect(() => {
    // 1. Restaurar sessão salva do usuário
    try {
      const savedUser = localStorage.getItem('odontoshield_auth_user');
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.warn('Erro ao restaurar sessão local:', e);
    }

    // 2. Sincronizar dados entre celulares e computadores
    const syncCloudData = async () => {
      try {
        const res = await fetch('/api/sync');
        if (res.ok) {
          const data = await res.json();
          if (data.batches && data.batches.length > 0) {
            setBatches(data.batches);
          }
          if (data.packages && data.packages.length > 0) {
            setPackages(data.packages);
          }
          if (data.incidents && data.incidents.length > 0) {
            setIncidents(data.incidents);
          }
        }
      } catch {
        // Fallback silencioso caso offline
      }
    };

    syncCloudData();
    const interval = setInterval(syncCloudData, 6000); // Polling a cada 6s
    return () => clearInterval(interval);
  }, []);

  // Dispara ação para o backend / banco de dados na nuvem
  const postSyncAction = (type: string, payload: unknown) => {
    fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, payload }),
    }).catch((err) => console.warn('[SYNC ERROR]', err));
  };

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('odontoshield_auth_user', JSON.stringify(user));
    } catch (e) {
      console.warn(e);
    }
    setIsLoginModalOpen(false);
  };

  // Lightbox de Evidência Fotográfica
  const [lightboxData, setLightboxData] = useState<{
    title: string;
    photoUrl: string;
    type: 'chemical' | 'biological';
    batchCode: string;
    timestamp: string;
    operatorName: string;
  } | null>(null);

  const [selectedPop, setSelectedPop] = useState<PopItem | null>(MOCK_POPS[0]);
  const [selectedPopVersion, setSelectedPopVersion] = useState<number>(MOCK_POPS[0]?.version || 1);

  // Filtros de CME e Busca
  const [packageFilter, setPackageFilter] = useState<'ALL' | 'STERILIZED' | 'USED'>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [expandedBatchId, setExpandedBatchId] = useState<string | null>(null);

  // Alternador de Modo (Novo Usuário vs Clínica Demo Completa)
  const handleToggleClinicMode = () => {
    if (isNewClinicMode) {
      // Carrega dados da clínica 100% pronta
      setIsNewClinicMode(false);
      setClinic(CURRENT_CLINIC);
      setCurrentUser(CURRENT_USER);
      setTeamMembers(MOCK_TEAM_MEMBERS);
      setEquipments(MOCK_EQUIPMENTS);
      setBatches(MOCK_CME_BATCHES);
      setPackages(MOCK_PACKAGES);
      setPops(MOCK_POPS);
      setIncidents(MOCK_INCIDENTS);
      setInstruments(MOCK_INSTRUMENTS);
      setKitTemplates(MOCK_KIT_TEMPLATES);
    } else {
      // Simula novo usuário com pendências sanitárias
      setIsNewClinicMode(true);
      setClinic(EMPTY_NEW_CLINIC);
      setCurrentUser(EMPTY_NEW_USER);
      setTeamMembers(EMPTY_NEW_TEAM_MEMBERS);
      setEquipments([]);
      setBatches([]);
      setPackages([]);
      setPops(MOCK_POPS.map((p) => ({ ...p, signaturesCount: 0, signatures: [], status: 'REVIEW_DUE' })));
      setIncidents([]);
      setInstruments([]);
      setKitTemplates([]);
    }
  };

  // Alternar Usuário Ativo de Teste (Abre Modal de Login com PIN / Senha)
  const handleSwitchUser = () => {
    setIsLoginModalOpen(true);
  };

  // Salvar Dados da Clínica
  const handleSaveClinic = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Ações de Negócio
  const handlePackageConsumed = (pkgId: string, patientName: string, dentistName: string) => {
    const targetPkg = packages.find((p) => p.id === pkgId);
    const usedAt = new Date().toISOString().replace('T', ' ').slice(0, 16);
    if (targetPkg) {
      postSyncAction('USE_PACKAGE', {
        qrCodeToken: targetPkg.qrCodeToken,
        patientName,
        dentistName,
        usedAt,
      });
    }

    setPackages((prev) =>
      prev.map((p) => {
        if (p.id === pkgId) {
          return {
            ...p,
            status: 'USED',
            patientName,
            dentistName,
            usedAt,
          };
        }
        return p;
      })
    );
  };

  const handleCycleCreated = (newBatch: CmeBatchItem, newPackages: SterilePackageItem[]) => {
    setBatches((prev) => [newBatch, ...prev]);
    setPackages((prev) => [...newPackages, ...prev]);
    postSyncAction('NEW_BATCH', newBatch);
  };

  const handleFinalizeBatch = (
    batchId: string,
    isApproved: boolean,
    temperatureC: number,
    pressureBar: number,
    cycleTimeMin: number,
    chemicalClass5Ok: boolean,
    chemicalPhotoUrl?: string,
    hasBiological?: boolean,
    bioPhotoUrl?: string
  ) => {
    const targetBatch = batches.find((b) => b.id === batchId);
    const finishedAt = new Date().toISOString().replace('T', ' ').slice(0, 16);

    if (targetBatch) {
      postSyncAction('NEW_BATCH', {
        ...targetBatch,
        status: isApproved ? 'APPROVED' : 'REJECTED',
        finishedAt,
        temperatureC,
        pressureBar,
        cycleTimeMin,
        physicalOk: isApproved,
        chemicalClass5Ok,
        chemicalPhotoUrl,
        hasBiological: hasBiological || false,
        bioPhotoUrl,
      });
    }

    setBatches((prev) =>
      prev.map((b) => {
        if (b.id === batchId) {
          return {
            ...b,
            status: isApproved ? 'APPROVED' : 'REJECTED',
            finishedAt,
            temperatureC,
            pressureBar,
            cycleTimeMin,
            physicalOk: isApproved,
            chemicalClass5Ok,
            chemicalPhotoUrl,
            hasBiological: hasBiological || false,
            bioPhotoUrl,
          };
        }
        return b;
      })
    );

    // Atualiza status de todos os pacotes deste lote
    if (targetBatch) {
      setPackages((prev) =>
        prev.map((pkg) => {
          if (pkg.batchCode === targetBatch.batchCode) {
            return {
              ...pkg,
              status: isApproved ? 'STERILIZED' : 'DISCARDED',
            };
          }
          return pkg;
        })
      );
    }
  };

  // Toggle do Checklist Matinal com gravação do operador
  const handleToggleChecklist = (itemId: string) => {
    setChecklist((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const nextState = !item.completed;
          return {
            ...item,
            completed: nextState,
            completedAt: nextState ? new Date().toISOString().replace('T', ' ').slice(0, 16) : undefined,
            operatorName: nextState ? `${currentUser.name} (${currentUser.roleName})` : undefined,
          };
        }
        return item;
      })
    );
  };

  // Resolver Manutenção de Equipamento
  const handleMaintenanceRecorded = (
    equipmentId: string,
    technicianName: string,
    notes: string,
    nextDate: string
  ) => {
    setEquipments((prev) =>
      prev.map((eq) => {
        if (eq.id === equipmentId) {
          return {
            ...eq,
            status: 'OK',
            lastMaintenance: new Date().toISOString().slice(0, 10),
            nextMaintenance: nextDate,
            daysRemaining: 180,
            hasLaudo: true,
            technicianName,
          };
        }
        return eq;
      })
    );

    setChecklist((prev) =>
      prev.map((c) =>
        c.linkedEquipmentId === equipmentId
          ? {
              ...c,
              completed: true,
              completedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
              operatorName: `${currentUser.name} (${currentUser.roleName})`,
            }
          : c
      )
    );
  };

  const handleSaveEquipment = (saved: EquipmentItem) => {
    setEquipments((prev) => {
      const exists = prev.some((e) => e.id === saved.id);
      if (exists) {
        return prev.map((e) => (e.id === saved.id ? saved : e));
      }
      return [saved, ...prev];
    });
  };

  const handleDeleteEquipment = (id: string) => {
    setEquipments((prev) => prev.filter((e) => e.id !== id));
  };

  // Salvar Assinatura Touch no POP
  const handleSignatureSaved = (popId: string, record: PopSignatureRecord) => {
    postSyncAction('SIGN_POP', { popId, record });

    setPops((prev) =>
      prev.map((p) => {
        if (p.id === popId) {
          const updatedSignatures = [record, ...p.signatures];
          const newCount = p.signaturesCount + 1;
          const isFullyCompliant = newCount >= p.totalTeamCount || updatedSignatures.length >= teamMembers.length;
          return {
            ...p,
            signatures: updatedSignatures,
            signaturesCount: Math.min(newCount, p.totalTeamCount),
            status: isFullyCompliant ? ('COMPLIANT' as const) : p.status,
            pendingCollaborators: p.pendingCollaborators.filter(
              (c) => c.name.toLowerCase() !== record.collaboratorName.toLowerCase()
            ),
          };
        }
        return p;
      })
    );

    if (selectedPop?.id === popId) {
      setSelectedPop((prev) => {
        if (!prev) return null;
        const updatedSignatures = [record, ...prev.signatures];
        const newCount = prev.signaturesCount + 1;
        const isFullyCompliant = newCount >= prev.totalTeamCount || updatedSignatures.length >= teamMembers.length;
        return {
          ...prev,
          signatures: updatedSignatures,
          signaturesCount: Math.min(newCount, prev.totalTeamCount),
          status: isFullyCompliant ? ('COMPLIANT' as const) : prev.status,
          pendingCollaborators: prev.pendingCollaborators.filter(
            (c) => c.name.toLowerCase() !== record.collaboratorName.toLowerCase()
          ),
        };
      });
    }
  };

  // Salvar Evidência Fotográfica no POP
  const handleSavePhotoEvidence = (popId: string, evidence: PhotoEvidenceRecord) => {
    postSyncAction('SAVE_PHOTO_PROOF', { popId, evidence });

    setPops((prev) =>
      prev.map((p) => {
        if (p.id === popId) {
          const currentEvidences = p.photoEvidences || [];
          return {
            ...p,
            photoEvidences: [evidence, ...currentEvidences],
          };
        }
        return p;
      })
    );

    if (selectedPop?.id === popId) {
      setSelectedPop((prev) => {
        if (!prev) return null;
        const currentEvidences = prev.photoEvidences || [];
        return {
          ...prev,
          photoEvidences: [evidence, ...currentEvidences],
        };
      });
    }
  };

  // Excluir Evidência Fotográfica no POP
  const handleDeletePhotoEvidence = (popId: string, evidenceId: string) => {
    setPops((prev) =>
      prev.map((p) => {
        if (p.id === popId) {
          return {
            ...p,
            photoEvidences: (p.photoEvidences || []).filter((e) => e.evidencia_id !== evidenceId),
          };
        }
        return p;
      })
    );

    if (selectedPop?.id === popId) {
      setSelectedPop((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          photoEvidences: (prev.photoEvidences || []).filter((e) => e.evidencia_id !== evidenceId),
        };
      });
    }
  };

  // Acionar Suporte via WhatsApp pré-formatado
  const handleWhatsAppTechnician = (eq: EquipmentItem) => {
    const phone = eq.technicianPhone || '5511999999999';
    const text = encodeURIComponent(
      `Olá! Sou da clínica ${clinic.name}. Precisamos de suporte técnico preventivo/corretivo conforme a RDC 1002/2025:\n\n• Equipamento: ${eq.name}\n• Modelo: ${eq.model}\n• Nº de Série: ${eq.serialNumber}\n• Localização: ${eq.locationRoom}\n• Situação: Prazo de manutenção/laudo vencendo em ${eq.nextMaintenance}.\n\nPoderiam agendar uma visita técnica com emissão de laudo assinado?`
    );
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  // Notificar Colaborador via WhatsApp para assinar POP
  const handleNotifyCollaborator = (pop: PopItem, phone: string, name: string) => {
    const text = encodeURIComponent(
      `Olá, ${name}! Consta uma pendência de leitura e assinatura digital obrigatória do ${pop.code} ("${pop.title}") no sistema OdontoShield (RDC 1002/2025). Por favor, acesse o painel e registre sua ciência para mantermos a clínica 100% conforme na vigilância sanitária.`
    );
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  // Métricas do Dashboard
  const todayStr = '2026-10-24';
  const activeBatchesToday = batches.filter((b) => b.startedAt.startsWith(todayStr)).length;
  const sterilePackagesCount = packages.filter((p) => p.status === 'STERILIZED').length;
  const warningEquipments = equipments.filter((e) => e.status === 'WARNING').length;
  const expiredEquipments = equipments.filter((e) => e.status === 'EXPIRED').length;

  // Lista unificada de autoclaves da clínica (Autoclave 1, 2, 3...)
  const dynamicAutoclaves: AutoclaveItem[] = [
    ...MOCK_AUTOCLAVES,
    ...equipments
      .filter((e) => e.category === 'AUTOCLAVE')
      .map((e, idx) => ({
        id: e.id,
        nickname: `Autoclave 0${MOCK_AUTOCLAVES.length + idx + 1} (${e.brand} ${e.model})`,
        brand: e.brand,
        model: e.model,
        serialNumber: e.serialNumber,
        chamberVolumeL: 21,
        lastValidation: e.lastMaintenance,
        validationDue: e.nextMaintenance,
        status: e.status === 'OK' ? ('OPERATIONAL' as const) : ('MAINTENANCE_DUE' as const),
      }))
      .filter((e) => !MOCK_AUTOCLAVES.some((m) => m.id === e.id || m.serialNumber === e.serialNumber)),
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenDossier={() => setIsDossierOpen(true)}
        clinic={clinic}
        currentUser={currentUser}
        onSwitchUser={handleSwitchUser}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* ============================================================== */}
        {/* WIDGET DE AUDITORIA E CAMPOS FALTANTES (ONBOARDING)            */}
        {/* ============================================================== */}
        <OnboardingReadinessWidget
          clinic={clinic}
          teamMembers={teamMembers}
          equipments={equipments}
          pops={pops}
          instrumentsCount={instruments.length}
          onNavigateTab={(tabId) => setActiveTab(tabId)}
          isNewClinicMode={isNewClinicMode}
          onToggleClinicMode={handleToggleClinicMode}
        />

        {/* ============================================================== */}
        {/* ABA 1: PAINEL GERAL (DASHBOARD)                                */}
        {/* ============================================================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Banner de Boas-Vindas */}
            <div className="relative bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950 border border-slate-800 rounded-2xl p-6 overflow-hidden shadow-xl">
              <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent pointer-events-none" />

              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2 mb-1.5">
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                        clinic.sanitaryLicense
                          ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                          : 'bg-amber-950 text-amber-400 border-amber-800'
                      }`}
                    >
                      {clinic.sanitaryLicense ? 'ALVARÁ SANITÁRIO ATIVO' : 'ALVARÁ PENDENTE DE INFORMAR'}
                    </span>
                    <span className="text-xs text-slate-400">
                      | {clinic.sanitaryLicense ? `Licença: ${clinic.sanitaryLicense}` : 'Sem licença cadastrada'}
                    </span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-white">
                    Olá, {currentUser.name}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                    {clinic.technicalResponsibleName ? (
                      <>
                        Responsável Técnico: <strong>{clinic.technicalResponsibleName} (CRO-{clinic.technicalResponsibleCroState} {clinic.technicalResponsibleCro})</strong>.
                      </>
                    ) : (
                      <span className="text-amber-400 font-semibold">
                        Atenção: O Responsável Técnico (RT) ainda não foi cadastrado. Clique no checklist acima para regularizar.
                      </span>
                    )}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  <button
                    onClick={() => setIsNewCycleOpen(true)}
                    className="flex items-center space-x-1.5 px-3.5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold rounded-xl text-xs shadow-lg shadow-cyan-500/20 transition"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Novo Ciclo CME</span>
                  </button>
                  <button
                    onClick={() => setIsScannerOpen(true)}
                    className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 font-semibold rounded-xl text-xs transition"
                  >
                    <Camera className="w-4 h-4 text-cyan-400" />
                    <span>Escanear na Cadeira</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Cartões de Indicadores Chave */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div
                onClick={() => setActiveTab('cme')}
                className="bg-slate-900 border border-slate-800/80 hover:border-cyan-500/50 p-4 rounded-xl cursor-pointer transition shadow-sm group"
              >
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-medium">Ciclos de Autoclave</span>
                  <Sparkles className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition" />
                </div>
                <div className="text-2xl font-bold text-white">
                  {activeBatchesToday} {activeBatchesToday === 1 ? 'Lote Ativo' : 'Lotes Ativos'} Hoje
                </div>
                <div className="text-[11px] text-cyan-300 flex items-center space-x-1 mt-1 font-medium">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Total de Kits Prontos em Estoque: {sterilePackagesCount} pacotes</span>
                </div>
              </div>

              <div
                onClick={() => setActiveTab('equipments')}
                className="bg-slate-900 border border-slate-800/80 hover:border-amber-500/50 p-4 rounded-xl cursor-pointer transition shadow-sm group"
              >
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-medium">Equipamentos Críticos</span>
                  <Wrench className="w-4 h-4 text-amber-400 group-hover:scale-110 transition" />
                </div>
                <div className="text-2xl font-bold text-white">{equipments.length} monitorados</div>
                <div className="text-[11px] text-amber-400 flex items-center space-x-1 mt-1">
                  <Clock className="w-3 h-3" />
                  <span>{equipments.length === 0 ? 'Nenhuma autoclave cadastrada' : `${warningEquipments} em atenção`}</span>
                </div>
              </div>

              <div
                onClick={() => setActiveTab('pops')}
                className="bg-slate-900 border border-slate-800/80 hover:border-cyan-500/50 p-4 rounded-xl cursor-pointer transition shadow-sm group"
              >
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-medium">POPs RDC 1002</span>
                  <FileText className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition" />
                </div>
                <div className="text-2xl font-bold text-white">
                  {pops.filter((p) => p.signaturesCount > 0).length} / 8 Assinados
                </div>
                <div className="text-[11px] text-emerald-400 flex items-center space-x-1 mt-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Biblioteca modelo pré-carregada</span>
                </div>
              </div>

              <div
                onClick={() => setActiveTab('team')}
                className="bg-slate-900 border border-slate-800/80 hover:border-indigo-500/50 p-4 rounded-xl cursor-pointer transition shadow-sm group"
              >
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-medium">Equipe da Clínica</span>
                  <Users className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition" />
                </div>
                <div className="text-2xl font-bold text-white">{teamMembers.length} Colaboradores</div>
                <div className="text-[11px] text-indigo-300 flex items-center space-x-1 mt-1">
                  <UserCheck className="w-3 h-3" />
                  <span>
                    {teamMembers.some((m) => m.role === 'DENTAL_ASSISTANT')
                      ? 'ASB/TSB habilitada'
                      : 'Falta cadastrar ASB/TSB'}
                  </span>
                </div>
              </div>
            </div>

            {/* Seções Inferiores: Pacotes Recentes e Checklist Matinal */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <h3 className="font-semibold text-sm text-slate-100">
                      Rastreabilidade Recente de Instrumentais
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('cme')}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center space-x-0.5"
                  >
                    <span>Ver todos no CME</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {packages.length === 0 ? (
                  <div className="p-8 text-center bg-slate-950 border border-dashed border-slate-800 rounded-xl space-y-2">
                    <p className="text-xs text-slate-400">
                      Nenhum ciclo de esterilização registrado ainda nesta nova clínica.
                    </p>
                    <button
                      onClick={() => setIsNewCycleOpen(true)}
                      className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-xs transition"
                    >
                      Registrar 1º Ciclo de Autoclave
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {packages.slice(0, 4).map((pkg) => (
                      <div
                        key={pkg.id}
                        className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 flex items-center justify-between hover:border-slate-700 transition"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-lg bg-cyan-950/80 border border-cyan-800 flex items-center justify-center text-cyan-400">
                            <QrCode className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-mono text-[10px] font-black text-cyan-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                                {pkg.shortCode}
                              </span>
                              <span className="text-xs font-semibold text-slate-100">{pkg.description}</span>
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center space-x-2 mt-0.5">
                              <span>Lote: {pkg.batchCode}</span>
                              <span>• Val: {pkg.expiresAt}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-semibold">
                            Estéril
                          </span>
                          <button
                            onClick={() => setSelectedLabelPkg(pkg)}
                            className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-lg transition"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <h3 className="font-semibold text-sm text-slate-100">
                      Checklist Matinal Interativo
                    </h3>
                  </div>
                  <span className="text-[10px] text-cyan-400 font-mono bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                    RDC 1002
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  {checklist.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3 rounded-xl border transition ${
                        item.completed
                          ? 'bg-slate-950/80 border-emerald-800/60 text-slate-300'
                          : 'bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() => handleToggleChecklist(item.id)}
                              className={`w-5 h-5 rounded-md flex items-center justify-center transition shrink-0 ${
                                item.completed
                                  ? 'bg-emerald-600 text-white shadow-sm'
                                  : 'border-2 border-slate-600 hover:border-cyan-400'
                              }`}
                            >
                              {item.completed && <Check className="w-3.5 h-3.5" />}
                            </button>
                            <span className={`font-semibold text-[11px] ${item.completed ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                              {item.title}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 pl-7">{item.normativeRef}</p>
                          {item.completed && item.completedAt && (
                            <p className="text-[9.5px] text-emerald-400 pl-7 font-mono">
                              ✓ Realizado em {item.completedAt} por {item.operatorName}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => setIsDossierOpen(true)}
                    className="w-full py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 rounded-xl font-semibold text-xs flex items-center justify-center space-x-1.5 transition"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Visualizar Dossiê Fiscal Consolidado</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* ABA 2: CME & ESTERILIZAÇÃO (FLUXO EM 2 ETAPAS - RDC 1002/RDC 15) */}
        {/* ============================================================== */}
        {activeTab === 'cme' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  <span>Central de Material e Esterilização (CME)</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Fluxo em 2 etapas: Passo 1 (Iniciar Carga & Identificar) → Passo 2 (Conferir Parâmetros & Liberar). Identificação por caneta ou impressão opcional.
                </p>
              </div>

              <div className="flex items-center space-x-2.5">
                <button
                  onClick={() => setIsScannerOpen(true)}
                  className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition"
                >
                  <Camera className="w-4 h-4 text-cyan-400" />
                  <span>Scanner PWA</span>
                </button>
                <button
                  onClick={() => setIsNewCycleOpen(true)}
                  className="flex items-center space-x-1.5 px-3.5 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold rounded-xl text-xs shadow-md transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Passo 1: Iniciar Nova Carga</span>
                </button>
              </div>
            </div>

            {/* Alerta de Cargas em Processamento (Passo 2 Pendente) */}
            {batches.some((b) => b.status === 'PROCESSING') && (
              <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-900 border border-amber-500/50 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
                <div className="flex items-center space-x-3">
                  <span className="w-3 h-3 rounded-full bg-amber-400 animate-ping shrink-0" />
                  <div>
                    <h4 className="font-bold text-amber-300 text-xs sm:text-sm">
                      {batches.filter((b) => b.status === 'PROCESSING').length} Carga(s) em Andamento na Autoclave
                    </h4>
                    <p className="text-[11px] text-slate-300">
                      Quando a autoclave apitar e esfriar, clique em <strong>Concluir & Liberar Lote</strong> para registrar os parâmetros físicos observados e a foto do Integrador Classe 5.
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {batches
                    .filter((b) => b.status === 'PROCESSING')
                    .map((procBatch) => (
                      <button
                        key={procBatch.id}
                        onClick={() => setFinalizingBatch(procBatch)}
                        className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow transition flex items-center space-x-1.5 shrink-0"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Concluir {procBatch.shortCode}</span>
                      </button>
                    ))}
                </div>
              </div>
            )}

            {batches.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center space-y-3">
                <Sparkles className="w-10 h-10 text-cyan-400 mx-auto" />
                <h3 className="font-bold text-slate-200 text-sm">Nenhum ciclo cadastrado no Livro Digital de CME</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  A sua CME está pronta para operar. Inicie a primeira carga para gerar o lote exclusivo com as iniciais da sua clínica e código para caneta ou impressão opcional.
                </p>
                <button
                  onClick={() => setIsNewCycleOpen(true)}
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs shadow transition"
                >
                  Passo 1: Iniciar Primeira Carga
                </button>
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
                  <h3 className="font-semibold text-sm text-slate-100">
                    Livro Digital de Ciclos de Autoclave ({batches.length})
                  </h3>
                  <span className="text-[11px] text-slate-400">RDC 1002/2025 & RDC 15/2012</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold">
                      <tr>
                        <th className="p-3">Identificador & Lote</th>
                        <th className="p-3">Equipamento</th>
                        <th className="p-3">Operador</th>
                        <th className="p-3">Data/Hora</th>
                        <th className="p-3">Parâmetros Físicos</th>
                        <th className="p-3">Químico Cl. 5</th>
                        <th className="p-3">Biológico</th>
                        <th className="p-3">Pacotes</th>
                        <th className="p-3">Status / Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {batches.map((b) => (
                        <tr key={b.id} className="hover:bg-slate-800/30 transition">
                          <td className="p-3">
                            <span className="font-mono font-bold text-cyan-400 block">{b.shortCode}</span>
                            <span className="text-[10px] text-slate-500 font-mono">{b.batchCode}</span>
                          </td>
                          <td className="p-3 text-slate-300">{b.autoclaveName}</td>
                          <td className="p-3 text-slate-300">{b.operatorName}</td>
                          <td className="p-3 text-slate-400">{b.startedAt}</td>
                          <td className="p-3">
                            {b.status === 'PROCESSING' ? (
                              <span className="text-amber-400 font-medium flex items-center space-x-1">
                                <Clock className="w-3 h-3 animate-spin" />
                                <span>Autoclave em Curso...</span>
                              </span>
                            ) : (
                              <span className="text-slate-300">
                                {b.temperatureC}°C / {b.pressureBar} bar ({b.cycleTimeMin}m)
                              </span>
                            )}
                          </td>
                          <td className="p-3">
                            {b.status === 'PROCESSING' ? (
                              <span className="text-slate-500 italic text-[11px]">Pendente Pós-Ciclo</span>
                            ) : b.chemicalClass5Ok ? (
                              <button
                                type="button"
                                onClick={() => {
                                  if (b.chemicalPhotoUrl) {
                                    setLightboxData({
                                      title: `Integrador Classe 5 - ${b.shortCode}`,
                                      photoUrl: b.chemicalPhotoUrl,
                                      type: 'chemical',
                                      batchCode: b.batchCode,
                                      timestamp: b.startedAt,
                                      operatorName: b.operatorName,
                                    });
                                  }
                                }}
                                className="text-emerald-400 hover:text-emerald-300 font-semibold underline flex items-center space-x-1"
                              >
                                <span>Classe 5 OK</span>
                              </button>
                            ) : (
                              <span className="text-red-400 font-bold">Falha</span>
                            )}
                          </td>
                          <td className="p-3">{b.hasBiological ? 'Negativo' : 'N/A'}</td>
                          <td className="p-3 font-semibold">{b.packagesCount} kits</td>
                          <td className="p-3">
                            {b.status === 'PROCESSING' ? (
                              <button
                                onClick={() => setFinalizingBatch(b)}
                                className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] font-bold rounded-lg transition shadow flex items-center space-x-1"
                              >
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Liberar (Passo 2)</span>
                              </button>
                            ) : b.status === 'APPROVED' ? (
                              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-bold border border-emerald-800">
                                APROVADO
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-red-950 text-red-300 text-[10px] font-bold border border-red-800">
                                REPROVADO
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* ABA: CATÁLOGO DE INSTRUMENTAIS & KITS (RDC 1002 / RDC 15)      */}
        {/* ============================================================== */}
        {activeTab === 'instruments' && (
          <div className="animate-in fade-in duration-150">
            <InstrumentsCatalog
              instruments={instruments}
              kitTemplates={kitTemplates}
              onOpenNewInstrument={() => {
                setEditingInstrument(null);
                setIsNewInstrumentOpen(true);
              }}
              onEditInstrument={(inst) => {
                setEditingInstrument(inst);
                setIsNewInstrumentOpen(true);
              }}
              onDeleteInstrument={(id) => {
                setInstruments((prev) => prev.filter((i) => i.id !== id));
              }}
              onOpenNewKit={() => setIsNewKitOpen(true)}
              onUpdateInstrument={(updated) => {
                setInstruments((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
              }}
              onGoToCmeWithKit={(kit) => {
                setSelectedKitForCme(kit);
                setActiveTab('cme');
                setIsNewCycleOpen(true);
              }}
            />
          </div>
        )}

        {/* ============================================================== */}
        {/* ABA 3: EQUIPAMENTOS & LAUDOS TÉCNICOS                          */}
        {/* ============================================================== */}
        {activeTab === 'equipments' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                  <Wrench className="w-5 h-5 text-amber-400" />
                  <span>Gestão de Equipamentos, NR-13 e Laudos Técnicos</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Conformidade com a Norma NR-13 (Compressores), RDC 1002 (Termopares de Autoclave) e Radioproteção (Físico Médico).
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setEditingEquipment(null);
                    setIsEquipmentModalOpen(true);
                  }}
                  className="flex items-center space-x-1.5 px-3.5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs shadow transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Cadastrar Equipamento / Autoclave</span>
                </button>
              </div>
            </div>

            {equipments.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center space-y-3">
                <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
                <h3 className="font-bold text-slate-200 text-sm">Nenhum equipamento cadastrado ainda</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  A RDC 1002/2025 exige o inventário e guarda de laudos de autoclaves, compressores e raios-X.
                </p>
                <button
                  onClick={() => {
                    setEditingEquipment(null);
                    setIsEquipmentModalOpen(true);
                  }}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Cadastrar Primeiro Equipamento</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {equipments.map((eq) => (
                  <div
                    key={eq.id}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                          {eq.category}
                        </span>
                        <h3 className="text-sm font-bold text-slate-100 truncate">{eq.name}</h3>
                        <p className="text-xs text-slate-400">
                          {eq.brand} {eq.model} • Local: <span className="text-slate-300">{eq.locationRoom}</span>
                        </p>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                            eq.status === 'OK'
                              ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                              : eq.status === 'WARNING'
                              ? 'bg-amber-950 text-amber-300 border-amber-800'
                              : 'bg-rose-950 text-rose-300 border-rose-800'
                          }`}
                        >
                          {eq.status === 'OK' ? 'CONFORME' : eq.status === 'WARNING' ? 'ALERTA' : 'VENCIDO'}
                        </span>
                        <button
                          onClick={() => {
                            setEditingEquipment(eq);
                            setIsEquipmentModalOpen(true);
                          }}
                          title="Editar Equipamento"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteEquipment(eq.id)}
                          title="Excluir Equipamento"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-300 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950 p-3 rounded-xl border border-slate-800 text-slate-300">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Número de Série</span>
                        <span className="font-mono text-[11px] text-cyan-300">{eq.serialNumber || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Próxima Manutenção</span>
                        <span className="font-semibold text-slate-100">{eq.nextMaintenance}</span>
                      </div>
                      {eq.thermalQualificationDate && (
                        <div className="col-span-2 pt-1 border-t border-slate-900 flex items-center justify-between text-[11px]">
                          <span className="text-slate-400">Qualificação Térmica (RDC 1002):</span>
                          <span className="text-emerald-400 font-medium">{eq.thermalQualificationDate}</span>
                        </div>
                      )}
                      {eq.nr13HydrostaticTestDate && (
                        <div className="col-span-2 pt-1 border-t border-slate-900 flex items-center justify-between text-[11px]">
                          <span className="text-slate-400">Teste Hidrostático (NR-13):</span>
                          <span className="text-emerald-400 font-medium">{eq.nr13HydrostaticTestDate}</span>
                        </div>
                      )}
                      {eq.radiationSurveyDate && (
                        <div className="col-span-2 pt-1 border-t border-slate-900 flex items-center justify-between text-[11px]">
                          <span className="text-slate-400">Levantamento Radiométrico:</span>
                          <span className="text-emerald-400 font-medium">{eq.radiationSurveyDate}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-1 text-xs">
                      <button
                        onClick={() => handleWhatsAppTechnician(eq)}
                        className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Chamar Técnico</span>
                      </button>
                      <button
                        onClick={() => setMaintenanceEquip(eq)}
                        className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold flex items-center space-x-1"
                      >
                        <Wrench className="w-3.5 h-3.5" />
                        <span>Registrar Manutenção</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* ABA 4: POPS & TERMO DE CIÊNCIA DIGITAL                         */}
        {/* ============================================================== */}
        {activeTab === 'pops' && (
          <PopsModule
            pops={pops}
            selectedPop={selectedPop}
            onSelectPop={(pop) => {
              setSelectedPop(pop);
              setSelectedPopVersion(pop.version);
            }}
            onOpenSignModal={(pop) => setSigningPop(pop)}
            teamMembers={teamMembers}
            clinic={clinic}
            onRemindWhatsApp={(name, phone, pop) => handleNotifyCollaborator(pop, phone, name)}
            onSavePhotoEvidence={handleSavePhotoEvidence}
            onDeletePhotoEvidence={handleDeletePhotoEvidence}
          />
        )}

        {/* ============================================================== */}
        {/* ABA 5: SEGURANÇA DO PACIENTE (NSP)                             */}
        {/* ============================================================== */}
        {activeTab === 'safety' && (
          <PatientSafetyCenter
            incidents={incidents}
            teamMembers={teamMembers}
            onOpenNewIncident={() => setIsNewIncidentOpen(true)}
            onNavigateToTraceability={() => setActiveTab('traceability')}
          />
        )}

        {/* ============================================================== */}
        {/* ABA 6: RASTREABILIDADE (INSTRUMENTAL X PACIENTE - RDC 1002)    */}
        {/* ============================================================== */}
        {activeTab === 'traceability' && (
          <TraceabilityModule
            packages={packages}
            batches={batches}
            onOpenScanner={() => setIsScannerOpen(true)}
            onViewPhoto={(data) => setLightboxData(data)}
          />
        )}

        {/* ============================================================== */}
        {/* ABA 6: CLÍNICA & EQUIPE (CADASTRO RT, ASB/TSB E DADOS GERAIS)  */}
        {/* ============================================================== */}
        {activeTab === 'team' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Cabeçalho */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                  <Building2 className="w-5 h-5 text-cyan-400" />
                  <span>Gestão da Clínica, Responsável Técnico e Equipe</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Preencha os campos obrigatórios abaixo para regularizar o cadastro da clínica na Vigilância Sanitária (RDC 1002/2025).
                </p>
              </div>

              <button
                onClick={() => setIsNewMemberOpen(true)}
                className="flex items-center space-x-1.5 px-3.5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs shadow-md transition"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Adicionar Colaborador (ASB/TSB)</span>
              </button>
            </div>

            {/* SEÇÃO 1: DADOS SANITÁRIOS DA CLÍNICA */}
            <form onSubmit={handleSaveClinic} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <FileBadge className="w-5 h-5 text-cyan-400" />
                  <h3 className="font-bold text-sm text-slate-100">1. Dados Cadastrais e Licença Sanitária</h3>
                </div>
                {saveSuccess && (
                  <span className="text-xs text-emerald-400 font-semibold flex items-center space-x-1 bg-emerald-950/80 px-2 py-1 rounded border border-emerald-800">
                    <Check className="w-3.5 h-3.5" />
                    <span>Dados salvos com sucesso!</span>
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="text-[11px] font-medium text-slate-400 flex items-center justify-between mb-1">
                    <span>Razão Social *</span>
                    {!clinic.legalName && <span className="text-[10px] text-amber-400 font-bold">FALTA PREENCHER</span>}
                  </label>
                  <input
                    type="text"
                    value={clinic.legalName}
                    onChange={(e) => setClinic({ ...clinic, legalName: e.target.value })}
                    placeholder="Ex: Odonto Prime Serviços Odontológicos Ltda"
                    className={`w-full bg-slate-950 border rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 ${
                      !clinic.legalName ? 'border-amber-500/60 bg-amber-950/10' : 'border-slate-700'
                    }`}
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-400 block mb-1">Nome Fantasia *</label>
                  <input
                    type="text"
                    value={clinic.name}
                    onChange={(e) => setClinic({ ...clinic, name: e.target.value })}
                    placeholder="Ex: Clínica Odonto Prime"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-400 flex items-center justify-between mb-1">
                    <span>CNPJ *</span>
                    {!clinic.cnpj && <span className="text-[10px] text-amber-400 font-bold">FALTA PREENCHER</span>}
                  </label>
                  <input
                    type="text"
                    value={clinic.cnpj}
                    onChange={(e) => setClinic({ ...clinic, cnpj: e.target.value })}
                    placeholder="00.000.000/0001-00"
                    className={`w-full bg-slate-950 border rounded-lg px-3 py-1.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-500 ${
                      !clinic.cnpj ? 'border-amber-500/60 bg-amber-950/10' : 'border-slate-700'
                    }`}
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-400 flex items-center justify-between mb-1">
                    <span>Inscrição CRO-PJ *</span>
                    {!clinic.croRegistration && <span className="text-[10px] text-amber-400 font-bold">FALTA PREENCHER</span>}
                  </label>
                  <input
                    type="text"
                    value={clinic.croRegistration}
                    onChange={(e) => setClinic({ ...clinic, croRegistration: e.target.value })}
                    placeholder="Ex: SP-CL-12345"
                    className={`w-full bg-slate-950 border rounded-lg px-3 py-1.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-500 ${
                      !clinic.croRegistration ? 'border-amber-500/60 bg-amber-950/10' : 'border-slate-700'
                    }`}
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-400 flex items-center justify-between mb-1">
                    <span>Nº do Alvará Sanitário (VISA) *</span>
                    {!clinic.sanitaryLicense && <span className="text-[10px] text-amber-400 font-bold">FALTA PREENCHER</span>}
                  </label>
                  <input
                    type="text"
                    value={clinic.sanitaryLicense}
                    onChange={(e) => setClinic({ ...clinic, sanitaryLicense: e.target.value })}
                    placeholder="Ex: VISA-SP 2026/12345-A"
                    className={`w-full bg-slate-950 border rounded-lg px-3 py-1.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-500 ${
                      !clinic.sanitaryLicense ? 'border-amber-500/60 bg-amber-950/10' : 'border-slate-700'
                    }`}
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-400 flex items-center justify-between mb-1">
                    <span>Vencimento do Alvará *</span>
                    {!clinic.licenseExpiry && <span className="text-[10px] text-amber-400 font-bold">FALTA PREENCHER</span>}
                  </label>
                  <input
                    type="date"
                    value={clinic.licenseExpiry}
                    onChange={(e) => setClinic({ ...clinic, licenseExpiry: e.target.value })}
                    className={`w-full bg-slate-950 border rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 ${
                      !clinic.licenseExpiry ? 'border-amber-500/60 bg-amber-950/10' : 'border-slate-700'
                    }`}
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-400 block mb-1">
                    Quantidade de Consultórios / Cadeiras *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={clinic.chairsCount}
                    onChange={(e) => {
                      const count = parseInt(e.target.value) || 1;
                      setClinic({
                        ...clinic,
                        chairsCount: count,
                        nspRequired: count >= 2,
                      });
                    }}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 font-bold focus:outline-none focus:border-cyan-500"
                    required
                  />
                  <span className="text-[10px] text-cyan-400 block mt-1">
                    {clinic.chairsCount >= 2
                      ? '● Com 2+ consultórios: Núcleo de Segurança do Paciente (NSP) é OBRIGATÓRIO (RDC 1002).'
                      : '● Consultório único: Isento de constituição formal de NSP.'}
                  </span>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] font-medium text-slate-400 block mb-1">Endereço Completo</label>
                  <input
                    type="text"
                    value={clinic.address || ''}
                    onChange={(e) => setClinic({ ...clinic, address: e.target.value })}
                    placeholder="Rua/Av, Número, Bairro, Cidade - UF"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-slate-800">
                <button
                  type="submit"
                  className="flex items-center space-x-1.5 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold shadow transition"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Salvar Dados Sanitários da Clínica</span>
                </button>
              </div>
            </form>

            {/* SEÇÃO 2: RESPONSÁVEL TÉCNICO (RT) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Stethoscope className="w-5 h-5 text-cyan-400" />
                  <div>
                    <h3 className="font-bold text-sm text-slate-100">
                      2. Responsável Técnico (RT) Habilitado perante o CRO e Vigilância
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Cirurgião-Dentista legalmente investido como RT segundo a Lei 4.324/64 e RDC 1002/2025
                    </p>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                    clinic.technicalResponsibleName && clinic.technicalResponsibleCro
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}
                >
                  {clinic.technicalResponsibleName && clinic.technicalResponsibleCro
                    ? 'RT HOMOLOGADO'
                    : 'FALTA DEFINIR RT'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Nome Completo do Cirurgião-Dentista RT *</label>
                  <input
                    type="text"
                    value={clinic.technicalResponsibleName || ''}
                    onChange={(e) => setClinic({ ...clinic, technicalResponsibleName: e.target.value })}
                    placeholder="Ex: Dr. Roberto Guimarães"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Número de Registro no CRO *</label>
                  <div className="flex space-x-1">
                    <select
                      value={clinic.technicalResponsibleCroState || 'SP'}
                      onChange={(e) => setClinic({ ...clinic, technicalResponsibleCroState: e.target.value })}
                      className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-100"
                    >
                      <option value="SP">SP</option>
                      <option value="RJ">RJ</option>
                      <option value="MG">MG</option>
                      <option value="PR">PR</option>
                      <option value="RS">RS</option>
                      <option value="SC">SC</option>
                      <option value="BA">BA</option>
                    </select>
                    <input
                      type="text"
                      value={clinic.technicalResponsibleCro || ''}
                      onChange={(e) => setClinic({ ...clinic, technicalResponsibleCro: e.target.value })}
                      placeholder="123.456"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">E-mail Profissional do RT</label>
                  <input
                    type="email"
                    value={clinic.technicalResponsibleEmail || ''}
                    onChange={(e) => setClinic({ ...clinic, technicalResponsibleEmail: e.target.value })}
                    placeholder="rt@clinica.com.br"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Telefone / WhatsApp do RT</label>
                  <input
                    type="text"
                    value={clinic.technicalResponsiblePhone || ''}
                    onChange={(e) => setClinic({ ...clinic, technicalResponsiblePhone: e.target.value })}
                    placeholder="(11) 99999-8888"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>

            {/* SEÇÃO 3: QUADRO DE COLABORADORES */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <h3 className="font-bold text-sm text-slate-100 flex items-center space-x-2">
                    <Users className="w-5 h-5 text-indigo-400" />
                    <span>3. Quadro de Colaboradores e Acessos ao Sistema ({teamMembers.length})</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Cadastre ao menos 1 ASB ou TSB para cumprir a RDC 1002 na operação da CME.
                  </p>
                </div>

                <button
                  onClick={() => setIsNewMemberOpen(true)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 rounded-lg text-xs font-semibold transition"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Novo Colaborador</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-3 hover:border-slate-700 transition"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-9 h-9 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center font-bold text-cyan-400 text-xs">
                          {member.name
                            .split(' ')
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join('')}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-100 text-xs">{member.name}</h4>
                          <span className="text-[11px] text-cyan-400 font-medium block">
                            {member.roleName}
                          </span>
                        </div>
                      </div>

                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                        {member.active ? 'ATIVO' : 'INATIVO'}
                      </span>
                    </div>

                    <div className="space-y-1 text-[11px] text-slate-400 bg-slate-900/50 p-2.5 rounded-lg border border-slate-800/80">
                      {member.councilNumber && (
                        <div className="flex justify-between">
                          <span>Registro Conselho:</span>
                          <span className="font-mono text-slate-200">
                            {member.councilState} {member.councilNumber}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>CPF:</span>
                        <span className="font-mono text-slate-300">{member.cpf}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>E-mail:</span>
                        <span className="text-slate-300 truncate max-w-[160px]">{member.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>WhatsApp:</span>
                        <span className="text-slate-300">{member.phone}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ============================================================== */}
      {/* MODAIS GLOBAIS DE OPERAÇÃO                                     */}
      {/* ============================================================== */}
      {selectedLabelPkg && (
        <CmeLabelModal pkg={selectedLabelPkg} onClose={() => setSelectedLabelPkg(null)} />
      )}

      {isScannerOpen && (
        <QrScannerModal
          packages={packages}
          onClose={() => setIsScannerOpen(false)}
          onPackageConsumed={handlePackageConsumed}
        />
      )}

      {isNewCycleOpen && (
        <NewCycleModal
          clinic={clinic}
          existingBatchesCount={batches.length}
          autoclaves={dynamicAutoclaves}
          kitTemplates={kitTemplates}
          initialKit={selectedKitForCme}
          onClose={() => {
            setIsNewCycleOpen(false);
            setSelectedKitForCme(undefined);
          }}
          onLoadStarted={(newBatch, newPkgs) => {
            handleCycleCreated(newBatch, newPkgs);
            setSelectedKitForCme(undefined);
          }}
        />
      )}

      {finalizingBatch && (
        <FinalizeCycleModal
          batch={finalizingBatch}
          onClose={() => setFinalizingBatch(null)}
          onFinalize={handleFinalizeBatch}
        />
      )}

      {isNewInstrumentOpen && (
        <NewInstrumentModal
          instrumentToEdit={editingInstrument}
          onClose={() => {
            setIsNewInstrumentOpen(false);
            setEditingInstrument(null);
          }}
          onSave={(savedInst) => {
            setInstruments((prev) => {
              const exists = prev.some((i) => i.id === savedInst.id);
              if (exists) {
                return prev.map((i) => (i.id === savedInst.id ? savedInst : i));
              }
              return [savedInst, ...prev];
            });
            setIsNewInstrumentOpen(false);
            setEditingInstrument(null);
          }}
          onDelete={(id) => {
            setInstruments((prev) => prev.filter((i) => i.id !== id));
            setIsNewInstrumentOpen(false);
            setEditingInstrument(null);
          }}
        />
      )}

      {isNewKitOpen && (
        <NewKitModal
          onClose={() => setIsNewKitOpen(false)}
          onSave={(newKit) => setKitTemplates((prev) => [newKit, ...prev])}
        />
      )}

      {isDossierOpen && <DossierModal onClose={() => setIsDossierOpen(false)} />}

      {signingPop && (
        <SignatureCanvasModal
          pop={signingPop}
          teamMembers={teamMembers}
          onClose={() => setSigningPop(null)}
          onSignatureSaved={handleSignatureSaved}
        />
      )}

      {lightboxData && (
        <PhotoLightboxModal
          title={lightboxData.title}
          photoUrl={lightboxData.photoUrl}
          type={lightboxData.type}
          batchCode={lightboxData.batchCode}
          timestamp={lightboxData.timestamp}
          operatorName={lightboxData.operatorName}
          onClose={() => setLightboxData(null)}
        />
      )}

      {maintenanceEquip && (
        <MaintenanceModal
          equipment={maintenanceEquip}
          onClose={() => setMaintenanceEquip(null)}
          onMaintenanceRecorded={handleMaintenanceRecorded}
        />
      )}

      {isNewIncidentOpen && (
        <NewIncidentModal
          teamMembers={teamMembers}
          onClose={() => setIsNewIncidentOpen(false)}
          onIncidentCreated={(newInc) => setIncidents((prev) => [newInc, ...prev])}
        />
      )}

      {isNewMemberOpen && (
        <NewMemberModal
          onClose={() => setIsNewMemberOpen(false)}
          onMemberAdded={(newMem) => setTeamMembers((prev) => [...prev, newMem])}
        />
      )}

      {isEquipmentModalOpen && (
        <EquipmentModal
          equipmentToEdit={editingEquipment}
          defaultCategory="AUTOCLAVE"
          onClose={() => {
            setIsEquipmentModalOpen(false);
            setEditingEquipment(null);
          }}
          onSave={(eq) => {
            handleSaveEquipment(eq);
            setIsEquipmentModalOpen(false);
            setEditingEquipment(null);
          }}
          onDelete={(id) => {
            handleDeleteEquipment(id);
            setIsEquipmentModalOpen(false);
            setEditingEquipment(null);
          }}
        />
      )}

      {isLoginModalOpen && (
        <LoginModal
          teamMembers={teamMembers.length > 0 ? teamMembers : MOCK_TEAM_MEMBERS}
          currentUser={currentUser}
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
          allowClose={true}
        />
      )}
    </div>
  );
}
