
export enum AgentStatus {
  IDLE = 'IDLE',
  RUNNING = 'RUNNING',
  ERROR = 'ERROR'
}

export type AnalysisMode = 'RANKING' | 'TREND' | 'COMPARISON' | 'PREDICTION';

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

export interface AgentStep {
  id: string;
  timestamp: number;
  type: 'reasoning' | 'action' | 'healing' | 'output' | 'code';
  message: string;
  code?: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface PlayerStats {
  id: string;
  name: string;
  team: string;
  pts: number;
  reb: number;
  ast: number;
  date?: string;
  prediction?: number; // For win probabilities or projected scores
  advanced?: {
    ts_pct: number;
    efg_pct: number;
    per: number;
  };
}

export interface AnalysisResponse {
  mode: AnalysisMode;
  summary: string;
  queryType: 'PLAYER' | 'TEAM' | 'GAME';
  metrics: string[];
  timeRange: string;
  data: PlayerStats[];
  sources?: GroundingSource[];
  pythonLog?: string;
}
