import {
  ClinicTenant,
  UserProfile,
  TeamMember,
  DentalInstrument,
  InstrumentKitTemplate,
  AutoclaveItem,
  CmeBatchItem,
  SterilePackageItem,
  EquipmentItem,
  PopItem,
  SafetyIncidentItem,
  RoutineChecklistItem,
} from './types';

// ==========================================
// CATÁLOGO DE INSTRUMENTAIS ODONTOLÓGICOS (RDC 1002 / RDC 15)
// ==========================================
export const MOCK_INSTRUMENTS: DentalInstrument[] = [
  {
    id: 'inst-01',
    name: 'Fórceps Odontológico Adulto nº 18R',
    category: 'CIRURGIA',
    criticality: 'CRITICAL',
    material: 'Aço Inox Cirúrgico AISI 420',
    brand: 'Quinelato',
    serialOrTag: 'TAG-CIR-018R',
    quantity: 6,
    maxReprocessCycles: 150,
    currentCyclesCount: 32,
    status: 'ACTIVE',
  },
  {
    id: 'inst-02',
    name: 'Fórceps Odontológico Universal nº 150',
    category: 'CIRURGIA',
    criticality: 'CRITICAL',
    material: 'Aço Inox Cirúrgico AISI 420',
    brand: 'Quinelato',
    serialOrTag: 'TAG-CIR-150U',
    quantity: 8,
    maxReprocessCycles: 150,
    currentCyclesCount: 44,
    status: 'ACTIVE',
  },
  {
    id: 'inst-03',
    name: 'Alavanca Cirúrgica Apexo Reta nº 301',
    category: 'CIRURGIA',
    criticality: 'CRITICAL',
    material: 'Aço Inox Cirúrgico AISI 420',
    brand: 'Golgran',
    serialOrTag: 'TAG-ALV-301',
    quantity: 10,
    maxReprocessCycles: 150,
    currentCyclesCount: 18,
    status: 'ACTIVE',
  },
  {
    id: 'inst-04',
    name: 'Sindesmótomo Reto Cirúrgico',
    category: 'CIRURGIA',
    criticality: 'CRITICAL',
    material: 'Aço Inox Cirúrgico AISI 420',
    brand: 'Duflex',
    serialOrTag: 'TAG-SIN-01',
    quantity: 6,
    maxReprocessCycles: 150,
    currentCyclesCount: 22,
    status: 'ACTIVE',
  },
  {
    id: 'inst-05',
    name: 'Cureta Periodontal Gracey nº 5-6',
    category: 'PERIODONTIA',
    criticality: 'CRITICAL',
    material: 'Aço Inox com Tratamento Criogênico',
    brand: 'Hu-Friedy',
    serialOrTag: 'TAG-CUR-G56',
    quantity: 12,
    maxReprocessCycles: 80,
    currentCyclesCount: 71,
    status: 'SHARPENING_DUE', // Alerta: Próximo do limite de afiação/descarte
  },
  {
    id: 'inst-06',
    name: 'Cureta Periodontal Gracey nº 11-12',
    category: 'PERIODONTIA',
    criticality: 'CRITICAL',
    material: 'Aço Inox com Tratamento Criogênico',
    brand: 'Hu-Friedy',
    serialOrTag: 'TAG-CUR-G1112',
    quantity: 12,
    maxReprocessCycles: 80,
    currentCyclesCount: 45,
    status: 'ACTIVE',
  },
  {
    id: 'inst-07',
    name: 'Espelho Bucal Plano nº 5 com Cabo Rosqueável',
    category: 'DENTISTICA',
    criticality: 'SEMI_CRITICAL',
    material: 'Aço Inox e Vidro Espelhado Rodiado',
    brand: 'Golgran',
    serialOrTag: 'TAG-ESP-05',
    quantity: 30,
    maxReprocessCycles: 200,
    currentCyclesCount: 88,
    status: 'ACTIVE',
  },
  {
    id: 'inst-08',
    name: 'Sonda Exploradora Clínica nº 5 Dupla',
    category: 'DENTISTICA',
    criticality: 'SEMI_CRITICAL',
    material: 'Aço Inox Cirúrgico AISI 420',
    brand: 'Golgran',
    serialOrTag: 'TAG-SON-05',
    quantity: 25,
    maxReprocessCycles: 200,
    currentCyclesCount: 92,
    status: 'ACTIVE',
  },
  {
    id: 'inst-09',
    name: 'Pinça de Algodão Clínica nº 17',
    category: 'DENTISTICA',
    criticality: 'SEMI_CRITICAL',
    material: 'Aço Inox Cirúrgico AISI 420',
    brand: 'Duflex',
    serialOrTag: 'TAG-PIN-17',
    quantity: 25,
    maxReprocessCycles: 200,
    currentCyclesCount: 114,
    status: 'ACTIVE',
  },
  {
    id: 'inst-10',
    name: 'Alicate Ortodôntico 139 (Angle / Meia Cana)',
    category: 'ORTODONTIA',
    criticality: 'SEMI_CRITICAL',
    material: 'Aço Inox com Ponta de Wídea',
    brand: 'Morelli',
    serialOrTag: 'TAG-ORT-139',
    quantity: 4,
    maxReprocessCycles: 150,
    currentCyclesCount: 41,
    status: 'ACTIVE',
  },
];

export const MOCK_KIT_TEMPLATES: InstrumentKitTemplate[] = [
  {
    id: 'kit-tmpl-01',
    code: 'KIT-CIR-01',
    name: 'Kit Cirúrgico de Exodontia Simples / Perio',
    specialty: 'Cirurgia e Traumatologia Bucomaxilofacial',
    criticality: 'CRITICAL',
    defaultPackaging: 'Grau Cirúrgico 10x25cm',
    itemsList: [
      '1x Fórceps Adulto 18R',
      '1x Alavanca Apexo Reta 301',
      '1x Sindesmótomo Reto',
      '1x Cabo de Bisturi nº 3',
      '1x Pinça Anatômica Serrilhada',
      '1x Porta-Agulhas Mayo-Hegar',
    ],
    active: true,
  },
  {
    id: 'kit-tmpl-02',
    code: 'KIT-CLIN-01',
    name: 'Kit Clínico Básico (Exame / Diagnóstico)',
    specialty: 'Clínica Geral e Diagnóstico Oral',
    criticality: 'SEMI_CRITICAL',
    defaultPackaging: 'Grau Cirúrgico 9x23cm',
    itemsList: [
      '1x Espelho Bucal Plano nº 5',
      '1x Sonda Exploradora nº 5 Dupla',
      '1x Pinça de Algodão nº 17',
      '1x Escavador de Dentina nº 17',
    ],
    active: true,
  },
  {
    id: 'kit-tmpl-03',
    code: 'KIT-PERIO-02',
    name: 'Kit Raspagem e Alisamento Radicular',
    specialty: 'Periodontia',
    criticality: 'CRITICAL',
    defaultPackaging: 'Grau Cirúrgico 10x25cm',
    itemsList: [
      '1x Sonda Milimetrada OMS / Carolina do Norte',
      '1x Cureta Gracey 5-6 (Dentes Anteriores)',
      '1x Cureta Gracey 11-12 (Mesial de Posteriores)',
      '1x Cureta Gracey 13-14 (Distal de Posteriores)',
    ],
    active: true,
  },
  {
    id: 'kit-tmpl-04',
    code: 'KIT-ORTO-03',
    name: 'Kit Instalação e Ativação Ortodôntica',
    specialty: 'Ortodontia',
    criticality: 'SEMI_CRITICAL',
    defaultPackaging: 'Grau Cirúrgico 15x30cm',
    itemsList: [
      '1x Alicate 139 Angle',
      '1x Alicate de Corte Distal',
      '1x Pinça Porta-Braquetes',
      '1x Estilete Aplicador de Elásticos',
    ],
    active: true,
  },
  {
    id: 'kit-tmpl-05',
    code: 'KIT-IMPL-04',
    name: 'Caixa Inox de Implantodontia Completa',
    specialty: 'Implantodontia',
    criticality: 'CRITICAL',
    defaultPackaging: 'Caixa Inox Perfurada com Papel Crepado',
    itemsList: [
      '1x Catraca Cirúrgica de Torque Dinâmico',
      '1x Jogo de Chaves Protéticas Hexagonais',
      '1x Paralelizadores e Guia Cirúrgico',
      '1x Cabo extensor de fresa',
    ],
    active: true,
  },
];

// ==========================================
// ESTADO 1: CLÍNICA MODELO (DEMO COMPLETA)
// ==========================================
export const CURRENT_CLINIC: ClinicTenant = {
  id: 'tenant-odontoshield-01',
  name: 'Clínica OdontoInova & Saúde Integrada',
  legalName: 'OdontoInova Serviços Odontológicos Ltda',
  cnpj: '38.452.981/0001-90',
  sanitaryLicense: 'VISA-SP 2026/89441-A',
  licenseExpiry: '2027-04-15',
  croRegistration: 'SP-CL-18492',
  chairsCount: 3,
  nspRequired: true,
  nspStatus: 'ACTIVE',
  address: 'Av. Paulista, 1800, Conjunto 42 - Bela Vista, São Paulo - SP',
  phone: '(11) 3288-4400',
  technicalResponsibleName: 'Dr. Rodrigo Mendes',
  technicalResponsibleCro: '102.450',
  technicalResponsibleCroState: 'SP',
  technicalResponsibleEmail: 'dr.rodrigo@odontoinova.com.br',
  technicalResponsiblePhone: '(11) 98765-4321',
};

