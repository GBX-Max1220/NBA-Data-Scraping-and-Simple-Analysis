
export enum AgentStatus {
  IDLE = 'IDLE',
  RUNNING = 'RUNNING',
  ERROR = 'ERROR'
}

export type AnalysisMode = 'RANKING' | 'TREND' | 'COMPARISON';

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

export interface AgentStep {
  id: string;
  timestamp: number;
  type: 'reasoning' | 'action' | 'healing' | 'output';
  message: string;
}

export interface PlayerStats {
  id: string;
  name: string;
  team: string;
  pts: number;
  reb: number;
  ast: number;
  date?: string;
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
}
