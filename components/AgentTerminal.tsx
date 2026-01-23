
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
      case 'code': return <i className="fab fa-python text-emerald-400"></i>;
      case 'output': return <i className="fas fa-check-circle text-emerald-400"></i>;
      default: return <i className="fas fa-chevron-right text-gray-400"></i>;
    }
  };

  return (
    <div className="flex flex-col h-full glass rounded-lg border border-slate-800 overflow-hidden shadow-2xl">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
        </div>
        <div className="flex items-center gap-2">
          <span className="animate-pulse w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
          <span className="text-[10px] font-mono text-slate-400 tracking-widest uppercase">Python Runtime (v3.10.12)</span>
        </div>
      </div>
      <div 
        ref={terminalRef}
        className="flex-1 p-4 font-mono text-sm overflow-y-auto terminal-scroll bg-black/60"
      >
        {steps.length === 0 && (
          <div className="text-slate-600 italic">Waiting for analytical trigger...</div>
        )}
        {steps.map((step) => (
          <div key={step.id} className="mb-4 animate-in fade-in slide-in-from-left-2 duration-300">
            <div className="flex items-start gap-3">
              <span className="mt-1">{getStepIcon(step.type)}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] text-slate-600">[{new Date(step.timestamp).toLocaleTimeString([], { hour12: false })}]</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-bold tracking-tighter ${
                    step.type === 'healing' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                    step.type === 'reasoning' ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20' :
                    step.type === 'code' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                    'bg-slate-500/10 text-slate-400 border border-slate-800'
                  }`}>
                    {step.type}
                  </span>
                </div>
                <p className={`${
                  step.type === 'healing' ? 'text-amber-100/90' : 
                  step.type === 'reasoning' ? 'text-purple-100/90 italic' : 
                  step.type === 'code' ? 'text-emerald-100 font-bold' :
                  'text-slate-300'
                }`}>
                  {step.message}
                </p>
                {step.code && (
                  <div className="mt-2 bg-slate-950/80 border border-slate-800 rounded-md p-3 overflow-x-auto">
                    <pre className="text-[11px] leading-relaxed text-blue-300 whitespace-pre">
                      <code>{step.code}</code>
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgentTerminal;
