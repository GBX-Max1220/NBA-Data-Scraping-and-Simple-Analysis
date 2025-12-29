
import React, { useState, useCallback, useMemo } from 'react';
import { AgentStatus, AgentStep, AnalysisResponse } from './types';
import { GeminiAgentService } from './services/geminiService';
import AgentTerminal from './components/AgentTerminal';
import DataVisualizer from './components/DataVisualizer';
import QuestionPanel from './components/QuestionPanel';

const App: React.FC = () => {
  const [status, setStatus] = useState<AgentStatus>(AgentStatus.IDLE);
  const [steps, setSteps] = useState<AgentStep[]>([]);
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);

  // Initialize service
  const agentService = useMemo(() => new GeminiAgentService(), []);

  const handleAnalyzeRequest = useCallback(async (query: string) => {
    if (status === AgentStatus.RUNNING) return;

    setStatus(AgentStatus.RUNNING);
    setSteps([]);
    setAnalysis(null);

    const handleStep = (step: AgentStep) => {
      setSteps(prev => [...prev, step]);
    };

    try {
      const result = await agentService.analyze(query, handleStep);
      setAnalysis(result);
      setStatus(AgentStatus.IDLE);
      
      handleStep({
        id: 'done',
        timestamp: Date.now(),
        type: 'output',
        message: `Pipeline complete. Identified: ${result.queryType} - ${result.mode}. Report synthesized.`
      });
    } catch (error: any) {
      console.error(error);
      setStatus(AgentStatus.ERROR);
      handleStep({
        id: 'err',
        timestamp: Date.now(),
        type: 'output',
        message: `Pipeline failed: ${error?.message || 'Unknown processing error'}`
      });
    }
  }, [status, agentService]);

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-slate-200">
      {/* Header */}
      <header className="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.4)]">
            <i className="fas fa-basketball-ball text-white"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white leading-none">
              CourtVision <span className="text-blue-500 italic">Analyst</span>
            </h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">
              AI-Powered Professional NBA Analytics
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-6 text-xs font-mono">
          <div className="hidden sm:block text-right">
            <span className="text-slate-500 block uppercase text-[10px]">Processing Core</span>
            <span className="text-emerald-400">GEMINI-3-FLASH</span>
          </div>
          <div className="w-px h-8 bg-slate-800"></div>
          <div className={`flex items-center gap-2 ${status === AgentStatus.RUNNING ? 'text-blue-400' : 'text-slate-500'}`}>
            <div className={`w-2 h-2 rounded-full ${status === AgentStatus.RUNNING ? 'bg-blue-400 animate-pulse' : 'bg-slate-700'}`}></div>
            {status === AgentStatus.RUNNING ? 'ANALYZING...' : 'CORE IDLE'}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 max-w-[1800px] mx-auto w-full overflow-hidden">
        
        {/* Input & Terminal Area */}
        <div className="lg:col-span-5 flex flex-col gap-6 h-[calc(100vh-140px)]">
          <QuestionPanel 
            onSend={handleAnalyzeRequest} 
            isLoading={status === AgentStatus.RUNNING} 
          />
          <div className="flex-1 min-h-0">
            <AgentTerminal steps={steps} />
          </div>
        </div>

        {/* Results Area */}
        <div className="lg:col-span-7 h-[calc(100vh-140px)] overflow-hidden">
          <DataVisualizer analysis={analysis} />
        </div>
      </main>

      {/* Status Footer */}
      <footer className="glass border-t border-slate-800/50 px-6 py-2 flex items-center justify-between text-[10px] font-mono text-slate-500 uppercase tracking-widest">
        <div className="flex items-center gap-4">
          <span><i className="fas fa-check-circle text-emerald-500 mr-1"></i> Global System Active</span>
          <span><i className="fas fa-database text-blue-500 mr-1"></i> Sources: NBA.com / B-REF / Live API</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Latency: 28ms</span>
          <span className="text-slate-400">v3.2.5-Stable</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
