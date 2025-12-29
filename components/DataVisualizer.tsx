
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Legend, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar 
} from 'recharts';
import { AnalysisResponse, PlayerStats } from '../types';

interface DataVisualizerProps {
  analysis: AnalysisResponse | null;
}

const DataVisualizer: React.FC<DataVisualizerProps> = ({ analysis }) => {
  if (!analysis || analysis.data.length === 0) return (
    <div className="flex flex-col items-center justify-center h-full glass rounded-lg text-slate-500 p-8 text-center">
      <i className="fas fa-microscope text-5xl mb-6 opacity-20"></i>
      <h3 className="text-slate-300 font-bold mb-2">Awaiting Intelligence Feed</h3>
      <p className="text-sm max-w-xs">Define a query to initiate the autonomous harvesting pipeline.</p>
    </div>
  );

  const { mode, data, summary } = analysis;

  const renderChart = () => {
    switch (mode) {
      case 'TREND':
        const trendData = [...data].sort((a, b) => new Date(a.date || '').getTime() - new Date(b.date || '').getTime());
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="date" stroke="#64748b" fontSize={10} />
              <YAxis stroke="#64748b" fontSize={10} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155' }} />
              <Legend verticalAlign="top" height={36} />
              <Line type="monotone" dataKey="pts" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} name="Points" />
              <Line type="monotone" dataKey="ast" stroke="#a855f7" strokeWidth={2} dot={{ fill: '#a855f7' }} name="Assists" />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'COMPARISON':
        if (data.length >= 2) {
          const radarData = [
            { subject: 'PTS', [data[0].name]: data[0].pts, [data[1].name]: data[1].pts, fullMark: 40 },
            { subject: 'REB', [data[0].name]: data[0].reb, [data[1].name]: data[1].reb, fullMark: 15 },
            { subject: 'AST', [data[0].name]: data[0].ast, [data[1].name]: data[1].ast, fullMark: 15 },
            { subject: 'PER', [data[0].name]: data[0].advanced?.per, [data[1].name]: data[1].advanced?.per, fullMark: 35 },
            { subject: 'TS%', [data[0].name]: (data[0].advanced?.ts_pct || 0) * 50, [data[1].name]: (data[1].advanced?.ts_pct || 0) * 50, fullMark: 50 },
          ];
          return (
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" stroke="#64748b" fontSize={10} />
                <PolarRadiusAxis angle={30} domain={[0, 50]} tick={false} axisLine={false} />
                <Radar name={data[0].name} dataKey={data[0].name} stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                <Radar name={data[1].name} dataKey={data[1].name} stroke="#a855f7" fill="#a855f7" fillOpacity={0.6} />
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          );
        }
        // Fallback to ranking if not enough data for radar
        return null;

      case 'RANKING':
      default:
        const rankingData = data.slice(0, 10).map(p => ({
          name: p.name.split(' ').pop(),
          pts: p.pts,
          per: p.advanced?.per
        }));
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rankingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
              <YAxis stroke="#64748b" fontSize={10} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155' }} />
              <Legend verticalAlign="top" height={36} />
              <Bar dataKey="pts" name="PPG" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="per" name="PER" fill="#a855f7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="flex flex-col h-full gap-4 overflow-hidden">
      <div className="glass rounded-lg p-5 flex flex-col h-[60%]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            {mode} Intelligence Report
          </h3>
          <span className="text-[10px] px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20">
            {mode}
          </span>
        </div>
        <div className="flex-1 min-h-0">
          {renderChart()}
        </div>
      </div>

      <div className="glass rounded-lg p-5 flex flex-col h-[40%]">
        <h3 className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Agent Summary</h3>
        <p className="text-sm text-slate-300 leading-relaxed mb-4 italic">"{summary}"</p>
        <div className="flex-1 overflow-y-auto pr-2 terminal-scroll">
          <table className="w-full text-left text-[11px] font-mono">
            <thead className="text-slate-500 border-b border-slate-800">
              <tr>
                <th className="pb-2">PLAYER</th>
                <th className="pb-2 text-right">PPG</th>
                <th className="pb-2 text-right">TS%</th>
                <th className="pb-2 text-right">PER</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              {data.map((player, idx) => (
                <tr key={idx} className="border-b border-slate-800/50 hover:bg-white/5 transition-colors">
                  <td className="py-2">{player.name}</td>
                  <td className="py-2 text-right font-bold">{player.pts}</td>
                  <td className="py-2 text-right text-blue-400">{Math.round((player.advanced?.ts_pct || 0) * 100)}%</td>
                  <td className="py-2 text-right text-purple-400">{(player.advanced?.per || 0).toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DataVisualizer;
