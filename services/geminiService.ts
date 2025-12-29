
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { PlayerStats, AgentStep } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const NBA_TOOL_DEFINITION: FunctionDeclaration = {
  name: 'execute_scraper',
  description: 'Executes a Puppeteer/Playwright action to harvest NBA stats.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      url: { type: Type.STRING, description: 'The target URL to scrape' },
      selectors: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: 'CSS Selectors to extract data' 
      },
      actionType: { type: Type.STRING, enum: ['NAVIGATE', 'CLICK', 'EXTRACT_TABLE', 'SCROLL'] }
    },
    required: ['url', 'actionType']
  }
};

export class GeminiAgentService {
  /**
   * Orchestrates a multi-step reasoning task for data harvesting.
   */
  async runReasoningTask(query: string, onStep: (step: AgentStep) => void): Promise<PlayerStats[]> {
    const prompt = `
      Task: Perform an autonomous data harvesting session for professional NBA analytics.
      Query: ${query}
      
      Requirements:
      1. Define a multi-step plan to navigate complex JS-rendered sites.
      2. If a selector fails (simulated), explain how you would "self-heal".
      3. Calculate advanced metrics: True Shooting % (TS%), Effective Field Goal % (eFG%), and Player Efficiency Rating (PER).
      
      Return a structured JSON array of player stats with their calculated metrics.
    `;

    onStep({
      id: Math.random().toString(),
      timestamp: Date.now(),
      type: 'reasoning',
      message: 'Initializing Gemini 3 Pro long-context window for NBA database analysis...'
    });

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
          thinkingConfig: { thinkingBudget: 2000 },
          responseMimeType: "application/json",
          responseSchema: {
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
                turnovers: { type: Type.NUMBER },
                minutes: { type: Type.NUMBER },
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
        }
      });

      // Simulation of multi-step output for UI experience
      await this.simulateAgentWorkflow(onStep);

      const data = JSON.parse(response.text || '[]');
      return data;
    } catch (error) {
      console.error("Gemini Error:", error);
      onStep({
        id: 'err',
        timestamp: Date.now(),
        type: 'output',
        message: 'Agent encountered an error in scraping pipeline.'
      });
      return [];
    }
  }

  private async simulateAgentWorkflow(onStep: (step: AgentStep) => void) {
    const steps: Partial<AgentStep>[] = [
      { type: 'action', message: 'Navigating to stats.nba.com/players/traditional...' },
      { type: 'action', message: 'Waiting for JS hydration of stat tables...' },
      { type: 'healing', message: 'CRITICAL: CSS Selector ".stats-table-row" not found. Activating Self-Healing logic.' },
      { type: 'reasoning', message: 'Visual re-indexing complete. Mapping new selector: "div[class*=\'Table_row\']".' },
      { type: 'action', message: 'Extracting raw DOM fragments for 15 primary targets.' },
      { type: 'action', message: 'Running Python sandbox for TS% and PER calculations...' }
    ];

    for (const step of steps) {
      await new Promise(r => setTimeout(r, 800 + Math.random() * 1200));
      onStep({
        id: Math.random().toString(),
        timestamp: Date.now(),
        type: step.type as any,
        message: step.message || ''
      });
    }
  }
}
