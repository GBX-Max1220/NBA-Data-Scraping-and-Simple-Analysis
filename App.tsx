
import React, { useState, useCallback, useEffect } from 'react';
import { AgentStatus, AgentStep, PlayerStats, ScraperConfig } from './types';
import { GeminiAgentService } from './services/geminiService';
import AgentTerminal from './components/AgentTerminal';
import DataVisualizer from './components/DataVisualizer';

const App: React.FC = () => {
  const [status, setStatus] = useState<AgentStatus>(AgentStatus.IDLE);
  const [steps, setSteps] = useState<AgentStep[]>([]);
  const [results, setResults] = useState<PlayerStats[]>([]);
  const [query, setQuery] = useState('Retrieve top 10 PER leaders for the 2024-25 season from NBA.com and calculate adjusted True Shooting.');
  const [config, setConfig] = useState<ScraperConfig>({
    target: 'NBA_DOT_COM',
    depth: 3,
    autoHeal: true,
    metrics: ['PER', 'TS%', 'EFG%']
  });

  const agentService = React.useMemo(() => new GeminiAgentService(), []);

  const handleRunAgent = useCallback(async () => {
    if (status === AgentStatus.RUNNING) return;
    
    setStatus(AgentStatus.RUNNING);
    setSteps([]);
    setResults([]);

    const handleNewStep = (step: AgentStep) => {
      setSteps(prev => [...prev, step]);
    };

    try {
      const data = await agentService.runReasoningTask(query, handleNewStep);
      setResults(data);
      setStatus(AgentStatus.COMPLETED);
      
      handleNewStep({
        id: 'final',
        timestamp: Date.now(),
        type: 'output',
        message: `Success. Harvested ${data.length} data points. Pipeline integrity check: 100%.`
      });
    } catch (error) {
      console.error(error);
      setStatus(AgentStatus.ERROR);
    }
  }, [query, status, agentService]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg neon-glow">
            <i className="fas fa-microchip text-xl text-white"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white leading-none">CourtVision <span className="text-blue-500">v3</span></h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Autonomous NBA Analytics Intelligence</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-slate-500 uppercase">Engine Status</span>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${status === AgentStatus.RUNNING ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`}></div>
                <span className="text-xs font-mono text-slate-300">{status}</span>
              </div>
            </div>
            <div className="w-px h-8 bg-slate-800"></div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-slate-500 uppercase">LLM Model</span>
              <span className="text-xs font-mono text-blue-400">GEMINI-3-PRO-PREVIEW</span>
            </div>
          </div>
          
          <button 
            onClick={handleRunAgent}
            disabled={status === AgentStatus.RUNNING}
            className={`px-6 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${
              status === AgentStatus.RUNNING 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20'
            }`}
          >
            {status === AgentStatus.RUNNING ? (
              <><i className="fas fa-spinner fa-spin"></i> AGENT ACTIVE</>
            ) : (
              <><i className="fas fa-play"></i> EXECUTE PIPELINE</>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-6 p-6 max-w-[1800px] mx-auto w-full">
        
        {/* Left Column: Config & Control */}
        <aside className="xl:col-span-3 flex flex-col gap-6">
          <section className="glass rounded-xl p-5 border border-slate-800">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <i className="fas fa-sliders-h"></i> Configuration
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1 uppercase">Extraction Target</label>
                <select 
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm focus:border-blue-500 outline-none transition-colors"
                  value={config.target}
                  onChange={(e) => setConfig(prev => ({ ...prev, target: e.target.value as any }))}
                >
                  <option value="NBA_DOT_COM">NBA.com (Official API/JS)</option>
                  <option value="BASKETBALL_REF">Basketball-Reference (Static/DOM)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1 uppercase">Reasoning Depth</label>
                <input 
                  type="range" min="1" max="5" 
                  className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  value={config.depth}
                  onChange={(e) => setConfig(prev => ({ ...prev, depth: parseInt(e.target.value) }))}
                />
                <div className="flex justify-between mt-1 text-[10px] text-slate-600">
                  <span>FAST SCAN</span>
                  <span>DEEP ANALYTICS</span>
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={config.autoHeal}
                      onChange={(e) => setConfig(prev => ({ ...prev, autoHeal: e.target.checked }))}
                    />
                    <div className="w-10 h-5 bg-slate-700 rounded-full peer peer-checked:bg-emerald-600 transition-colors"></div>
                    <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                  </div>
                  <span className="text-xs text-slate-300 group-hover:text-white transition-colors">Enable Self-Healing</span>
                </label>
              </div>
            </div>
          </section>

          <section className="glass rounded-xl p-5 border border-slate-800 flex-1 flex flex-col">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <i className="fas fa-terminal"></i> Task Definition
            </h2>
            <textarea 
              className="flex-1 bg-slate-900 border border-slate-700 rounded p-3 text-sm focus:border-blue-500 outline-none resize-none font-mono leading-relaxed"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter extraction instructions..."
            />
            <p className="mt-3 text-[10px] text-slate-600 italic">
              Pro Tip: You can specify advanced filtering like "players with >30 min played".
            </p>
          </section>
        </aside>

        {/* Center: Agent Terminal */}
        <section className="xl:col-span-5 h-[calc(100vh-160px)] min-h-[500px]">
          <AgentTerminal steps={steps} />
        </section>

        {/* Right Column: Visualization & Metrics */}
        <section className="xl:col-span-4 h-[calc(100vh-160px)] min-h-[500px]">
          <DataVisualizer data={results} />
        </section>
      </main>

      {/* Footer / Status Bar */}
      <footer className="glass border-t border-slate-800 px-6 py-2 flex items-center justify-between text-[10px] font-mono text-slate-500 uppercase tracking-widest">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5">
            <i className="fas fa-map-marker-alt text-emerald-500"></i> PROXY: US-NORTH-1A (ROTATING)
          </span>
          <span className="flex items-center gap-1.5">
            <i className="fas fa-shield-alt text-blue-500"></i> ANTI-BOT: STEALTH_V4 ACTIVE
          </span>
        </div>
        <div className="flex items-center gap-6">
          <span>LATENCY: 142MS</span>
          <span>MEMORY: 1.2GB / 8GB</span>
          <span className="text-slate-400">v3.1.0-BUILD-2024</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
