export type SectionId =
  | '00-guia-consola'
  | '01-soul'
  | '02-personalidad'
  | '03-prompt'
  | '04-memoria'
  | '05-comportamiento'
  | '06-ejemplos'
  | '07-telegram'
  | '08-plugged-host'
  | '09-seguridad'
  | '10-pack-final';

export type PluggedDbEngine = 'mysql' | 'postgresql';
export type HumorTone = 'sutil' | 'cercano' | 'ingenioso';
export type NodeRamTier = '8gb' | '12gb' | '16gb';

export interface NovaDeployConfig {
  ownerName: string;
  telegramUserId: string;
  botUsername: string;
  containerRoot: string;
  ollamaHost: string;
  ollamaModel: string;
  numCtx: number;
  nodeRamTier: NodeRamTier;
  pluggedDbEngine: PluggedDbEngine;
  humorTone: HumorTone;
  playwrightMaxPages: number;
}

export interface SectionNavItem {
  id: SectionId;
  index: string;
  title: string;
  shortTitle: string;
  subtitle: string;
}

export interface GeneratedFile {
  id: string;
  filename: string;
  targetPath: string;
  language: string;
  summary: string;
  content: string;
}

export interface LinuxCommandRule {
  command: string;
  category: 'sistema' | 'archivos' | 'ollama' | 'red' | 'mantenimiento';
  policy: 'permitido' | 'confirmacion' | 'bloqueado';
  scope: string;
  rationale: string;
}

export interface ConversationTurn {
  sender: 'user' | 'nova';
  time: string;
  text: string;
  internalNote?: string;
}

export interface ConversationScenario {
  id: string;
  title: string;
  topic: string;
  toolsUsed: string[];
  memoryEffect: string;
  turns: ConversationTurn[];
}
