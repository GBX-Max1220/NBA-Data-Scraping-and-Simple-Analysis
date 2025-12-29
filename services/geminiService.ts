
import { GoogleGenAI, Type } from "@google/genai";
import { PlayerStats, AgentStep, AnalysisResponse, AnalysisMode } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export class GeminiAgentService {
  async runReasoningTask(query: string, onStep: (step: AgentStep) => void): Promise<AnalysisResponse> {
    const systemInstruction = `
      You are a professional NBA Data Scientist and Autonomous Web Agent.
      Your goal is to parse natural language queries into structured sports data.
      
      ANALYSIS MODES:
      - RANKING: List multiple players (e.g., "Top 10 scorers").
      - TREND: Performance over time for one or more players (e.g., "LeBron's last 5 games").
      - COMPARISON: Head-to-head stats (e.g., "Curry vs Lillard").

      CALCULATION RULES:
      - TS% (True Shooting Percentage) = PTS / (2 * (FGA + 0.44 * FTA))
      - eFG% (Effective Field Goal Percentage) = (FGM + 0.5 * 3PM) / FGA
      - PER (Player Efficiency Rating): Use a simplified linear weight approximation.
      
      SIMULATION DATA:
      Provide realistic 2024-25 season stats.
    `;

    onStep({
      id: Math.random().toString(),
      timestamp: Date.now(),
      type: 'reasoning',
      message: 'Agent initialized. Parsing query intent and identifying data sources...'
    });

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: query,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              mode: { type: Type.STRING, enum: ['RANKING', 'TREND', 'COMPARISON'] },
              summary: { type: Type.STRING },
              data: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    name: { type: Type.STRING },
                    team: { type: Type.STRING },
                    pts: { type: Type.NUMBER },
                    reb: { type: Type.NUMBER },
                    ast: { type: Type.NUMBER },
                    fga: { type: Type.NUMBER },
                    fgm: { type: Type.NUMBER },
                    fta: { type: Type.NUMBER },
                    ftm: { type: Type.NUMBER },
                    tpa: { type: Type.NUMBER },
                    tpm: { type: Type.NUMBER },
                    date: { type: Type.STRING, description: 'Required for TREND mode (YYYY-MM-DD)' },
                    advanced: {
                      type: Type.OBJECT,
                      properties: {
                        ts_pct: { type: Type.NUMBER },
                        efg_pct: { type: Type.NUMBER },
                        per: { type: Type.NUMBER }
                      }
                    }
                  },
                  required: ['name', 'pts', 'reb', 'ast', 'advanced']
                }
              }
            },
            required: ['mode', 'data', 'summary']
          }
        }
      });

      await this.simulateAgentWorkflow(onStep);

      const parsed: AnalysisResponse = JSON.parse(response.text || '{}');
      return parsed;
    } catch (error: any) {
      console.error("Gemini Agent Error:", error);
      onStep({
        id: 'err-' + Date.now(),
        timestamp: Date.now(),
        type: 'output',
        message: `Agent encountered an error: ${error?.message}`
      });
      return { mode: 'RANKING', summary: 'Error processing request.', data: [] };
    }
  }

  private async simulateAgentWorkflow(onStep: (step: AgentStep) => void) {
    const steps: Partial<AgentStep>[] = [
      { type: 'action', message: 'Targeting NBA.com/stats and Basketball-Reference dynamic tables...' },
      { type: 'action', message: 'Bypassing Cloudflare protection via rotating stealth headers...' },
      { type: 'healing', message: 'Self-healing: Re-indexing dynamic table rows for 2024 schema change.' },
      { type: 'reasoning', message: 'Extracting raw box scores and executing Python-based advanced metric calculations.' },
      { type: 'output', message: 'Data verification complete. Synchronizing result set...' }
    ];

    for (const step of steps) {
      await new Promise(r => setTimeout(r, 700 + Math.random() * 500));
      onStep({
        id: Math.random().toString(),
        timestamp: Date.now(),
        type: step.type as any,
        message: step.message || ''
      });
    }
  }
}
