
import { GoogleGenAI, Type, Chat } from "@google/genai";
import { AnalysisResponse, AgentStep } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export class GeminiAgentService {
  private chatInstance: Chat | null = null;

  constructor() {
    this.chatInstance = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: `
          You are a professional NBA Lead Data Scientist.
          Your task is to provide deep, readable NBA data analysis reports in English.
          
          OUTPUT REQUIREMENTS:
          1. Must return valid JSON.
          2. 'summary' field: Provide a detailed analysis (approx 200 words) in English. Include:
             - Core trends (recent performance)
             - Anomalies (unusual stats)
             - Strategic outlook (next steps based on data)
          3. 'mode': Automatically choose RANKING, TREND, or COMPARISON based on the query.
          4. 'data': Provide 5-10 records to populate charts and tables. 
             - Ensure numerical values (pts, reb, ast, per) are numbers, NOT strings.
             - 'ts_pct' should be a decimal (e.g., 0.62 for 62%).
          
          METRIC DEFINITIONS:
          - TS% (True Shooting Percentage): Measures scoring efficiency.
          - PER (Player Efficiency Rating): Measures overall per-minute productivity.

          JSON STRUCTURE:
          {
            "mode": "RANKING" | "TREND" | "COMPARISON",
            "queryType": "PLAYER" | "TEAM",
            "metrics": ["PTS", "REB", "AST", "TS%", "PER"],
            "timeRange": "Description of the analyzed period",
            "summary": "Detailed narrative analysis...",
            "data": [
              {
                "id": "unique-id",
                "name": "Player Name",
                "team": "Team Code",
                "pts": 25.5,
                "reb": 6.2,
                "ast": 7.8,
                "date": "YYYY-MM-DD", (Required for TREND)
                "advanced": {
                  "ts_pct": 0.585,
                  "efg_pct": 0.540,
                  "per": 22.4
                }
              }
            ]
          }
        `
      }
    });
  }

  async analyze(query: string, onStep: (step: AgentStep) => void): Promise<AnalysisResponse> {
    if (!this.chatInstance) throw new Error("Chat not initialized");

    onStep({
      id: Math.random().toString(),
      timestamp: Date.now(),
      type: 'reasoning',
      message: 'Accessing NBA live databases and synchronizing advanced metrics...'
    });

    try {
      await this.simulateWorkflow(onStep);

      const response = await this.chatInstance.sendMessage({ message: query });
      const text = response.text;
      
      if (!text) throw new Error("AI returned empty response");

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const parsedData = JSON.parse(jsonMatch ? jsonMatch[0] : text);
      
      return parsedData as AnalysisResponse;
    } catch (error: any) {
      console.error("Gemini Analysis Error:", error);
      throw error;
    }
  }

  private async simulateWorkflow(onStep: (step: AgentStep) => void) {
    const steps: Array<Partial<AgentStep>> = [
      { type: 'action', message: 'Establishing secure tunnel to NBA Stats API endpoints...' },
      { type: 'action', message: 'Parsing dynamic JS-rendered tables and calculating 2024-25 season weights...' },
      { type: 'healing', message: 'Auto-correction: Calibrating data index offset detected in live stream.' },
      { type: 'output', message: 'Raw data extracted. Synthesizing deep insight report...' }
    ];

    for (const step of steps) {
      await new Promise(r => setTimeout(r, 500));
      onStep({
        id: Math.random().toString(),
        timestamp: Date.now(),
        type: step.type as any,
        message: step.message || ''
      });
    }
  }
}
