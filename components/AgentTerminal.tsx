
import React, { useEffect, useRef } from 'react';
import { AgentStep } from '../types';

interface AgentTerminalProps {
  steps: AgentStep[];
}

const AgentTerminal: React.FC<AgentTerminalProps> = ({ steps }) => {
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [steps]);

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'reasoning': return <i className="fas fa-brain text-purple-400"></i>;
      case 'action': return <i className="fas fa-terminal text-blue-400"></i>;
      case 'healing': return <i className="fas fa-magic text-amber-400"></i>;
      case 'output': return <i className="fas fa-check-circle text-emerald-400"></i>;
      default: return <i className="fas fa-chevron-right text-gray-400"></i>;
    }
  };

  return (
    <div className="flex flex-col h-full glass rounded-lg border border-slate-800 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
        </div>
        <span className="text-xs font-mono text-slate-500 tracking-widest uppercase">Agent Control Unit</span>
      </div>
      <div 
        ref={terminalRef}
        className="flex-1 p-4 font-mono text-sm overflow-y-auto terminal-scroll bg-black/40"
      >
        {steps.length === 0 && (
          <div className="text-slate-600 italic">Waiting for agent initialization...</div>
        )}
        {steps.map((step) => (
          <div key={step.id} className="mb-3 animate-in fade-in slide-in-from-left-2 duration-300">
            <div className="flex items-start gap-3">
              <span className="mt-1">{getStepIcon(step.type)}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] text-slate-500">[{new Date(step.timestamp).toLocaleTimeString()}]</span>
                  <span className={`text-[10px] px-1 rounded uppercase font-bold tracking-tighter ${
                    step.type === 'healing' ? 'bg-amber-500/10 text-amber-500' :
                    step.type === 'reasoning' ? 'bg-purple-500/10 text-purple-500' :
                    'bg-slate-500/10 text-slate-400'
                  }`}>
                    {step.type}
                  </span>
                </div>
                <p className={`${
                  step.type === 'healing' ? 'text-amber-100' : 
                  step.type === 'reasoning' ? 'text-purple-100 italic' : 
                  'text-slate-300'
                }`}>
                  {step.message}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgentTerminal;