export const CURRENT_USER: UserProfile = {
  id: 'user-asb-01',
  name: 'Maria Silva',
  email: 'maria.asb@odontoinova.com.br',
  role: 'DENTAL_ASSISTANT',
  roleName: 'Auxiliar em Saúde Bucal (ASB)',
  croNumber: 'ASB-SP 44.890',
  croState: 'SP',
};

// ==========================================
// ESTADO 2: NOVO USUÁRIO / CLÍNICA RECÉM-CRIADA
// ==========================================
export const EMPTY_NEW_CLINIC: ClinicTenant = {
  id: 'tenant-nova-clinica-01',
  name: 'Clínica Odonto Prime (Novo Cadastro)',
  legalName: '',
  cnpj: '',
  sanitaryLicense: '',
  licenseExpiry: '',
  croRegistration: '',
  chairsCount: 2,
  nspRequired: true,
  nspStatus: 'PENDING',
  address: '',
  phone: '',
  technicalResponsibleName: '',
  technicalResponsibleCro: '',
  technicalResponsibleCroState: 'SP',
  technicalResponsibleEmail: '',
  technicalResponsiblePhone: '',
};

export const EMPTY_NEW_USER: UserProfile = {
  id: 'user-new-01',
  name: 'Dr. Lucas Ribeiro (Gestor)',
  email: 'lucas.gestor@odontoprime.com.br',
  role: 'CLINIC_ADMIN',
  roleName: 'Administrador da Clínica',
};

export const EMPTY_NEW_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'user-new-01',
    name: 'Dr. Lucas Ribeiro',
    email: 'lucas.gestor@odontoprime.com.br',
    phone: '(11) 99123-4455',
    role: 'CLINIC_ADMIN',
    roleName: 'Administrador da Clínica',
    cpf: '321.654.987-00',
    active: true,
    joinedAt: '2026-10-26',
    lastActive: 'Online agora',
  },
];

export const MOCK_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'user-rt-01',
    name: 'Dr. Lucas Ribeiro',
    email: 'dr.lucas@odontoinova.com.br',
    phone: '(11) 98765-4321',
    role: 'TECHNICAL_RESPONSIBLE',
    roleName: 'Responsável Técnico (RT)',
    councilNumber: '102.450',
    councilState: 'SP',
    cpf: '123.456.789-00',
    pin: '1024',
    active: true,
    joinedAt: '2024-01-10',
    lastActive: 'Hoje às 17:40',
  },
  {
    id: 'user-asb-01',
    name: 'Maria Silva',
    email: 'maria.asb@odontoinova.com.br',
    phone: '(11) 98111-2233',
    role: 'DENTAL_ASSISTANT',
    roleName: 'Auxiliar em Saúde Bucal (ASB)',
    councilNumber: '44.890',
    councilState: 'SP',
    cpf: '234.567.890-11',
    pin: '1234',
    active: true,
    joinedAt: '2024-03-15',
    lastActive: 'Online agora',
  },
  {
    id: 'user-tsb-01',
    name: 'Fernanda Lima',
    email: 'fernanda.tsb@odontoinova.com.br',
    phone: '(11) 98222-3344',
    role: 'DENTAL_ASSISTANT',
    roleName: 'Técnica em Saúde Bucal (TSB)',
    councilNumber: '12.304',
    councilState: 'SP',
    cpf: '345.678.901-22',
    pin: '5678',
    active: true,
    joinedAt: '2024-06-01',
    lastActive: 'Hoje às 15:20',
  },
  {
    id: 'user-dent-01',
    name: 'Dra. Camila Vasconcelos',
    email: 'dra.camila@odontoinova.com.br',
    phone: '(11) 98333-4455',
    role: 'DENTIST',
    roleName: 'Cirurgiã-Dentista Ortodontista',
    councilNumber: '115.902',
    councilState: 'SP',
    cpf: '456.789.012-33',
    pin: '2026',
    active: true,
    joinedAt: '2024-02-20',
    lastActive: 'Hoje às 16:10',
  },
  {
    id: 'user-dent-02',
    name: 'Dr. Henrique Souza',
    email: 'dr.henrique@odontoinova.com.br',
    phone: '(11) 98444-5566',
    role: 'DENTIST',
    roleName: 'Cirurgião-Dentista Implantodontista',
    councilNumber: '98.431',
    councilState: 'SP',
    cpf: '567.890.123-44',
    pin: '4321',
    active: true,
    joinedAt: '2024-08-10',
    lastActive: 'Ontem às 18:00',
  },
  {
    id: 'user-admin-01',
    name: 'Juliana Costa',
    email: 'juliana.adm@odontoinova.com.br',
    phone: '(11) 98555-6677',
    role: 'CLINIC_ADMIN',
    roleName: 'Gestora Administrativa',
    cpf: '678.901.234-55',
    pin: '9999',
    active: true,
    joinedAt: '2024-01-05',
    lastActive: 'Hoje às 14:00',
  },
];

const CHEMICAL_STRIP_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="100" viewBox="0 0 300 100"><rect width="300" height="100" fill="%231e293b" rx="8"/><rect x="20" y="20" width="260" height="60" fill="%23f8fafc" rx="4"/><rect x="30" y="30" width="80" height="40" fill="%23059669" rx="2"/><text x="45" y="55" fill="white" font-size="12" font-family="sans-serif" font-weight="bold">OK (134°C)</text><rect x="120" y="30" width="150" height="40" fill="%23047857" rx="2"/><text x="130" y="55" fill="white" font-size="11" font-family="sans-serif">CLASSE 5 INTEGRADA</text><circle cx="280" cy="50" r="4" fill="%2310b981"/></svg>`;

const BIO_VIAL_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="200" viewBox="0 0 120 200"><rect width="120" height="200" fill="%230f172a" rx="10"/><rect x="35" y="20" width="50" height="20" fill="%237c3aed" rx="3"/><rect x="40" y="40" width="40" height="130" fill="%2338bdf8" fill-opacity="0.2" stroke="%2338bdf8" stroke-width="2" rx="6"/><circle cx="60" cy="110" r="15" fill="%238b5cf6"/><text x="60" y="160" fill="%23a7f3d0" font-size="10" font-family="sans-serif" text-anchor="middle" font-weight="bold">NEGATIVO (ROXO)</text><text x="60" y="185" fill="%2394a3b8" font-size="9" font-family="sans-serif" text-anchor="middle">24h Incubado</text></svg>`;

const SEALING_TRACK_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="120" viewBox="0 0 300 120"><rect width="300" height="120" fill="%230f172a" rx="8"/><rect x="15" y="15" width="270" height="90" fill="%23f8fafc" rx="4"/><rect x="30" y="25" width="240" height="22" fill="%230284c7" rx="2"/><text x="150" y="40" fill="white" font-size="11" font-family="sans-serif" text-anchor="middle" font-weight="bold">TRILHA TÉRMICA CONTÍNUA 8mm - SEM CANAIS</text><rect x="30" y="55" width="160" height="40" fill="%23e2e8f0" stroke="%2394a3b8" stroke-dasharray="2,2" rx="2"/><text x="40" y="70" fill="%230f172a" font-size="9" font-family="monospace" font-weight="bold">LOTE: 20261101-01</text><text x="40" y="85" fill="%23334155" font-size="8" font-family="sans-serif">VAL: 01/05/2027 | OP: Maria S.</text><circle cx="250" cy="75" r="16" fill="%2310b981"/><path d="M243 75l5 5 10-10" stroke="white" stroke-width="2.5" fill="none"/></svg>`;

const PURGE_COMPRESSOR_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="120" viewBox="0 0 300 120"><rect width="300" height="120" fill="%230f172a" rx="8"/><rect x="15" y="15" width="270" height="90" fill="%231e293b" stroke="%2338bdf8" stroke-width="1.5" rx="6"/><circle cx="55" cy="60" r="28" fill="%230369a1"/><text x="55" y="64" fill="white" font-size="12" font-family="sans-serif" text-anchor="middle" font-weight="bold">PURGA</text><text x="100" y="45" fill="%2338bdf8" font-size="12" font-family="sans-serif" font-weight="bold">DRENAGEM DO CONDENSADO OK</text><text x="100" y="65" fill="%23cbd5e1" font-size="10" font-family="sans-serif">Vaso Schulz 60L - Válvula de dreno purgada</text><text x="100" y="85" fill="%2334d399" font-size="9" font-family="monospace">Ausência de umidade residual na linha</text></svg>`;

