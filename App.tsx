
import React, { useState, useCallback, useMemo } from 'react';
import { AgentStatus, AgentStep, AnalysisResponse, ScraperConfig } from './types';
import { GeminiAgentService } from './services/geminiService';
import AgentTerminal from './components/AgentTerminal';
import DataVisualizer from './components/DataVisualizer';

const QUICK_QUERIES = [
  "Top 10 PER leaders this season",
  "Curry vs LeBron career comparison",
  "Jayson Tatum's last 10 games trend",
  "Efficient scorers: PPG vs TS%"
];

const App: React.FC = () => {
  const [status, setStatus] = useState<AgentStatus>(AgentStatus.IDLE);
  const [steps, setSteps] = useState<AgentStep[]>([]);
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [query, setQuery] = useState('Retrieve top 10 PER leaders for the 2024-25 season and calculate adjusted True Shooting.');
  const [config, setConfig] = useState<ScraperConfig>({
    target: 'NBA_DOT_COM',
    depth: 3,
    autoHeal: true,
    metrics: ['PER', 'TS%', 'EFG%']
  });

  const agentService = useMemo(() => new GeminiAgentService(), []);

  const handleRunAgent = useCallback(async (customQuery?: string) => {
    if (status === AgentStatus.RUNNING) return;
    
    const activeQuery = customQuery || query;
    setStatus(AgentStatus.RUNNING);
    setSteps([]);
    setAnalysis(null);

    const handleNewStep = (step: AgentStep) => {
      setSteps(prev => [...prev, step]);
    };

    try {
      const result = await agentService.runReasoningTask(activeQuery, handleNewStep);
      setAnalysis(result);
      setStatus(AgentStatus.COMPLETED);
      
      if (result.data.length > 0) {
        handleNewStep({
          id: 'final',
          timestamp: Date.now(),
          type: 'output',
          message: `Pipeline complete. Identified ${result.mode} intent. Visualization rendered.`
        });
      }
    } catch (error) {
      console.error(error);
      setStatus(AgentStatus.ERROR);
    }
  }, [query, status, agentService]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg neon-glow">
            <i className="fas fa-basketball-ball text-xl text-white"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white leading-none">CourtVision <span className="text-blue-500">v3</span></h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Professional Autonomous Analytics</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-4 text-right">
            <div>
              <span className="text-[10px] text-slate-500 uppercase block">Engine</span>
              <span className="text-xs font-mono text-emerald-400">GEMINI-3-FLASH</span>
            </div>
            <div className="w-px h-8 bg-slate-800"></div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block">Harvest Rate</span>
              <span className="text-xs font-mono text-blue-400">420 ENT/SEC</span>
            </div>
          </div>
          
          <button 
            onClick={() => handleRunAgent()}
            disabled={status === AgentStatus.RUNNING}
            className={`px-6 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${
              status === AgentStatus.RUNNING 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20'
            }`}
          >
            {status === AgentStatus.RUNNING ? (
              <><i className="fas fa-sync fa-spin"></i> HARVESTING</>
            ) : (
              <><i className="fas fa-rocket"></i> LAUNCH AGENT</>
            )}
          </button>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-6 p-6 max-w-[1800px] mx-auto w-full">
        <aside className="xl:col-span-3 flex flex-col gap-6">
          <section className="glass rounded-xl p-5 border border-slate-800">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <i className="fas fa-terminal"></i> Command Center
            </h2>
            <textarea 
              className="w-full h-32 bg-slate-900 border border-slate-700 rounded p-3 text-sm focus:border-blue-500 outline-none resize-none font-mono leading-relaxed text-white mb-4"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter analysis request..."
            />
            
            <div className="flex flex-wrap gap-2">
              {QUICK_QUERIES.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuery(q);
                    handleRunAgent(q);
                  }}
                  className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white px-2 py-1 rounded transition-colors border border-slate-700"
                >
                  {q}
                </button>
              ))}
            </div>
          </section>

          <section className="glass rounded-xl p-5 border border-slate-800">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Pipeline Params</h2>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1 uppercase tracking-tighter">Source Cluster</label>
                <select className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-white">
                  <option>NBA.COM-OFFICIAL</option>
                  <option>BBALL-REF-LEGACY</option>
                  <option>PLAY-BY-PLAY-RAW</option>
                </select>
              </div>
              <div className="flex items-center justify-between p-2 bg-blue-500/5 rounded border border-blue-500/10">
                <span className="text-[10px] text-blue-400 font-bold uppercase">Self-Healing Scraper</span>
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
              </div>
            </div>
          </section>
        </aside>

        <section className="xl:col-span-5 h-[calc(100vh-160px)] min-h-[500px]">
          <AgentTerminal steps={steps} />
        </section>

        <section className="xl:col-span-4 h-[calc(100vh-160px)] min-h-[500px]">
          <DataVisualizer analysis={analysis} />
        </section>
      </main>

      <footer className="glass border-t border-slate-800 px-6 py-2 flex items-center justify-between text-[10px] font-mono text-slate-500">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5 uppercase">
            <i className="fas fa-circle text-emerald-500 text-[6px]"></i> Global Registry: Ready
          </span>
          <span className="uppercase">Lat: 42ms | BW: 1.2 GBPS</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-slate-600">BIGQUERY EXPORT: ENABLED</span>
          <span className="text-blue-500">PRO VERSION 3.1</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
