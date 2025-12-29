
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Legend, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Cell
} from 'recharts';
import { AnalysisResponse, PlayerStats } from '../types';

interface DataVisualizerProps {
  analysis: AnalysisResponse | null;
}

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

const DataVisualizer: React.FC<DataVisualizerProps> = ({ analysis }) => {
  if (!analysis || !analysis.data || analysis.data.length === 0) return (
    <div className="flex flex-col items-center justify-center h-full glass rounded-xl text-slate-500 p-12 text-center border border-dashed border-slate-800">
      <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-6 border border-slate-800">
        <i className="fas fa-chart-line text-3xl opacity-30"></i>
      </div>
      <h3 className="text-slate-300 font-bold text-lg mb-2">Awaiting Intelligence Feed</h3>
      <p className="text-sm max-w-xs text-slate-500">Enter an analysis request to generate a professional insight report.</p>
    </div>
  );

  const { mode, data, summary } = analysis;

  const renderChart = () => {
    // Ensure data is valid for charting
    if (!data || data.length === 0) return null;

    switch (mode) {
      case 'TREND':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickFormatter={(val) => val?.includes('-') ? val.split('-').slice(1).join('/') : val} />
              <YAxis stroke="#64748b" fontSize={10} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                itemStyle={{ fontSize: '12px' }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Line type="monotone" dataKey="pts" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} name="PTS" />
              <Line type="monotone" dataKey="ast" stroke="#a855f7" strokeWidth={3} dot={{ r: 4, fill: '#a855f7' }} name="AST" />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'COMPARISON':
        if (data.length >= 2) {
          const radarData = [
            { subject: 'Scoring (PTS)', [data[0].name]: data[0].pts, [data[1].name]: data[1].pts },
            { subject: 'Rebounds (REB)', [data[0].name]: data[0].reb, [data[1].name]: data[1].reb },
            { subject: 'Assists (AST)', [data[0].name]: data[0].ast, [data[1].name]: data[1].ast },
            { subject: 'Efficiency (PER)', [data[0].name]: data[0].advanced?.per || 0, [data[1].name]: data[1].advanced?.per || 0 },
            { subject: 'Shooting (TS%)', [data[0].name]: (data[0].advanced?.ts_pct || 0) * 40, [data[1].name]: (data[1].advanced?.ts_pct || 0) * 40 },
          ];
          return (
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" stroke="#64748b" fontSize={10} />
                <Radar name={data[0].name} dataKey={data[0].name} stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
                <Radar name={data[1].name} dataKey={data[1].name} stroke="#ec4899" fill="#ec4899" fillOpacity={0.5} />
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          );
        }
        return null;

      case 'RANKING':
      default:
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.slice(0, 8)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickFormatter={(name) => name?.split(' ').pop() || name} />
              <YAxis stroke="#64748b" fontSize={10} />
              <Tooltip cursor={{ fill: '#1e293b' }} contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155' }} />
              <Bar dataKey="pts" name="Points Per Game" radius={[4, 4, 0, 0]}>
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
      {/* 1. Analysis Insight Narrative */}
      <div className="glass rounded-xl p-6 border border-slate-800 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-blue-500/10 rounded flex items-center justify-center">
            <i className="fas fa-file-alt text-blue-500"></i>
          </div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Strategic Insight Report</h3>
        </div>
        <div className="prose prose-invert max-w-none">
          <p className="text-sm text-slate-300 leading-relaxed font-sans whitespace-pre-wrap italic">
            {summary}
          </p>
        </div>
      </div>

      {/* 2. Visual Analytics Section */}
      <div className="glass rounded-xl p-6 border border-slate-800 min-h-[400px] flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-500/10 rounded flex items-center justify-center">
              <i className="fas fa-chart-pie text-purple-500"></i>
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Dynamic Performance Visualization</h3>
          </div>
          <span className="text-[10px] px-2 py-1 bg-slate-800 text-slate-400 rounded-md border border-slate-700 font-mono">
            {mode} ANALYTICS
          </span>
        </div>
        <div className="flex-1 min-h-[300px]">
          {renderChart()}
        </div>
      </div>

      {/* 3. Detailed Data Matrix */}
      <div className="glass rounded-xl p-6 border border-slate-800">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-emerald-500/10 rounded flex items-center justify-center">
            <i className="fas fa-table text-emerald-500"></i>
          </div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Data Matrix (Professional Grade)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="text-slate-500 border-b border-slate-800">
                <th className="pb-3 font-bold">Player / Item</th>
                <th className="pb-3 text-right">Points (PTS)</th>
                <th className="pb-3 text-right">REB / AST</th>
                <th className="pb-3 text-right">Efficiency (TS%)</th>
                <th className="pb-3 text-right">PER Index</th>
              </tr>
            </thead>
            <tbody className="text-slate-200">
              {data.map((player, idx) => (
                <tr key={idx} className="border-b border-slate-800/50 hover:bg-white/5 transition-colors group">
                  <td className="py-4">
                    <div className="font-bold text-slate-100 group-hover:text-blue-400 transition-colors">{player.name}</div>
                    <div className="text-[10px] text-slate-500 uppercase">{player.team}</div>
                  </td>
                  <td className="py-4 text-right">
                    <span className="text-sm font-mono font-bold text-blue-400">{player.pts}</span>
                  </td>
                  <td className="py-4 text-right font-mono text-slate-400">
                    {player.reb} / {player.ast}
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden hidden sm:block">
                        <div 
                          className="h-full bg-emerald-500" 
                          style={{ width: `${Math.min(100, (player.advanced?.ts_pct || 0) * 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-emerald-400 font-mono">
                        {Math.round((player.advanced?.ts_pct || 0) * 100)}%
                      </span>
                    </div>
                  </td>
                  <td className="py-4 text-right">
                    <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded font-mono">
                      {(player.advanced?.per || 0).toFixed(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 p-3 bg-blue-500/5 rounded-lg border border-blue-500/10">
          <p className="text-[10px] text-slate-500 leading-normal">
            <i className="fas fa-info-circle mr-1 text-blue-500"></i>
            <strong>Glossary:</strong> TS% (True Shooting) accounts for 2pt, 3pt, and FT efficiency; PER (Player Efficiency Rating) is a per-minute rating of overall productivity (NBA avg: 15.0).
          </p>
        </div>
      </div>
    </div>
  );
};

export default DataVisualizer;