const CAT_REPORT_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="120" viewBox="0 0 300 120"><rect width="300" height="120" fill="%230f172a" rx="8"/><rect x="15" y="15" width="270" height="90" fill="%23fff1f2" stroke="%23f43f5e" stroke-width="1.5" rx="6"/><rect x="25" y="25" width="130" height="20" fill="%23e11d48" rx="3"/><text x="90" y="38" fill="white" font-size="9" font-family="sans-serif" text-anchor="middle" font-weight="bold">CONFIDENCIAL / LGPD</text><text x="25" y="65" fill="%23881337" font-size="11" font-family="sans-serif" font-weight="bold">Protocolo PEP UPA Ref. Nº 9042/26</text><text x="25" y="82" fill="%234c0519" font-size="9" font-family="sans-serif">Testes Rápidos Fonte: Não Reagente (HIV/HCV/HBsAg)</text><circle cx="260" cy="60" r="14" fill="%23059669"/><path d="M255 60l3 3 7-7" stroke="white" stroke-width="2" fill="none"/></svg>`;

export const MOCK_AUTOCLAVES: AutoclaveItem[] = [
  {
    id: 'auto-01',
    nickname: 'Autoclave 01 (CME Principal 21L)',
    brand: 'Cristófoli',
    model: 'Vitale Class CD 21L',
    serialNumber: 'CRIS-2023-8841',
    chamberVolumeL: 21,
    lastValidation: '2026-06-10',
    validationDue: '2027-06-10',
    status: 'OPERATIONAL',
    thermalReportUrl: 'https://odontoshield.exemplo/laudos/termopares-cris8841.pdf',
  },
  {
    id: 'auto-02',
    nickname: 'Autoclave 02 (CME Apoio / Rápida 12L)',
    brand: 'Gnatus',
    model: 'Bioart Bioclave 12L',
    serialNumber: 'GN-2024-1190',
    chamberVolumeL: 12,
    lastValidation: '2026-02-14',
    validationDue: '2027-02-14',
    status: 'OPERATIONAL',
    thermalReportUrl: 'https://odontoshield.exemplo/laudos/termopares-gn1190.pdf',
  },
  {
    id: 'auto-03',
    nickname: 'Autoclave 03 (Cirurgia & Implante 21L)',
    brand: 'Dabi Atlante',
    model: 'DabiClave Pro 21L',
    serialNumber: 'DABI-2025-4412',
    chamberVolumeL: 21,
    lastValidation: '2026-05-18',
    validationDue: '2027-05-18',
    status: 'OPERATIONAL',
  },
];

export const MOCK_CME_BATCHES: CmeBatchItem[] = [
  {
    id: 'batch-01',
    batchCode: 'LOTE-20261024-01',
    shortCode: '#2610-C1',
    cycleNumber: 1,
    autoclaveName: 'Cristófoli 21L',
    operatorName: 'Maria Silva (ASB)',
    startedAt: '2026-10-24 08:15',
    temperatureC: 134.2,
    pressureBar: 2.15,
    cycleTimeMin: 45,
    physicalOk: true,
    chemicalClass5Ok: true,
    chemicalPhotoUrl: CHEMICAL_STRIP_SVG,
    hasBiological: true,
    bioResultOk: true,
    bioPhotoUrl: BIO_VIAL_SVG,
    status: 'APPROVED',
    packagesCount: 14,
  },
  {
    id: 'batch-02',
    batchCode: 'LOTE-20261024-02',
    shortCode: '#2610-C2',
    cycleNumber: 2,
    autoclaveName: 'Cristófoli 21L',
    operatorName: 'Maria Silva (ASB)',
    startedAt: '2026-10-24 13:40',
    temperatureC: 134.0,
    pressureBar: 2.10,
    cycleTimeMin: 45,
    physicalOk: true,
    chemicalClass5Ok: true,
    chemicalPhotoUrl: CHEMICAL_STRIP_SVG,
    hasBiological: false,
    status: 'APPROVED',
    packagesCount: 10,
  },
  {
    id: 'batch-03',
    batchCode: 'LOTE-20261023-02',
    shortCode: '#2510-C1',
    cycleNumber: 1,
    autoclaveName: 'Gnatus 12L',
    operatorName: 'Fernanda Lima (TSB)',
    startedAt: '2026-10-23 09:00',
    temperatureC: 121.5,
    pressureBar: 1.15,
    cycleTimeMin: 60,
    physicalOk: true,
    chemicalClass5Ok: true,
    chemicalPhotoUrl: CHEMICAL_STRIP_SVG,
    hasBiological: true,
    bioResultOk: true,
    bioPhotoUrl: BIO_VIAL_SVG,
    status: 'APPROVED',
    packagesCount: 8,
  },
];

export const MOCK_PACKAGES: SterilePackageItem[] = [
  {
    id: 'pkg-01',
    batchCode: 'LOTE-20261024-01',
    shortCode: '#2610-P01',
    qrCodeToken: 'ODONTO-20261024-001',
    packageType: 'Grau Cirúrgico 10x25cm',
    criticality: 'CRITICAL',
    description: 'Kit Cirurgia Periodontal Especial (Fórceps, Alavancas, Sindesmótomo)',
    packagedAt: '2026-10-24 07:50',
    expiresAt: '2026-11-24',
    status: 'STERILIZED',
  },
  {
    id: 'pkg-02',
    batchCode: 'LOTE-20261024-01',
    shortCode: '#2610-P02',
    qrCodeToken: 'ODONTO-20261024-002',
    packageType: 'Grau Cirúrgico 9x23cm',
    criticality: 'CRITICAL',
    description: 'Kit Clínico Básico 01 (Espelho, Sonda Exploradora, Pinça de Algodão)',
    packagedAt: '2026-10-24 07:55',
    expiresAt: '2026-11-24',
    status: 'STERILIZED',
  },
  {
    id: 'pkg-03',
    batchCode: 'LOTE-20261024-01',
    shortCode: '#2610-P03',
    qrCodeToken: 'ODONTO-20261024-003',
    packageType: 'Grau Cirúrgico 9x23cm',
    criticality: 'CRITICAL',
    description: 'Kit Clínico Básico 02 (Espelho, Sonda Exploradora, Pinça de Algodão)',
    packagedAt: '2026-10-24 07:55',
    expiresAt: '2026-11-24',
    status: 'USED',
    patientName: 'Carlos Eduardo Oliveira (Pront. #4829)',
    usedAt: '2026-10-24 10:15',
    dentistName: 'Dra. Camila Vasconcelos',
  },
  {
    id: 'pkg-04',
    batchCode: 'LOTE-20261024-02',
    shortCode: '#2610-P04',
    qrCodeToken: 'ODONTO-20261024-014',
    packageType: 'Papel Crepado Hospitalar',
    criticality: 'CRITICAL',
    description: 'Caixa Inox de Implantodontia Completa',
    packagedAt: '2026-10-24 13:00',
    expiresAt: '2026-11-24',
    status: 'STERILIZED',
  },
  {
    id: 'pkg-05',
    batchCode: 'LOTE-20261023-02',
    shortCode: '#2510-P05',
    qrCodeToken: 'ODONTO-20261023-008',
    packageType: 'Grau Cirúrgico 15x30cm',
    criticality: 'SEMI_CRITICAL',
    description: 'Kit Ortodôntico (Alicates 139, Trançador de Amarrilho, Estojo)',
    packagedAt: '2026-10-23 08:30',
    expiresAt: '2026-11-23',
    status: 'STERILIZED',
  },
  {
    id: 'pkg-06',
    batchCode: 'LOTE-20261023-02',
    shortCode: '#2510-P06',
    qrCodeToken: 'ODONTO-20261023-009',
    packageType: 'Grau Cirúrgico 9x23cm',
    criticality: 'CRITICAL',
    description: 'Kit Curetas Gracey 1-2, 5-6, 11-12, 13-14',
    packagedAt: '2026-10-23 08:45',
    expiresAt: '2026-11-23',
    status: 'USED',
    patientName: 'Mariana Souza Dias (Pront. #5011)',
    usedAt: '2026-10-24 11:30',
    dentistName: 'Dr. Rodrigo Mendes',
  },
];

export const MOCK_EQUIPMENTS: EquipmentItem[] = [
  {
    id: 'eq-01',
    name: 'Autoclave Cristófoli Vitale Class 21L',
    category: 'AUTOCLAVE',
    brand: 'Cristófoli',
    model: 'Vitale Class CD',
    serialNumber: 'CRIS-2023-8841',
    locationRoom: 'Central de Material e Esterilização (CME)',
    lastMaintenance: '2026-06-10',
    nextMaintenance: '2027-06-10',
    daysRemaining: 228,
    status: 'OK',
    hasLaudo: true,
    technicianName: 'Eng. Marcelo Antunes (Biomédica SP)',
    technicianPhone: '5511988887777',
    thermalQualificationDate: '2026-06-10',
  },
  {
    id: 'eq-02',
    name: 'Compressor Odontológico Isento de Óleo 60L',
    category: 'COMPRESSOR',
    brand: 'Schulz',
    model: 'MSV 12/60 Isento',
    serialNumber: 'SCH-9941-OILL',
    locationRoom: 'Abrigo Técnico / Casa de Máquinas',
    lastMaintenance: '2026-05-18',
    nextMaintenance: '2026-11-18',
    daysRemaining: 25,
    status: 'WARNING',
    hasLaudo: true,
    technicianName: 'Téc. Roberto Valadares',
    technicianPhone: '5511977776666',
    nr13HydrostaticTestDate: '2025-11-20',
    nr13SafetyValveCalibration: '2025-11-20',
  },
  {
    id: 'eq-03',
    name: 'Aparelho de Raio-X Intraoral de Coluna',
    category: 'RAIO_X',
    brand: 'Gnatus',
    model: 'Sommo 70kV',
    serialNumber: 'GN-RX-5520',
    locationRoom: 'Consultório 01',
    lastMaintenance: '2025-11-10',
    nextMaintenance: '2027-11-10',
    daysRemaining: 382,
    status: 'OK',
    hasLaudo: true,
    technicianName: 'Físico Médico Dr. Arnaldo Pires',
    technicianPhone: '5511966665555',
    radiationSurveyDate: '2025-11-10',
    headLeakageTestDate: '2025-11-10',
    medicalPhysicistName: 'Dr. Arnaldo Pires de Camargo',
    medicalPhysicistRegister: 'ABFM-RAD-0419 / CREA-SP 506.128',
  },
  {
    id: 'eq-04',
    name: 'Bomba de Vácuo / Sugador Cirúrgico Central',
    category: 'SUGADOR',
    brand: 'Dabi Atlante',
    model: 'Suctron 2',
    serialNumber: 'DABI-SUC-109',
    locationRoom: 'Abrigo Técnico',
    lastMaintenance: '2026-04-20',
    nextMaintenance: '2026-10-20',
    daysRemaining: -4,
    status: 'EXPIRED',
    hasLaudo: false,
    technicianName: 'Assistência Técnica OdontoPrime',
    technicianPhone: '5511955554444',
  },
];

export const MOCK_ROUTINE_CHECKLIST: RoutineChecklistItem[] = [
  {
    id: 'chk-01',
    title: 'Purga Diária do Compressor (Drenagem de Água/Condensado)',
    normativeRef: 'RDC 1002/2025 & POP-MAN-08',
    completed: true,
    completedAt: '2026-10-24 07:45',
    operatorName: 'Maria Silva (ASB)',
    requiresAction: false,
    linkedEquipmentId: 'eq-02',
  },
  {
    id: 'chk-02',
    title: 'Troca e Limpeza dos Filtros do Sugador de Saliva / Vácuo',
    normativeRef: 'RDC 1002/2025 Art. 34 & POP-MAN-08',
    completed: false,
    requiresAction: true,
    linkedEquipmentId: 'eq-04',
  },
  {
    id: 'chk-03',
    title: 'Desinfecção com Álcool 70% e Troca de Barreiras Plásticas dos Consultórios',
    normativeRef: 'POP-BIO-01 (Biossegurança)',
    completed: true,
    completedAt: '2026-10-24 07:55',
    operatorName: 'Maria Silva (ASB)',
    requiresAction: false,
  },
  {
    id: 'chk-04',
    title: 'Leitura e Registro da Ampola do Teste Biológico (24h Incubação)',
    normativeRef: 'RDC 1002/2025 Art. 47 & POP-CME-04',
    completed: true,
    completedAt: '2026-10-24 08:30',
    operatorName: 'Maria Silva (ASB)',
    requiresAction: false,
  },
];

export const MOCK_POPS: PopItem[] = [
  {
    id: 'pop-01',
    code: 'POP-BIO-01',
    title: 'Higienização, Limpeza e Desinfecção de Superfícies da Cadeira e Periferia',
    category: 'Biossegurança Clínica',
    version: 3,
    approvedByRt: 'Dr. Lucas Ribeiro',
    rtCro: '102.450',
    rtCroState: 'SP',
    approvalDate: '2026-11-01',
    reviewDue: '2028-11-01',
    validityBiennial: 'Vigência: Nov/2026 | Próxima revisão obrigatória: Nov/2028',
    summary: 'Procedimento concorrente entre pacientes e limpeza terminal diária com saneantes autorizados pela Anvisa e barreiras impermeáveis.',
    prohibitionCallout: 'Fica terminantemente proibido o uso de glutaraldeído para desinfecção de superfícies e o uso de detergentes domésticos ou abrasivos em equipamentos e estofamentos.',
    contentMarkdown: `### 1. OBJETIVO
