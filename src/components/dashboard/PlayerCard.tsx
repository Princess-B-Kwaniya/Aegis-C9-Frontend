import React from 'react';
import { PlayerData, SquadMetric } from '@/types';
import { User, Zap, AlertTriangle, Target, TrendingUp } from 'lucide-react';

interface PlayerCardProps {
  player: PlayerData;
  squadMetric?: SquadMetric;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ player, squadMetric }) => {
  const isCritical = player.status === 'critical';

  return (
    <div
      className={`p-3 md:p-4 rounded-xl bg-white border transition-all duration-300 shadow-sm ${
        isCritical ? 'border-neon-orange ring-4 ring-neon-orange/10' : 'border-slate-100 hover:border-cloud9-blue'
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
          <div className={`p-1.5 md:p-2 rounded-lg shrink-0 ${isCritical ? 'bg-neon-orange/10 text-neon-orange' : 'bg-cloud9-blue/10 text-cloud9-blue'}`}>
            <User size={16} className="md:w-[18px] md:h-[18px]" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-900 leading-none mb-1 text-sm md:text-base truncate">{player.name}</h3>
            <p className="text-[9px] md:text-[10px] text-slate-400 uppercase font-bold tracking-widest">{player.role}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
           {isCritical && <AlertTriangle size={10} className="md:w-3 md:h-3 text-neon-orange" />}
           <span
            className={`text-[8px] md:text-[9px] px-1.5 md:px-2 py-0.5 rounded-full uppercase font-black ${
              player.status === 'critical'
                ? 'bg-neon-orange text-white'
                : player.status === 'warning'
                ? 'bg-amber-400 text-black'
                : 'bg-cloud9-blue text-white'
            }`}
          >
            {player.status}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-xs items-center">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Zap size={11} className="md:w-3 md:h-3 text-cloud9-blue" />
            <span className="font-medium text-[10px] md:text-xs">Stress Level</span>
          </div>
          <span
            className={`font-bold text-[10px] md:text-xs ${
              isCritical ? 'text-neon-orange' : 'text-slate-900'
            }`}
          >
            {Math.round(player.stress)}%
          </span>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ease-out ${
              player.status === 'critical'
                ? 'bg-neon-orange'
                : player.status === 'warning'
                ? 'bg-amber-400'
                : 'bg-cloud9-blue'
            }`}
            style={{ width: `${player.stress}%` }}
          />
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-slate-50">
          <div className="flex flex-col">
            <span className="text-[8px] md:text-[9px] text-slate-400 font-bold uppercase italic">
              {squadMetric?.kda || '0/0/0'}
            </span>
            <span className="text-[10px] md:text-xs font-black text-slate-900">{player.impact} Impact</span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-[8px] md:text-[9px] text-slate-400 font-bold uppercase">
              {squadMetric ? `G: +${squadMetric.gold_diff}` : 'Errors'}
            </span>
            <span className={`text-[10px] md:text-xs font-black ${player.recentErrors > 2 ? 'text-neon-orange' : 'text-slate-900'}`}>
              {squadMetric ? `V: ${squadMetric.vision_score}` : player.recentErrors}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;
