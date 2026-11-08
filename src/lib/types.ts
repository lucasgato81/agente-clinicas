export type Role = 'CLINIC_ADMIN' | 'TECHNICAL_RESPONSIBLE' | 'DENTIST' | 'DENTAL_ASSISTANT' | 'AUDITOR_READONLY';

export interface ClinicTenant {
  id: string;
  name: string;
  legalName: string;
  cnpj: string;
  sanitaryLicense: string;
  licenseExpiry: string;
  croRegistration: string;
  chairsCount: number;
  nspRequired: boolean;
  nspStatus: 'ACTIVE' | 'PENDING' | 'EXEMPT';
  address?: string;
  phone?: string;
  technicalResponsibleName?: string;
  technicalResponsibleCro?: string;
  technicalResponsibleCroState?: string;
  technicalResponsibleEmail?: string;
  technicalResponsiblePhone?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: Role;
  roleName: string;
  croNumber?: string;
  croState?: string;
  councilNumber?: string;
  councilState?: string;
  cpf?: string;
  phone?: string;
  pin?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  roleName: string;
  councilNumber?: string;
  councilState?: string;
  cpf: string;
  pin?: string;
  active: boolean;
  joinedAt: string;
  lastActive?: string;
}

// ==========================================
// CATÁLOGO DE INSTRUMENTAIS E KITS ODONTOLÓGICOS (RDC 1002 / RDC 15)
// ==========================================
export type InstrumentCriticality = 'CRITICAL' | 'SEMI_CRITICAL';

export interface DentalInstrument {
  id: string;
  name: string;
  category: 'CIRURGIA' | 'PERIODONTIA' | 'ENDODONTIA' | 'DENTISTICA' | 'ORTODONTIA' | 'IMPLANTODONTIA';
  criticality: InstrumentCriticality;
  material: string;
  brand: string;
  serialOrTag?: string;
  quantity: number; // Quantidade de peças deste instrumental em acervo na clínica
  maxReprocessCycles: number; // Vida útil máxima de esterilizações antes de descarte/reafiação
  currentCyclesCount: number;
  status: 'ACTIVE' | 'SHARPENING_DUE' | 'DISCARDED';
}

export interface InstrumentKitTemplate {
  id: string;
  code: string; // Ex: KIT-CIR-01
  name: string;
  specialty: string;
  criticality: InstrumentCriticality;
  defaultPackaging: string; // Ex: Grau Cirúrgico 10x25cm ou Caixa Inox
  itemsList: string[]; // Lista dos instrumentais que compõem o kit
  active: boolean;
}

export interface AutoclaveItem {
  id: string;
  nickname?: string; // Ex: Autoclave 01 (Principal), Autoclave 02 (Apoio)
  brand: string;
  model: string;
  serialNumber: string;
  chamberVolumeL: number;
  lastValidation: string;
  validationDue: string;
  status: 'OPERATIONAL' | 'MAINTENANCE_DUE' | 'BLOCKED';
  thermalReportUrl?: string;
}

export interface CmeBatchItem {
  id: string;
  batchCode: string;
  shortCode: string;
  cycleNumber: number;
  autoclaveName: string;
  operatorName: string;
  startedAt: string;
  finishedAt?: string;
  temperatureC?: number;
  pressureBar?: number;
  cycleTimeMin?: number;
  physicalOk?: boolean;
  chemicalClass5Ok?: boolean;
  chemicalPhotoUrl?: string;
  hasBiological?: boolean;
  bioResultOk?: boolean;
  bioPhotoUrl?: string;
  status: 'PROCESSING' | 'APPROVED' | 'REJECTED' | 'PENDING_BIO';
  packagesCount: number;
}

export interface SterilePackageItem {
  id: string;
  batchCode: string;
  shortCode: string;
  qrCodeToken: string;
  packageType: string;
  criticality: 'CRITICAL' | 'SEMI_CRITICAL';
  description: string;
  packagedAt: string;
  expiresAt: string;
  status: 'IN_PROCESS' | 'STERILIZED' | 'USED' | 'EXPIRED' | 'DISCARDED';
  patientName?: string;
  usedAt?: string;
  dentistName?: string;
  kitTemplateId?: string;
}

export interface EquipmentItem {
  id: string;
  name: string;
  category: 'AUTOCLAVE' | 'COMPRESSOR' | 'RAIO_X' | 'SUGADOR' | 'FOTOPOLIMERIZADOR';
  brand: string;
  model: string;
  serialNumber: string;
  locationRoom: string;
  lastMaintenance: string;
  nextMaintenance: string;
  daysRemaining: number;
  status: 'OK' | 'WARNING' | 'EXPIRED';
  hasLaudo: boolean;
  technicianPhone?: string;
  technicianName?: string;
  nr13HydrostaticTestDate?: string;
  nr13SafetyValveCalibration?: string;
  thermalQualificationDate?: string;
  radiationSurveyDate?: string;
  headLeakageTestDate?: string;
  medicalPhysicistName?: string;
  medicalPhysicistRegister?: string;
}

