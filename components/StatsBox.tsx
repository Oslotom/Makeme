
import React from 'react';

interface StatsBoxProps {
    usage: number;
    limit: number;
}

export const StatsBox: React.FC<StatsBoxProps> = ({ usage, limit }) => {
    const percentage = limit > 0 ? (usage / limit) * 100 : 0;
    const remaining = Math.max(0, limit - usage);
    const standardLeft = remaining;
    const headshotsLeft = Math.floor(remaining / 4);

    return (
        <div className="hidden md:flex items-center gap-4 bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-300">
            <div>
                <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold">Daily Generations</span>
                    <span className="font-mono">{usage} / {limit}</span>
                </div>
                <div className="w-40 bg-slate-700 rounded-full h-2">
                    <div 
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${percentage}%` }}
                        role="progressbar"
                        aria-valuenow={usage}
                        aria-valuemin={0}
                        aria-valuemax={limit}
                    ></div>
                </div>
            </div>
            <div className="border-l border-slate-700 pl-4">
                <p className="font-semibold whitespace-nowrap">Est. Left:</p>
                <p className="text-slate-400 text-xs whitespace-nowrap">{standardLeft} std / {headshotsLeft} headshots</p>
            </div>
        </div>
    );
};