Padronizar a descontaminação de superfícies clínicas prevenindo infecção cruzada conforme a RDC nº 1.002/2025 da Anvisa.

### 2. SANEANTES AUTORIZADOS
- Álcool etílico a 70% (p/p).
- Quaternário de Amônio de 5ª geração com ação virucida e bactericida.
- Solução de Ácido Peracético própria para superfícies fixas.

### 3. PROIBIÇÕES EXPRESSAS (RDC 1002/2025)
- Fica terminantemente proibido o uso de glutaraldeído em qualquer superfície ou ambiente clínico.
- Proibido o uso de produtos multiuso domésticos, álcool comum sem registro sanitário ou esponjas abrasivas que danifiquem o estofamento da cadeira.

### 4. PASSO A PASSO CONCORRENTE (ENTRE PACIENTES)
1. **Remoção das Barreiras:** Calçar luvas de procedimento, retirar e descartar todas as películas e barreiras plásticas contaminadas diretamente no saco branco leitoso de lixo infectante (Grupo A).
2. **Troca de Luvas & Pré-Limpeza:** Descartar as luvas, higienizar as mãos e calçar novas luvas. Em caso de presença de sangue, saliva ou matéria orgânica visível, realizar pré-limpeza mecânica com compressa de papel e detergente neutro hospitalar antes da desinfecção.
3. **Fricção Mecânica do Saneante:** Aplicar o saneante autorizado (Álcool 70% ou Quaternário de Amônio) realizando fricção mecânica vigorosa em sentido unidirecional (mínimo de 3 passagens uniformes). Respeitar rigorosamente o tempo de contato úmido exigido pelo fabricante (mínimo de 1 minuto).
4. **Descontaminação do Sistema de Sucção:** Aspirar de 200 a 300 ml de solução desinfetante não espumante pelas mangueiras de sucção e acionar a água da cuspideira para lavagem do ralo.
5. **Aplicação de Novas Barreiras Plásticas:** Aplicar novas barreiras plásticas impermeáveis nos pontos críticos de contato manual: alças do refletor, painel de comando do equipo, mangueiras, seringa tríplice e encosto de cabeça.

### 5. LIMPEZA TERMINAL DIÁRIA (AO FIM DO EXPEDIENTE)
- Realizar higienização completa de toda a estrutura da cadeira odontológica, mocho, bancadas auxiliares e carcaça do refletor.
- Esvaziamento, purga e drenagem completa das linhas de água do equipo odontológico para evitar a formação de biofilme bacteriano.`,
    signaturesCount: 4,
    totalTeamCount: 5,
    status: 'REVIEW_DUE',
    pendingCollaborators: [
      {
        id: 'colab-05',
        name: 'Dr. Henrique Souza',
        role: 'Cirurgião-Dentista Implantodontista',
        phone: '5511991234567',
        councilNumber: '119.800',
        councilState: 'SP',
      },
    ],
    signatures: [
      {
        id: 'sig-01',
        collaboratorName: 'Dr. Lucas Ribeiro',
        role: 'Responsável Técnico',
        cpf: '123.456.789-00',
        councilNumber: '102.450',
        councilState: 'SP',
        signedAt: '2026-11-01 09:30',
        ipAddress: '189.120.45.10',
        sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      },
      {
        id: 'sig-02',
        collaboratorName: 'Maria Silva',
        role: 'Auxiliar em Saúde Bucal (ASB)',
        cpf: '234.567.890-11',
        councilNumber: '44.890',
        councilState: 'SP',
        signedAt: '2026-11-01 10:15',
        ipAddress: '189.120.45.10',
        sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      },
      {
        id: 'sig-03',
        collaboratorName: 'Fernanda Lima',
        role: 'Técnica em Saúde Bucal (TSB)',
        cpf: '345.678.901-22',
        councilNumber: '12.304',
        councilState: 'SP',
        signedAt: '2026-11-01 14:00',
        ipAddress: '189.120.45.10',
        sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      },
      {
        id: 'sig-04',
        collaboratorName: 'Dra. Camila Vasconcelos',
        role: 'Cirurgiã-Dentista Ortodontista',
        cpf: '456.789.012-33',
        councilNumber: '115.902',
        councilState: 'SP',
        signedAt: '2026-11-01 16:20',
        ipAddress: '177.18.204.88',
        sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      },
    ],
    versionHistory: [
      {
        version: 3,
        approvedAt: '2026-11-01',
        approvedBy: 'Dr. Lucas Ribeiro (RT)',
        summary: 'Adequação integral às diretrizes e proibições de saneantes da RDC 1002/2025.',
        contentMarkdown: 'Texto homologado versão 3.0.',
      },
    ],
    fileSha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  },
  {
    id: 'pop-02',
    code: 'POP-CME-02',
    title: 'Processamento, Lavagem Enzimática e Secagem de Instrumentais Críticos',
    category: 'CME & Esterilização',
    version: 3,
    approvedByRt: 'Dr. Lucas Ribeiro',
    rtCro: '102.450',
    rtCroState: 'SP',
    approvalDate: '2026-11-01',
    reviewDue: '2028-11-01',
    validityBiennial: 'Vigência: Nov/2026 | Próxima revisão obrigatória: Nov/2028',
    summary: 'Fluxo unidirecional da área suja da CME, desinfecção e lavagem enzimática em cuba ultrassônica, enxágue, secagem e inspeção visual.',
    prohibitionCallout: 'É expressamente proibido o uso de esponjas de aço, palhas metálicas ou produtos abrasivos que causem ranhuras nas ligas cirúrgicas, sob risco de corrosão e retenção bacteriana.',
    contentMarkdown: `### 1. OBJETIVO
