
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar 
} from 'recharts';
import { PlayerStats } from '../types';

interface DataVisualizerProps {
  data: PlayerStats[];
}

const DataVisualizer: React.FC<DataVisualizerProps> = ({ data }) => {
  if (data.length === 0) return (
    <div className="flex flex-col items-center justify-center h-full glass rounded-lg text-slate-500">
      <i className="fas fa-chart-line text-4xl mb-4 opacity-20"></i>
      <p>Harvested data will appear here</p>
    </div>
  );

  const perData = data.slice(0, 8).map(p => ({
    name: p.name.split(' ').pop(),
    per: p.advanced?.per || 0,
    ts: (p.advanced?.ts_pct || 0) * 100
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full overflow-hidden">
      <div className="glass rounded-lg p-4 flex flex-col">
        <h3 className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-widest">Efficiency Metrics (PER vs TS%)</h3>
        <div className="flex-1 min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={perData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
              <YAxis stroke="#64748b" fontSize={10} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', color: '#f8fafc' }}
                itemStyle={{ color: '#38bdf8' }}
              />
              <Legend verticalAlign="top" height={36}/>
              <Bar dataKey="per" name="PER" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="ts" name="TS%" fill="#a855f7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass rounded-lg p-4 flex flex-col overflow-y-auto max-h-[400px]">
        <h3 className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-widest">Harvested Entity Registry</h3>
        <div className="space-y-2">
          {data.map((player) => (
            <div key={player.id} className="p-2 border border-slate-800 rounded bg-slate-900/50 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-200">{player.name}</span>
                <span className="text-[10px] text-slate-500">{player.team}</span>
              </div>
              <div className="flex gap-4 text-xs font-mono">
                <div className="flex flex-col items-end">
                  <span className="text-emerald-400">{(player.advanced?.per || 0).toFixed(1)}</span>
                  <span className="text-[8px] text-slate-600">PER</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-blue-400">{Math.round((player.advanced?.ts_pct || 0) * 100)}%</span>
                  <span className="text-[8px] text-slate-600">TS%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DataVisualizer;
