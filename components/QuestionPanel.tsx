
import React, { useState, KeyboardEvent } from 'react';

interface QuestionPanelProps {
  onSend: (query: string) => void;
  isLoading: boolean;
}

const SUGGESTIONS = [
  "Predict: Lakers vs Celtics win probability",
  "Simulate: 2024 MVP race based on PER trends",
  "Cluster: NBA players into 5 archetypes",
  "Regression: Luka Doncic scoring trajectory",
  "Calculate: Adjusted TS% leaders for current season"
];

const QuestionPanel: React.FC<QuestionPanelProps> = ({ onSend, isLoading }) => {
  const [input, setInput] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!input.trim() || isLoading) return;
    onSend(input);
    setInput('');
  };

  return (
    <div className="glass rounded-xl p-5 border border-slate-800 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-1 h-full bg-blue-600 transition-all group-hover:w-1.5"></div>
      
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
        <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Analytical Command Unit</h2>
      </div>

      <div className="relative">
        <textarea
          rows={3}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter query (e.g. 'Predict Warriors win % if Curry hits 5 threes')..."
          className="w-full bg-black/40 border border-slate-700/50 rounded-lg p-4 text-sm text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all resize-none font-sans placeholder:text-slate-600"
        />
        <button
          onClick={handleSubmit}
          disabled={isLoading || !input.trim()}
          className={`absolute bottom-3 right-3 p-2.5 rounded-lg transition-all flex items-center justify-center ${
            isLoading || !input.trim() 
              ? 'text-slate-600 bg-slate-800/50' 
              : 'text-white bg-blue-600 hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:scale-105 active:scale-95'
          }`}
        >
          {isLoading ? (
            <i className="fas fa-circle-notch fa-spin text-sm"></i>
          ) : (
            <i className="fas fa-bolt text-sm"></i>
          )}
        </button>
      </div>

      <div className="mt-4">
        <p className="text-[9px] text-slate-500 uppercase tracking-tighter mb-2 font-mono">Python Scripting Templates:</p>
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((s, idx) => (
            <button
              key={idx}
              onClick={() => onSend(s)}
              disabled={isLoading}
              className="text-[10px] px-3 py-1.5 bg-slate-800/30 hover:bg-slate-700/50 text-slate-400 hover:text-emerald-400 rounded-md border border-slate-800 transition-all flex items-center gap-2"
            >
              <i className="fab fa-python text-[8px]"></i>
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionPanel;
