import React from "react";

const points = [
  { month: "Jan", users: 150, deals: 20 },
  { month: "Feb", users: 165, deals: 24 },
  { month: "Mar", users: 175, deals: 26 },
  { month: "Apr", users: 190, deals: 28 },
  { month: "May", users: 205, deals: 30 },
  { month: "Jun", users: 220, deals: 32 },
];

function PlatformGrowth() {
  const max = Math.max(...points.map((p) => p.users));
  const height = 200;
  const width = 560;
  const step = width / (points.length - 1);

  const getY = (value) => height - (value / max) * height;

  const line = (key) =>
    points
      .map((p, idx) => `${idx * step},${getY(p[key])}`)
      .join(" ");

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Platform Growth
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Users vs Deals (Jan–Jun)
        </p>
      </div>

      {/* Chart */}
      <div className="overflow-x-auto">
        <svg
          viewBox={`-10 -10 ${width + 20} ${height + 40}`}
          className="min-w-[560px] w-full h-64"
        >
          {/* Grid lines */}
          {[0.25, 0.5, 0.75, 1].map((g) => (
            <line
              key={g}
              x1="0"
              x2={width}
              y1={height * g}
              y2={height * g}
              stroke="currentColor"
              className="text-slate-200 dark:text-slate-700"
              strokeDasharray="4 4"
              strokeWidth="1"
            />
          ))}

          {/* Users glow */}
          <polyline
            fill="none"
            stroke="#f3c04f"
            strokeWidth="6"
            points={line("users")}
            strokeLinejoin="round"
            strokeLinecap="round"
            opacity="0.2"
          />

          {/* Users line */}
          <polyline
            fill="none"
            stroke="#f3c04f"
            strokeWidth="3"
            points={line("users")}
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* Deals glow */}
          <polyline
            fill="none"
            stroke="#d7a32a"
            strokeWidth="6"
            points={line("deals")}
            strokeLinejoin="round"
            strokeLinecap="round"
            opacity="0.2"
          />

          {/* Deals line */}
          <polyline
            fill="none"
            stroke="#d7a32a"
            strokeWidth="3"
            points={line("deals")}
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* Data points */}
          {points.map((p, idx) => {
            const x = idx * step;
            return (
              <g key={p.month}>
                <circle
                  cx={x}
                  cy={getY(p.users)}
                  r="4"
                  fill="#f3c04f"
                />
                <circle
                  cx={x}
                  cy={getY(p.deals)}
                  r="4"
                  fill="#d7a32a"
                />
              </g>
            );
          })}

          {/* X-axis labels */}
          {points.map((p, idx) => (
            <text
              key={p.month}
              x={idx * step}
              y={height + 20}
              textAnchor="middle"
              className="text-[10px] fill-slate-500 dark:fill-slate-400"
            >
              {p.month}
            </text>
          ))}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-4 text-xs text-slate-600 dark:text-slate-400">
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#f3c04f]" />
          Users
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#d7a32a]" />
          Deals
        </span>
      </div>
    </div>
  );
}

export default PlatformGrowth;
