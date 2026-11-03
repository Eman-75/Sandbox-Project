import React from 'react';

const slices = [
  { label: 'Startups', value: 50, color: '#c89d2f' },
  { label: 'Investors', value: 32, color: '#b5891f' },
  { label: 'Students', value: 18, color: '#8f6d1b' },
];

function UserDistribution() {
  const total = slices.reduce((sum, s) => sum + s.value, 0);
  let offset = 25;

  const circles = slices.map((slice, idx) => {
    const dash = (slice.value / total) * 100;
    const strokeDasharray = `${dash} ${100 - dash}`;
    const circle = (
      <circle
        key={idx}
        r="35"
        cx="50%"
        cy="50%"
        fill="transparent"
        stroke={slice.color}
        strokeWidth="14"
        strokeDasharray={strokeDasharray}
        strokeDashoffset={100 - offset}
        transform="rotate(-90 50 50)"
      />
    );
    offset += dash;
    return circle;
  });

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">User Distribution</h3>
        <span className="text-xs text-slate-500 dark:text-slate-400">Across platform</span>
      </div>
      <div className="flex flex-col items-center gap-4">
        <svg viewBox="0 0 100 100" className="w-44 h-44">
          <circle
            r="35"
            cx="50%"
            cy="50%"
            fill="transparent"
            stroke="#1f2937"
            strokeWidth="14"
            strokeOpacity="0.2"
          />
          {circles}
          <text x="50" y="52" textAnchor="middle" className="fill-slate-900 dark:fill-white text-sm font-bold">
            Total
          </text>
        </svg>
        <div className="w-full space-y-2">
          {slices.map((slice) => (
            <div key={slice.label} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ background: slice.color }} />
                <span className="text-slate-700 dark:text-slate-200">{slice.label}</span>
              </div>
              <span className="font-semibold text-slate-900 dark:text-white">{slice.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserDistribution;
