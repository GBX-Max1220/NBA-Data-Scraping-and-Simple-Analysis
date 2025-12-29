
import React, { useState, KeyboardEvent } from 'react';

interface QuestionPanelProps {
  onSend: (query: string) => void;
  isLoading: boolean;
}

const SUGGESTIONS = [
  "Top 10 PER leaders for 2024-25 season",
  "Curry vs Irving season efficiency comparison",
  "Lakers last 10 games scoring trend",
  "Most efficient scorers: PPG vs TS% matrix"
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
    <div className="glass rounded-xl p-5 border border-slate-800 shadow-2xl">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Intelligent Interface</h2>
      </div>

      <div className="relative group">
        <textarea
          rows={3}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter your NBA analysis requirements here..."
          className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-4 text-sm text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all resize-none font-sans"
        />
        <button
          onClick={handleSubmit}
          disabled={isLoading || !input.trim()}
          className={`absolute bottom-3 right-3 p-2 rounded-md transition-all ${
            isLoading || !input.trim() 
              ? 'text-slate-600 bg-slate-800' 
              : 'text-white bg-blue-600 hover:bg-blue-500 hover:scale-105 active:scale-95'
          }`}
        >
          {isLoading ? (
            <i className="fas fa-circle-notch fa-spin"></i>
          ) : (
            <i className="fas fa-paper-plane"></i>
          )}
        </button>
      </div>

      <div className="mt-4">
        <p className="text-[10px] text-slate-500 uppercase tracking-tighter mb-2">Suggestions:</p>
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((s, idx) => (
            <button
              key={idx}
              onClick={() => onSend(s)}
              disabled={isLoading}
              className="text-[11px] px-3 py-1.5 bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-blue-400 rounded-full border border-slate-700 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionPanel;
