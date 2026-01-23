
import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Legend, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, Radar, Cell,
  PieChart, Pie
} from 'recharts';
import { AnalysisResponse } from '../types';

interface DataVisualizerProps {
  analysis: AnalysisResponse | null;
}

const COLORS = ['#3b82f6', '#818cf8', '#a855f7', '#ec4899', '#f43f5e'];

const DataVisualizer: React.FC<DataVisualizerProps> = ({ analysis }) => {
  const renderKey = useMemo(() => analysis ? Date.now() : 0, [analysis]);

  if (!analysis || !analysis.data || analysis.data.length === 0) return (
    <div className="flex flex-col items-center justify-center h-full glass rounded-xl text-slate-500 p-12 text-center border border-dashed border-slate-800 animate-in fade-in duration-700">
      <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-6 border border-slate-800 shadow-inner">
        <i className="fas fa-satellite-dish text-3xl opacity-20"></i>
      </div>
      <h3 className="text-slate-300 font-bold text-lg mb-2 tracking-tight">System Idle: Awaiting Analysis</h3>
      <p className="text-sm max-w-xs text-slate-500 leading-relaxed font-mono">
        Submit a command to trigger the Python-powered analytical engine.
      </p>
    </div>
  );

  const { mode, data, summary, sources } = analysis;

  const renderChart = () => {
    switch (mode) {
      case 'PREDICTION':
        // Displaying win percentages or projected outcomes
        const pieData = data.map((d, i) => ({ 
          name: d.name, 
          value: d.prediction || d.pts // fallback to pts if prediction missing
        }));
        return (
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${(value * 100).toFixed(1)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155' }}
                  formatter={(val: number) => `${(val * 100).toFixed(2)}% Win Probability`}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <div className="w-full sm:w-1/3 bg-slate-900/50 p-4 rounded-lg border border-slate-800">
              <h4 className="text-[10px] uppercase font-bold text-blue-500 mb-2">Simulated Outcome</h4>
              <p className="text-xs text-slate-400 italic font-mono">
                "Based on 10,000 Monte Carlo iterations, {data[0]?.name} has a higher projected offensive efficiency in this matchup."
              </p>
            </div>
          </div>
        );

      case 'TREND':
        return (
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={data} key={renderKey}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.3} />
              <XAxis dataKey="date" stroke="#64748b" fontSize={10} />
              <YAxis stroke="#64748b" fontSize={10} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155' }} />
              <Line type="monotone" dataKey="pts" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} name="PTS" />
              <Line type="monotone" dataKey="ast" stroke="#a855f7" strokeWidth={3} dot={{ r: 4 }} name="AST" />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'COMPARISON':
        if (data.length >= 2) {
          const radarData = [
            { subject: 'PTS', [data[0].name]: data[0].pts, [data[1].name]: data[1].pts },
            { subject: 'REB', [data[0].name]: data[0].reb, [data[1].name]: data[1].reb },
            { subject: 'AST', [data[0].name]: data[0].ast, [data[1].name]: data[1].ast },
            { subject: 'PER', [data[0].name]: data[0].advanced?.per || 0, [data[1].name]: data[1].advanced?.per || 0 },
            { subject: 'TS%', [data[0].name]: (data[0].advanced?.ts_pct || 0) * 50, [data[1].name]: (data[1].advanced?.ts_pct || 0) * 50 },
          ];
          return (
            <ResponsiveContainer width="100%" height={320}>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" stroke="#64748b" fontSize={10} />
                <Radar name={data[0].name} dataKey={data[0].name} stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
                <Radar name={data[1].name} dataKey={data[1].name} stroke="#ec4899" fill="#ec4899" fillOpacity={0.4} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          );
        }
        return null;

      case 'RANKING':
      default:
        return (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={data.slice(0, 10)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.3} />
              <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
              <YAxis stroke="#64748b" fontSize={10} />
              <Tooltip cursor={{ fill: '#ffffff10' }} contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155' }} />
              <Bar dataKey="pts" name="PTS/G" radius={[4, 4, 0, 0]}>
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="flex flex-col h-full gap-6 overflow-y-auto pr-2 terminal-scroll">
      
      <div className="glass rounded-xl p-6 border border-slate-800 shadow-xl ring-1 ring-white/5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-600/10 rounded-lg flex items-center justify-center border border-blue-500/20">
            <i className="fas fa-microchip text-blue-500"></i>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Intelligence Report</h3>
            <p className="text-[10px] text-slate-500 uppercase font-mono">Synthesized by Python Core Engine</p>
          </div>
        </div>
        <div className="prose prose-invert max-w-none">
          <p className="text-sm text-slate-300 leading-relaxed font-sans whitespace-pre-wrap">
            {summary}
          </p>
        </div>
        
        {sources && sources.length > 0 && (
          <div className="mt-6 pt-4 border-t border-slate-800">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
              <i className="fas fa-link"></i> Verification Data
            </h4>
            <div className="flex flex-wrap gap-2">
              {sources.map((source, idx) => (
                <a key={idx} href={source.uri} target="_blank" rel="noopener noreferrer" className="text-[10px] bg-slate-900 border border-slate-700 px-3 py-1 rounded-full text-slate-400 hover:border-blue-500 transition-all flex items-center gap-2">
                  <i className="fas fa-external-link-alt text-[8px]"></i>
                  {source.title.substring(0, 25)}...
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="glass rounded-xl p-6 border border-slate-800 min-h-[420px] flex flex-col shadow-xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600/10 rounded-lg flex items-center justify-center border border-purple-500/20">
              <i className="fas fa-chart-line text-purple-500"></i>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">Performance Visuals</h3>
              <p className="text-[10px] text-slate-500 uppercase font-mono">Algorithm Output: {mode}</p>
            </div>
          </div>
        </div>
        <div className="flex-1 w-full overflow-hidden">
          {renderChart()}
        </div>
      </div>
    </div>
  );
};

export default DataVisualizer;