export interface PopSignatureRecord {
  id: string;
  collaboratorName: string;
  role: string;
  cpf: string;
  councilNumber?: string;
  councilState?: string;
  signedAt: string;
  ipAddress: string;
  sha256Hash: string;
  signatureDataUrl?: string;
}

export interface PopVersionRecord {
  version: number;
  approvedAt: string;
  approvedBy: string;
  summary: string;
  contentMarkdown: string;
}

export type PhotoEvidenceType =
  | 'INTEGRADOR_QUIMICO_TIPO_5'
  | 'INDICADOR_BIOLOGICO'
  | 'TRILHA_SELAGEM_LOTE'
  | 'PURGA_COMPRESSOR_SUCCAO'
  | 'LAUDO_CAT_TESTE_RAPIDO'
  | 'OUTRO_REGISTRO_FOTOGRAFICO';

export interface PhotoProofConfig {
  id: string;
  label: string;
  evidenceType: PhotoEvidenceType;
  description: string;
  frequency: string; // Ex: 'Obrigatório por ciclo', 'Obrigatório semanal', 'Amostral por lote', 'Por ocorrência'
  isMandatory: boolean;
  confidential?: boolean; // Para LGPD/sigilo no caso de acidentes biológicos
}

export interface PhotoEvidenceRecord {
  evidencia_id: string;
  pop_codigo: string;
  clinica_id: string;
  ciclo_id?: string;
  tipo_evidencia: PhotoEvidenceType;
  titulo_evidencia?: string;
  foto_url: string; // Base64 data url ou URL
  foto_hash_sha256: string;
  timestamp: string; // ISO / UTC-3
  operador: {
    nome: string;
    cpf: string;
    funcao: string;
    cro?: string;
    croUf?: string;
  };
  status_validacao: 'APROVADO' | 'PENDENTE' | 'REJEITADO';
  observacoes?: string;
  confidencial?: boolean;
}

export interface CollaboratorPending {
  id: string;
  name: string;
  role: string;
  phone: string;
  councilNumber?: string;
  councilState?: string;
}

export interface PopItem {
  id: string;
  code: string;
  title: string;
  category: string;
  version: number;
  approvedByRt: string;
  rtCro?: string;
  rtCroState?: string;
  approvalDate: string;
  reviewDue: string;
  validityBiennial?: string; // Vigência bienal RDC 1002 Art. 16
  summary: string;
  prohibitionCallout?: string; // Proibição expressa da RDC 1002
  contentMarkdown: string;
  signaturesCount: number;
  totalTeamCount: number;
  status: 'COMPLIANT' | 'REVIEW_DUE';
  signatures: PopSignatureRecord[];
  pendingCollaborators: CollaboratorPending[];
  versionHistory: PopVersionRecord[];
  fileSha256: string;
  requiresPhotoProof?: boolean;
  photoProofConfigs?: PhotoProofConfig[];
  photoEvidences?: PhotoEvidenceRecord[];
}

export type IncidentSeverity = 'MILD' | 'MODERATE' | 'SEVERE_HARM';
export type IncidentAffectedType = 'PATIENT' | 'TEAM_MEMBER' | 'ENVIRONMENT_PROCESS';

export interface SafetyIncidentItem {
  id: string;
  reportedAt: string;
  category: string;
  severity: IncidentSeverity;
  affectedType: IncidentAffectedType; // 'PATIENT' | 'TEAM_MEMBER' | 'ENVIRONMENT_PROCESS'
  affectedPersonName: string; // Nome do paciente ou profissional da equipe afetado
  affectedPersonRole?: string; // Ex: 'Paciente', 'Cirurgião-Dentista', 'ASB', 'TSB', 'Geral'
  description: string;
  conductTaken?: string; // Conduta clínica / profilática imediata (ex: lavagem, PEP, sutura, CAT)
  preventiveAction: string;
  reevaluationDate: string;
  reevaluationStatus: 'PENDING' | 'CONCLUDED' | 'OVERDUE';
  notivisaNotified: boolean;
  notivisaProtocol?: string;
}

export interface RoutineChecklistItem {
  id: string;
  title: string;
  normativeRef: string;
  completed: boolean;
  completedAt?: string;
  operatorName?: string;
  requiresAction?: boolean;
  linkedEquipmentId?: string;
}