Remoção completa de matéria orgânica, sangue e biofilme de todos os instrumentais cirúrgicos e clínicos antes da esterilização.

### 2. EQUIPAMENTOS DE PROTEÇÃO INDIVIDUAL (EPIS OBRIGATÓRIOS)
- Luvas de borracha grossa de cano longo (antiderrapantes).
- Avental impermeável de manga longa.
- Máscara cirúrgica descartável ou PFF2/N95.
- Óculos de proteção com vedação lateral ou protetor facial (face shield).
- Calçado fechado impermeável antiderrapante.

### 3. PASSO A PASSO OPERACIONAL
1. **Transporte Seguro:** Transportar os artigos contaminados da sala de atendimento até a área suja (expurgo) da CME em caixas rígidas, vedadas e com tampa impermeável, evitando qualquer gotejamento no trajeto.
2. **Diluição do Detergente Enzimático:** Preparar a solução com água potável e detergente enzimático hospitalar (mínimo de 4 enzimas) respeitando estritamente a proporção volumétrica indicada pelo fabricante.
3. **Imersão Completa:** Imergir totalmente os instrumentais com as articulações totalmente abertas ou desmontados, respeitando o tempo de contato ativo de 3 a 5 minutos.
4. **Lavagem Ultrassônica e Manual:** Realizar lavagem em lavadora ultrassônica com tampa fechada para prevenir aerossóis. Complementar com escovação manual em artigos canulados usando escovas de cerdas macias de nylon. Proibido o uso de esponjas ou palhas de aço.
5. **Enxágue Copioso:** Enxaguar abundantemente cada peça em água corrente de boa qualidade até remoção completa de qualquer resíduo enzimático.
6. **Secagem Rigorosa:** Secar imediatamente os instrumentais com toalhas de papel descartáveis sem fiapos ou com jatos de ar comprimido medicinal filtrado e isento de óleo.
7. **Inspeção Visual & Lubrificação:** Inspecionar 100% dos artigos sob lupa de bancada com foco de luz procurando resíduos, manchas ou pontos de oxidação. Aplicar lubrificante hidrossolúvel próprio para autoclave nas articulações antes da embalagem.`,
    signaturesCount: 5,
    totalTeamCount: 5,
    status: 'COMPLIANT',
    pendingCollaborators: [],
    signatures: [
      {
        id: 'sig-02-1',
        collaboratorName: 'Dr. Lucas Ribeiro',
        role: 'Responsável Técnico',
        cpf: '123.456.789-00',
        councilNumber: '102.450',
        councilState: 'SP',
        signedAt: '2026-11-01 09:35',
        ipAddress: '189.120.45.10',
        sha256Hash: '9f83c605d9c5d0e01594a61fdd157475287ccbe81d3e69f0868c7b3be7e9409d',
      },
    ],
    versionHistory: [],
    fileSha256: '9f83c605d9c5d0e01594a61fdd157475287ccbe81d3e69f0868c7b3be7e9409d',
  },
  {
    id: 'pop-03',
    code: 'POP-CME-03',
    title: 'Embalagem, Selagem e Identificação com Código de Rastreabilidade',
    category: 'CME & Esterilização',
    version: 3,
    approvedByRt: 'Dr. Lucas Ribeiro',
    rtCro: '102.450',
    rtCroState: 'SP',
    approvalDate: '2026-11-01',
    reviewDue: '2028-11-01',
    validityBiennial: 'Vigência: Nov/2026 | Próxima revisão obrigatória: Nov/2028',
    summary: 'Critérios de barreira estéril, selagem térmica com friso de 6mm a 10mm e rotulagem rastreável com lote, autoclave e validade.',
    prohibitionCallout: 'Fica terminantemente proibido o uso de pranchas térmicas domésticas (chapinhas de cabelo), grampos metálicos, fita crepe comum e papel kraft como barreira microbiana.',
    contentMarkdown: `### 1. OBJETIVO
Garantir a barreira microbiana estanque de instrumentais e assegurar a rastreabilidade total de cada pacote processado até o atendimento do paciente.

### 2. CRITÉRIOS DE EMBALAGEM E BARREIRA ESTÉRIL
1. **Material Aprovado:** Utilização exclusiva de papel grau cirúrgico com filme plástico laminado multilaminado ou caixas cirúrgicas inoxidáveis perfuradas envolvidas em papel crepado hospitalar com filtro bacteriano. Proibido papel kraft ou caixas metálicas sem orifícios.
2. **Dimensionamento:** Preencher no máximo 70% da capacidade interna da embalagem, mantendo distância mínima de 3 cm livre entre os instrumentais e a borda de selagem. Proteger ponteiras cortantes com protetores siliconados para evitar perfuração do envelope.
3. **Selagem Térmica Rigorosa:** Utilizar seladora térmica odontológica calibrada, produzindo friso de selagem contínuo e uniforme com espessura mínima de 6 mm a 10 mm, sem rugas, canais, furos ou dobras.
4. **Proibições Rígidas:** É proibido expressamente o uso de pranchas térmicas (chapinhas), grampeadores ou fitas adesivas comuns não hospitalares para fechar embalagens estéreis.

### 3. ROTULAGEM EXTERNA OBRIGATÓRIA (RDC 1002/2025)
Toda embalagem que entrar na autoclave deve conter identificação externa legível preenchida antes do ciclo:
- **Nome do Kit / Conteúdo:** Ex: *Kit Cirúrgico Básico*, *Curetas Periodontais*.
- **Data de Esterilização:** Dia/Mês/Ano do ciclo.
- **Identificação do Lote & Autoclave:** Ex: *LOTE-20261101-A1-01* ou etiqueta QR Code do OdontoShield.
- **Nome do Operador:** Profissional habilitado responsável pela embalagem.
- **Prazo Limite de Validade:** Máximo de até 6 meses, desde que a embalagem permaneça íntegra, seca e armazenada em gaveteiro limpo e fechado.`,
    signaturesCount: 5,
    totalTeamCount: 5,
    status: 'COMPLIANT',
    pendingCollaborators: [],
    signatures: [
      {
        id: 'sig-03-1',
        collaboratorName: 'Dr. Lucas Ribeiro',
        role: 'Responsável Técnico',
        cpf: '123.456.789-00',
        councilNumber: '102.450',
        councilState: 'SP',
        signedAt: '2026-11-01 09:40',
        ipAddress: '189.120.45.10',
        sha256Hash: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
      },
    ],
    versionHistory: [],
    fileSha256: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
    requiresPhotoProof: true,
    photoProofConfigs: [
      {
        id: 'cme03-selagem',
        label: 'Trilha de Selagem Contínua (≥ 6mm) ou Etiqueta de Lote',
        evidenceType: 'TRILHA_SELAGEM_LOTE',
        description: 'Foto do teste de integridade da trilha de selagem térmica contínua (mínimo 6 mm) ou foto da etiqueta de rastreabilidade afixada no invólucro.',
        frequency: 'Registro amostral por lote processado',
        isMandatory: true,
      },
    ],
    photoEvidences: [
      {
        evidencia_id: 'evid-cme03-01',
        pop_codigo: 'POP-CME-03',
        clinica_id: 'clinica_01',
        ciclo_id: 'LOTE-20261101-01',
        tipo_evidencia: 'TRILHA_SELAGEM_LOTE',
        titulo_evidencia: 'Trilha de Selagem Contínua (≥ 6mm) ou Etiqueta de Lote',
        foto_url: SEALING_TRACK_SVG,
        foto_hash_sha256: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
        timestamp: '2026-11-01T09:40:00-03:00',
        operador: {
          nome: 'Maria Silva',
          cpf: '234.567.890-11',
          funcao: 'ASB',
          cro: '44.890',
          croUf: 'SP',
        },
        status_validacao: 'APROVADO',
        observacoes: 'Trilha uniforme de 8mm sem rugas ou canais de ar. Lote impresso e legível.',
      },
    ],
  },
  {
    id: 'pop-04',
    code: 'POP-CME-04',
    title: 'Operação da Autoclave e Monitoramento Físico, Químico e Biológico',
    category: 'CME & Esterilização',
    version: 4,
    approvedByRt: 'Dr. Lucas Ribeiro',
    rtCro: '102.450',
    rtCroState: 'SP',
    approvalDate: '2026-11-01',
    reviewDue: '2028-11-01',
    validityBiennial: 'Vigência: Nov/2026 | Próxima revisão obrigatória: Nov/2028',
    summary: 'Monitoramento de temperatura (134°C), pressão (2.1 bar), integrador químico Tipo 5/6 em todas as cargas e teste biológico semanal com arquivo por 5 anos.',
    prohibitionCallout: 'Cargas com integrador químico sem viragem completa ou teste biológico positivo não podem ser liberadas sob nenhuma hipótese. O lote inteiro deve ser retido e reprocessado.',
    contentMarkdown: `### 1. OBJETIVO
