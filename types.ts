
export enum AgentStatus {
  IDLE = 'IDLE',
  RUNNING = 'RUNNING',
  HEALING = 'HEALING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export interface AgentStep {
  id: string;
  timestamp: number;
  type: 'reasoning' | 'action' | 'healing' | 'output';
  message: string;
  details?: any;
}

export interface PlayerStats {
  id: string;
  name: string;
  team: string;
  pts: number;
  reb: number;
  ast: number;
  fga: number;
  fgm: number;
  fta: number;
  ftm: number;
  tpa: number;
  tpm: number;
  turnovers: number;
  minutes: number;
  advanced?: {
    ts_pct: number;
    efg_pct: number;
    per: number;
  };
}

export interface ScraperConfig {
  target: 'NBA_DOT_COM' | 'BASKETBALL_REF';
  depth: number;
  autoHeal: boolean;
  metrics: string[];
}
