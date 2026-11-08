/**
 * Utilitário de Geração de Lotes Sanitários (RDC 1002/2025 & RDC 15/2012)
 * Regra: [Iniciais da Clínica]-[Data no Formato AAAAMMDD]-[Sequencial Único]
 */

export function generateBatchIdentifier(
  clinicName: string,
  existingBatchesCount: number,
  customDate?: Date,
  autoclaveNumber?: number
): { batchCode: string; shortCode: string; cycleNumber: number } {
  const date = customDate || new Date();

  // 1. Iniciais da clínica (ignora preposições como de, da, do, dos, das, e)
  const stopWords = new Set(['de', 'da', 'do', 'dos', 'das', 'e', 'em', 'com', 'para']);
  const words = (clinicName || 'Odonto Shield')
    .replace(/[^\w\s]/gi, '')
    .split(/\s+/)
    .filter((w) => w.length > 0 && !stopWords.has(w.toLowerCase()));

  let initials = words.map((w) => w[0].toUpperCase()).slice(0, 3).join('');
  if (!initials) initials = 'CLI';

  // 2. Data da esterilização
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const dateStr = `${yyyy}${mm}${dd}`; // Ex: 20261026
  const dayMonth = `${dd}${mm}`; // Ex: 2610

  // 3. Número sequencial único do cliente/dia
  const cycleNumber = existingBatchesCount + 1;
  const seqStr = String(cycleNumber).padStart(3, '0'); // Ex: 001

  // 4. Identificador da Autoclave (ex: A1, A2, A3)
  const autoTag = autoclaveNumber ? `A${autoclaveNumber}` : 'A1';

  // Lote longo oficial (para o Livro de Registro e VISA): Ex: LOTE-OI-20261026-A1-001
  const batchCode = `LOTE-${initials}-${dateStr}-${autoTag}-${seqStr}`;

  // Código Curto (para escrita manual com caneta permanente no grau cirúrgico): Ex: #OI-2610-A1-C1
  const shortCode = `#${initials}-${dayMonth}-${autoTag}-C${cycleNumber}`;

  return { batchCode, shortCode, cycleNumber };
}