Assegurar os parâmetros esterilizantes de vapor saturado sob pressão, garantindo monitoramento físico, químico e biológico com registro auditável mantido por no mínimo 5 anos.

### 2. PREPARAÇÃO E DISPOSIÇÃO DA CARGA
1. **Água Destilada Exclusiva:** Abastecer o reservatório exclusivamente com água destilada ou desmineralizada de alta pureza. Nunca utilizar água de torneira ou mineral.
2. **Disposição Vertical:** Dispor os envelopes verticalmente em suportes apropriados (rack), posicionando face de papel com papel e filme plástico com filme plástico, garantindo a circulação livre do vapor e respeitando o limite máximo de 75% da capacidade volumétrica da câmara.

### 3. MONITORAMENTO FÍSICO OBRIGATÓRIO (A CADA CICLO)
- Conferir e registrar no painel OdontoShield os parâmetros físicos do ciclo:
  - **Temperatura de Platô:** 121°C ou 134°C.
  - **Pressão Manométrica:** 1.0 a 2.2 bar.
  - **Tempo de Exposição / Platô:** Tempo efetivo de esterilização.

### 4. MONITORAMENTO QUÍMICO (CLASSE 5 OU 6)
- Inserir obrigatoriamente um Integrador Químico Tipo 5 ou Emulador Tipo 6 no interior de 1 pacote teste desafio (PCD) posicionado no ponto mais crítico da câmara em **todas as cargas de esterilização**.
- Ao término do ciclo, fotografar a fita integradora no sistema para arquivamento digital da comprovação pericial.

### 5. MONITORAMENTO BIOLÓGICO SEMANAL
- Realizar teste biológico semanal com esporos de *Geobacillus stearothermophilus* no primeiro ciclo do dia.
- Incubar a ampola teste juntamente com uma ampola controle não autoclavada na incubadora específica por 24 a 48 horas (ou conforme protocolo de fluorescência rápida).
- Atestar ausência de crescimento bacteriano (negativo) antes de confirmar o lote no sistema.

### 6. CONDUTA EM CASO DE FALHA DE CICLO
- Se o integrador químico não virar totalmente ou o teste biológico positivar: interditar imediatamente a carga, recolher todos os pacotes do lote, investigar a causa, recalibrar o equipamento e reprocessar integralmente os instrumentais.`,
    signaturesCount: 5,
    totalTeamCount: 5,
    status: 'COMPLIANT',
    pendingCollaborators: [],
    signatures: [
      {
        id: 'sig-04-1',
        collaboratorName: 'Dr. Lucas Ribeiro',
        role: 'Responsável Técnico',
        cpf: '123.456.789-00',
        councilNumber: '102.450',
        councilState: 'SP',
        signedAt: '2026-11-01 09:45',
        ipAddress: '189.120.45.10',
        sha256Hash: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
      },
    ],
    versionHistory: [],
    fileSha256: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
    requiresPhotoProof: true,
    photoProofConfigs: [
      {
        id: 'cme04-integrador',
        label: 'Integrador Químico Tipo 5 ou Emulador Tipo 6',
        evidenceType: 'INTEGRADOR_QUIMICO_TIPO_5',
        description: 'Foto do integrador químico após viragem completa no pacote teste desafio (PCD) no ponto crítico da autoclave.',
        frequency: 'Obrigatório a cada ciclo de esterilização',
        isMandatory: true,
      },
      {
        id: 'cme04-biologico',
        label: 'Ampola de Teste Biológico (Geobacillus stearothermophilus)',
        evidenceType: 'INDICADOR_BIOLOGICO',
        description: 'Foto da ampola do indicador biológico após incubação de 24h comparada com a ampola controle positivo.',
        frequency: 'Obrigatório semanalmente no 1º ciclo',
        isMandatory: true,
      },
    ],
    photoEvidences: [
      {
        evidencia_id: 'evid-cme04-01',
        pop_codigo: 'POP-CME-04',
        clinica_id: 'clinica_01',
        ciclo_id: 'CICLO-142',
        tipo_evidencia: 'INTEGRADOR_QUIMICO_TIPO_5',
        titulo_evidencia: 'Integrador Químico Tipo 5 ou Emulador Tipo 6',
        foto_url: CHEMICAL_STRIP_SVG,
        foto_hash_sha256: '4a7d1ed414474e4033b0c44298fc1c149afbf4c8996fb92427ae41e4649b934c',
        timestamp: '2026-11-03T18:10:00-03:00',
        operador: {
          nome: 'Maria Silva',
          cpf: '234.567.890-11',
          funcao: 'ASB',
          cro: '44.890',
          croUf: 'SP',
        },
        status_validacao: 'APROVADO',
        observacoes: 'Viragem completa para verde escuro comprovando platô de 134°C por 45min.',
      },
      {
        evidencia_id: 'evid-cme04-02',
        pop_codigo: 'POP-CME-04',
        clinica_id: 'clinica_01',
        ciclo_id: 'CICLO-142',
        tipo_evidencia: 'INDICADOR_BIOLOGICO',
        titulo_evidencia: 'Ampola de Teste Biológico (Geobacillus stearothermophilus)',
        foto_url: BIO_VIAL_SVG,
        foto_hash_sha256: '9b36873552097cae9e03d98ffccfc8f9a2e3ce9c12239f15951d1f0ffc4c9258',
        timestamp: '2026-11-03T18:12:00-03:00',
        operador: {
          nome: 'Maria Silva',
          cpf: '234.567.890-11',
          funcao: 'ASB',
          cro: '44.890',
          croUf: 'SP',
        },
        status_validacao: 'APROVADO',
        observacoes: 'Ampola teste roxa (negativa / sem crescimento). Controle positivo amarelo conforme esperado.',
      },
    ],
  },
  {
    id: 'pop-05',
    code: 'POP-NSP-05',
    title: 'Protocolo Imediato em Acidente com Material Biológico e Perfurocortantes',
    category: 'Segurança do Paciente e Equipe',
    version: 3,
    approvedByRt: 'Dr. Lucas Ribeiro',
    rtCro: '102.450',
    rtCroState: 'SP',
    approvalDate: '2026-11-01',
    reviewDue: '2028-11-01',
    validityBiennial: 'Vigência: Nov/2026 | Próxima revisão obrigatória: Nov/2028',
    summary: 'Conduta imediata pós-exposição a material biológico, acolhimento, testagem rápida de paciente-fonte e encaminhamento para PEP em até 2 horas.',
    prohibitionCallout: 'É terminantemente proibido espremer, cortar, queimar ou cauterizar o ferimento após acidente com perfurocortante, pois tais manobras aumentam a área lesada e o risco de infecção viral.',
    contentMarkdown: `### 1. OBJETIVO
Estabelecer condutas profiláticas imediatas para minimizar os riscos de transmissão de patógenos veiculados pelo sangue (Vírus da Hepatite B, Hepatite C e HIV) após acidente ocupacional.

### 2. CONDUTA IMEDIATA LOCAL
1. **Lavagem Cuidadosa:** Lavar imediatamente e abundantemente o local da punção ou corte com água corrente e sabonete antisséptico líquido.
2. **Proibições Estritas:** Não espremer, não esfregar com força, não garrotear e não aplicar soluções cáusticas ou álcool sobre feridas abertas.
3. **Exposição de Mucosas:** Em caso de respingo em olhos, boca ou nariz, lavar exaustivamente com solução de cloreto de sódio a 0,9% (soro fisiológico estéril) ou água limpa por no mínimo 15 minutos.

### 3. CONDUTA CLÍNICA E PROFILÁTICA
1. **Comunicação Imediata:** Notificar verbalmente e registrar a ocorrência perante o Responsável Técnico da clínica.
2. **Abordagem do Paciente-Fonte:** Identificar o paciente-fonte com consentimento livre e esclarecido para realização imediata de testes rápidos para HIV, HBsAg e Anti-HCV.
3. **Encaminhamento para PEP:** Encaminhar imediatamente o profissional acidentado ao Centro de Referência / Serviço de Emergência Hospitalar (SUS/UPA) para avaliação médica infectológica e início da Profilaxia Pós-Exposição (PEP), idealmente dentro das primeiras 2 horas (prazo limite de até 72 horas).
4. **Registros Formais:** Abertura obrigatória da Comunicação de Acidente de Trabalho (CAT) e registro no livro de incidentes do Núcleo de Segurança do Paciente (NSP).`,
    signaturesCount: 4,
    totalTeamCount: 5,
    status: 'REVIEW_DUE',
    pendingCollaborators: [
      {
        id: 'colab-05',
        name: 'Dr. Henrique Souza',
        role: 'Cirurgião-Dentista Implantodontista',
        phone: '5511991234567',
        councilNumber: '119.800',
        councilState: 'SP',
      },
    ],
    signatures: [
      {
        id: 'sig-05-1',
        collaboratorName: 'Dr. Lucas Ribeiro',
        role: 'Responsável Técnico',
        cpf: '123.456.789-00',
        councilNumber: '102.450',
        councilState: 'SP',
        signedAt: '2026-11-01 09:50',
        ipAddress: '189.120.45.10',
        sha256Hash: 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3',
      },
      {
        id: 'sig-05-2',
        collaboratorName: 'Maria Silva',
        role: 'Auxiliar em Saúde Bucal (ASB)',
        cpf: '234.567.890-11',
        councilNumber: '44.890',
        councilState: 'SP',
        signedAt: '2026-11-01 10:30',
        ipAddress: '189.120.45.10',
        sha256Hash: 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3',
      },
    ],
    versionHistory: [],
    fileSha256: 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3',
    requiresPhotoProof: true,
    photoProofConfigs: [
      {
        id: 'nsp05-cat-laudo',
        label: 'Comprovante Médico / CAT / Triagem Paciente-Fonte',
        evidenceType: 'LAUDO_CAT_TESTE_RAPIDO',
        description: 'Anexo/foto do comprovante de atendimento médico de emergência, protocolo de abertura de CAT e laudo dos testes rápidos do paciente-fonte.',
        frequency: 'Por ocorrência de acidente ocupacional',
        isMandatory: true,
        confidential: true,
      },
    ],
    photoEvidences: [
      {
        evidencia_id: 'evid-nsp05-01',
        pop_codigo: 'POP-NSP-05',
        clinica_id: 'clinica_01',
        tipo_evidencia: 'LAUDO_CAT_TESTE_RAPIDO',
        titulo_evidencia: 'Comprovante Médico / CAT / Triagem Paciente-Fonte',
        foto_url: CAT_REPORT_SVG,
        foto_hash_sha256: 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3',
        timestamp: '2026-11-01T10:45:00-03:00',
        operador: {
          nome: 'Dr. Lucas Ribeiro',
          cpf: '123.456.789-00',
          funcao: 'Responsável Técnico',
          cro: '102.450',
          croUf: 'SP',
        },
        status_validacao: 'APROVADO',
        confidencial: true,
        observacoes: 'Protocolo PEP iniciado em 1h15m na UPA central. Paciente-fonte não reagente para HIV, HCV e HBsAg.',
      },
    ],
  },
  {
    id: 'pop-06',
    code: 'POP-RES-06',
    title: 'Gerenciamento, Segregação e Descarte de Resíduos Odontológicos (PGRSS)',
    category: 'Resíduos & Meio Ambiente',
    version: 3,
    approvedByRt: 'Dr. Lucas Ribeiro',
    rtCro: '102.450',
    rtCroState: 'SP',
    approvalDate: '2026-11-01',
    reviewDue: '2028-11-01',
    validityBiennial: 'Vigência: Nov/2026 | Próxima revisão obrigatória: Nov/2028',
    summary: 'Classificação, segregação na fonte geradora, descarte em coletores Descarpack e armazenamento de resíduos Grupo A, B, D e E.',
    prohibitionCallout: 'Fica proibido o reencape manual de agulhas e o descarte de resíduos químicos (amálgama, fixadores e reveladores radiográficos) na pia ou rede de esgoto comum.',
    contentMarkdown: `### 1. OBJETIVO
Segregar, acondicionar, armazenar e dar destinação correta aos resíduos gerados nos atendimentos odontológicos conforme o Plano de Gerenciamento de Resíduos de Serviços de Saúde (PGRSS) e as resoluções da Anvisa e Conama.

### 2. CLASSIFICAÇÃO E SEGREGAÇÃO NA FONTE GERADORA
1. **Grupo A (Resíduos Infectantes / Biológicos):**
   - Gazes, algodões, luvas de procedimento com sangue ou secreções, barreiras plásticas usadas e tecidos humanos.
   - *Acondicionamento:* Saco plástico branco leitoso impermeável, com espessura compatível e símbolo internacional de substância infectante. Fechar e recolher ao atingir 2/3 da capacidade ou a cada 48 horas.
2. **Grupo E (Resíduos Perfurocortantes):**
   - Agulhas de anestesia, lâminas de bisturi, brocas, limas endodônticas, fios de sutura e tubetes de vidro quebrados.
   - *Acondicionamento:* Recipiente rígido e estanque específico (Descarpack). Descarte imediatamente após o uso. **É expressamente proibido reencapar agulhas manualmente.** Fechar a tampa e descartar obrigatoriamente quando o nível atingir a linha pontilhada de segurança (2/3 da capacidade).
3. **Grupo B (Resíduos Químicos):**
   - Cápsulas de amálgama com resíduos de mercúrio, lâminas de chumbo de filmes radiográficos, soluções de revelador e fixador.
   - *Acondicionamento:* Armazenar em frascos plásticos rígidos e vedados com identificação externa. Encaminhar para coleta especializada licenciada. Proibido despejo na rede de esgoto.
4. **Grupo D (Resíduos Comuns):**
   - Papel toalha de secagem de mãos, embalagens secas não contaminadas e resíduos de escritório e copa.
   - *Acondicionamento:* Lixeira com saco plástico preto ou azul e acionamento obrigatório por pedal (sem contato manual).`,
    signaturesCount: 5,
    totalTeamCount: 5,
    status: 'COMPLIANT',
    pendingCollaborators: [],
    signatures: [
      {
        id: 'sig-06-1',
        collaboratorName: 'Dr. Lucas Ribeiro',
        role: 'Responsável Técnico',
        cpf: '123.456.789-00',
        councilNumber: '102.450',
        councilState: 'SP',
        signedAt: '2026-11-01 09:55',
        ipAddress: '189.120.45.10',
        sha256Hash: 'bc9453982e5b72cb06e7884ffaeef4923e3cb98e404be1b1f9b3ec7e62a04917',
      },
    ],
    versionHistory: [],
    fileSha256: 'bc9453982e5b72cb06e7884ffaeef4923e3cb98e404be1b1f9b3ec7e62a04917',
  },
  {
    id: 'pop-07',
    code: 'POP-BIO-07',
    title: 'Higienização das Mãos e Uso Racional de EPIs',
    category: 'Biossegurança Clínica',
    version: 3,
    approvedByRt: 'Dr. Lucas Ribeiro',
    rtCro: '102.450',
    rtCroState: 'SP',
    approvalDate: '2026-11-01',
    reviewDue: '2028-11-01',
    validityBiennial: 'Vigência: Nov/2026 | Próxima revisão obrigatória: Nov/2028',
    summary: 'Técnica de higienização simples e antisséptica das mãos, uso de adornos e sequência padronizada de paramentação e desparamentação.',
    prohibitionCallout: 'É expressamente proibido o uso de anéis, alianças, relógios, pulseiras e unhas postiças durante a assistência odontológica e nas áreas da CME (Portaria Anvisa / NR-32).',
    contentMarkdown: `### 1. OBJETIVO
Padronizar a higienização das mãos e garantir a paramentação e desparamentação adequadas para prevenir contaminações cruzadas e riscos ocupacionais.

### 2. HIGIENIZAÇÃO DAS MÃOS
- **Fricção com Álcool 70%:** Realizar fricção por 20 a 30 segundos em todas as superfícies das mãos quando não houver sujidade visível.
- **Lavagem com Água e Sabonete Líquido:** Realizar por 40 a 60 segundos antes de iniciar o turno, antes e após cada atendimento e após desparamentação.
- **Proibição de Adornos:** Manter unhas curtas e limpas. Fica estritamente proibido o uso de alianças, anéis, relógios e pulseiras.

### 3. SEQUÊNCIA OBRIGATÓRIA DE PARAMENTAÇÃO (COLOCAÇÃO)
1. Avental descartável de manga longa ou jaleco de tecido com punho elástico fechado.
2. Máscara cirúrgica de tripla camada ou máscara PFF2/N95 ajustada ao septo nasal.
3. Gorro descartável cobrindo totalmente os cabelos e orelhas.
4. Óculos de proteção com vedação lateral e protetor facial (*face shield*).
5. Higienização antisséptica das mãos com álcool 70%.
6. Calçamento das luvas de procedimento, cobrindo o punho do avental.

### 4. SEQUÊNCIA OBRIGATÓRIA DE DESPARAMENTAÇÃO (RETIRADA NA ÁREA DE RISCO)
1. **Luvas de Procedimento:** Retirar puxando pelo avesso sem tocar a pele das mãos; descartar no lixo infectante.
2. **Avental:** Desamarrar e retirar rolando a face externa contaminada para dentro.
3. **Higienização Intermediária das Mãos:** Fricção rápida com álcool 70%.
4. **Óculos de Proteção e Protetor Facial:** Retirar pelas hastes laterais e depositar em cuba para desinfecção.
5. **Gorro:** Retirar de trás para frente.
6. **Máscara:** Retirar segurando apenas pelas tiras elásticas traseiras, sem encostar na face frontal.
7. **Higienização Final das Mãos:** Lavar minuciosamente com água corrente e sabonete antisséptico líquido.`,
    signaturesCount: 5,
    totalTeamCount: 5,
    status: 'COMPLIANT',
    pendingCollaborators: [],
    signatures: [
      {
        id: 'sig-07-1',
        collaboratorName: 'Dr. Lucas Ribeiro',
        role: 'Responsável Técnico',
        cpf: '123.456.789-00',
        councilNumber: '102.450',
        councilState: 'SP',
        signedAt: '2026-11-01 10:00',
        ipAddress: '189.120.45.10',
        sha256Hash: 'c23b0a6e0c030d5b45c26915f7f3292495d4d3d14207914f17978f4b1d6e1590',
      },
    ],
    versionHistory: [],
    fileSha256: 'c23b0a6e0c030d5b45c26915f7f3292495d4d3d14207914f17978f4b1d6e1590',
  },
  {
    id: 'pop-08',
    code: 'POP-MAN-08',
    title: 'Purga Diária do Compressor e Manutenção dos Filtros de Sucção',
    category: 'Manutenção Técnica',
    version: 3,
    approvedByRt: 'Dr. Lucas Ribeiro',
    rtCro: '102.450',
    rtCroState: 'SP',
    approvalDate: '2026-11-01',
    reviewDue: '2028-11-01',
    validityBiennial: 'Vigência: Nov/2026 | Próxima revisão obrigatória: Nov/2028',
    summary: 'Drenagem do purgador do vaso de pressão do compressor, aspiração de desinfetante enzimático e limpeza de filtros coletores.',
    prohibitionCallout: 'Proibido descartar resíduos sólidos dos filtros de sucção na pia ou rede de esgoto comum. Todos os resíduos da cuspideira e mangueiras devem ser segregados no lixo infectante Grupo A.',
    contentMarkdown: `### 1. OBJETIVO
Garantir o fornecimento de ar comprimido isento de umidade e contaminantes para as peças de mão e prevenir a formação de biofilme e refluxo nos sistemas de sucção e bomba de vácuo.

### 2. ROTINA DIÁRIA DO COMPRESSOR ODONTOLÓGICO
1. **Desligamento Elétrico:** Desligar a chave disjuntora geral de alimentação elétrica do compressor ao término do expediente diário da clínica.
2. **Purga Manual do Reservatório:** Abrir lentamente a válvula de dreno/purga inferior localizada na base do reservatório de ar (vaso de pressão) até expelir totalmente o condensado de água e o ar residual úmido. Fechar firmemente a válvula após a drenagem completa.
3. **Checagem de Manômetros & Filtros de Ar:** Inspecionar visualmente os manômetros de pressão (linha de trabalho entre 6 e 8 bar) e verificar se o filtro coalescente/regulador de ar não apresenta acúmulo de óleo ou partículas.

### 3. ROTINA DIÁRIA DA UNIDADE DE SUCÇÃO / BOMBA DE VÁCUO
1. **Aspiração de Desinfetante de Mangueiras:** Ao final do dia, aspirar no mínimo de 500 ml a 1 litro de solução desinfetante e desincrustante enzimática não espumante própria para sucção odontológica por cada mangueira (alta e baixa sucção).
2. **Higienização dos Filtros Coletores:** Calçando luvas de borracha grossa, abrir os copos dos filtros coletores de resíduos situados na unidade de água da cadeira e na bomba de vácuo.
3. **Segregação dos Resíduos:** Descartar resíduos sólidos, fragmentos dentários ou amálgama contidos na peneira diretamente no saco de resíduo infectante Grupo A.
4. **Lavagem da Peneira:** Lavar a peneira plástica com escova e água corrente, desinfetar com álcool 70% e recolocar firmemente na posição original.`,
    signaturesCount: 5,
    totalTeamCount: 5,
    status: 'COMPLIANT',
    pendingCollaborators: [],
    signatures: [
      {
        id: 'sig-08-1',
        collaboratorName: 'Dr. Lucas Ribeiro',
        role: 'Responsável Técnico',
        cpf: '123.456.789-00',
        councilNumber: '102.450',
        councilState: 'SP',
        signedAt: '2026-11-01 10:05',
        ipAddress: '189.120.45.10',
        sha256Hash: '8b36873552097cae9e03d98ffccfc8f9a2e3ce9c12239f15951d1f0ffc4c9258',
      },
    ],
    versionHistory: [],
    fileSha256: '8b36873552097cae9e03d98ffccfc8f9a2e3ce9c12239f15951d1f0ffc4c9258',
    requiresPhotoProof: true,
    photoProofConfigs: [
      {
        id: 'man08-purga',
        label: 'Purga do Compressor e Limpeza dos Filtros de Sucção',
        evidenceType: 'PURGA_COMPRESSOR_SUCCAO',
        description: 'Foto comprobatória da purga do reservatório do compressor ou limpeza e desinfecção dos copos dos filtros de sucção/vácuo.',
        frequency: 'Registro semanal / rotina operacional',
        isMandatory: true,
      },
    ],
    photoEvidences: [
      {
        evidencia_id: 'evid-man08-01',
        pop_codigo: 'POP-MAN-08',
        clinica_id: 'clinica_01',
        tipo_evidencia: 'PURGA_COMPRESSOR_SUCCAO',
        titulo_evidencia: 'Purga do Compressor e Limpeza dos Filtros de Sucção',
        foto_url: PURGE_COMPRESSOR_SVG,
        foto_hash_sha256: '8b36873552097cae9e03d98ffccfc8f9a2e3ce9c12239f15951d1f0ffc4c9258',
        timestamp: '2026-11-01T10:10:00-03:00',
        operador: {
          nome: 'Maria Silva',
          cpf: '234.567.890-11',
          funcao: 'ASB',
          cro: '44.890',
          croUf: 'SP',
        },
        status_validacao: 'APROVADO',
        observacoes: 'Válvula de dreno aberta por 30s até purga total de água condensada. Filtros da sucção desobstruídos.',
      },
    ],
  },
];

export const MOCK_INCIDENTS: SafetyIncidentItem[] = [
  {
    id: 'inc-01',
    reportedAt: '2026-10-18 16:40',
    category: 'Acidente Perfurocortante com Risco Biológico',
    severity: 'MILD',
    affectedType: 'TEAM_MEMBER',
    affectedPersonName: 'Maria Silva',
    affectedPersonRole: 'Auxiliar em Saúde Bucal (ASB)',
    description: 'Agulha anestésica descartada incorretamente na bancada de lavagem da CME ao invés da caixa Descarpack. Identificada pela ASB antes de ocorrer punção cutânea (quase-erro / near miss).',
    conductTaken: 'Descarte seguro imediato com pinça clínica, lavagem das mãos e abertura de comunicado interno de segurança da equipe.',
    preventiveAction: 'Reforço do POP-BIO-01 e POP-RES-06 em reunião de alinhamento com a equipe clínica; proibição do reencape manual de agulhas.',
    reevaluationDate: '2026-11-02',
    reevaluationStatus: 'CONCLUDED',
    notivisaNotified: false,
  },
  {
    id: 'inc-02',
    reportedAt: '2026-10-22 10:30',
    category: 'Fratura de Ponta Ativa de Instrumental durante Procedimento',
    severity: 'MODERATE',
    affectedType: 'PATIENT',
    affectedPersonName: 'Carlos Eduardo Oliveira (Pront. #4829)',
    affectedPersonRole: 'Paciente',
    description: 'Fratura milimétrica da ponta da cureta Gracey 5-6 durante raspagem subgengival profunda. Fragmento identificado e removido prontamente sob aspiração cirúrgica contínua.',
    conductTaken: 'Remoção completa do fragmento metálico com pinça de campo, irrigação abundante com soro fisiológico e realização de radiografia periapical digital imediata comprovando integridade dos tecidos.',
    preventiveAction: 'Recolhimento imediato do lote de curetas para auditoria de fadiga de material e calibração de afiação; instrumental descartado do acervo.',
    reevaluationDate: '2026-11-20',
    reevaluationStatus: 'PENDING',
    notivisaNotified: false,
  },
  {
    id: 'inc-03',
    reportedAt: '2026-09-24 11:15',
    category: 'Falha de Esterilização / Monitoramento de Lote',
    severity: 'MODERATE',
    affectedType: 'ENVIRONMENT_PROCESS',
    affectedPersonName: 'Central de Material e Esterilização (CME)',
    affectedPersonRole: 'Processo / Equipamento',
    description: 'Fita de indicador químico classe 5 não atingiu viragem completa na autoclave Gnatus 12L. Carga inteira imediatamente bloqueada e reprocessada antes de qualquer distribuição para atendimento.',
    conductTaken: 'Bloqueio físico e lógico do lote #2510-C1, teste biológico com incubadora disparado e quarentena da autoclave até laudo da assistência técnica.',
    preventiveAction: 'Chamado técnico aberto com assistência autorizada; substituição da válvula solenóide e novo teste biológico aprovado antes da liberação.',
    reevaluationDate: '2026-10-15',
    reevaluationStatus: 'CONCLUDED',
    notivisaNotified: false,
  },
];
