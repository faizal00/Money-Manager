import React from 'react';
import { formatRupiah } from '../utils/formatters';

const LineGraph = ({ data, title, color = 'stroke-blue-500' }) => {
  if (!data || data.length === 0) return null;

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;

  const width = 400;
  const height = 240;
  const padding = 50;

  const points = data.map((d, i) => {
    const x = padding + (i * (width - 2 * padding)) / (data.length - 1);
    const y = height - padding - ((d.value - minValue) / range) * (height - 2 * padding);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">{title}</h3>
      <div className="relative w-full">
        <svg width="100%" height="240" viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map(i => {
            const y = padding + (i * (height - 2 * padding)) / 4;
            const value = maxValue - (i * range) / 4;
            return (
              <g key={i}>
                <line
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  stroke="currentColor"
                  strokeWidth="1"
                  className="stroke-gray-300 dark:stroke-gray-500"
                />
                <text
                  x={padding - 10}
                  y={y + 5}
                  textAnchor="end"
                  className="text-xs fill-gray-500 dark:fill-gray-400"
                >
                  {formatRupiah(value).replace('Rp', '').trim()}
                </text>
              </g>
            );
          })}

          {/* X-axis labels */}
          {data.map((d, i) => {
            const x = padding + (i * (width - 2 * padding)) / (data.length - 1);
            return (
              <text
                key={i}
                x={x}
                y={height - 5}
                textAnchor="middle"
                className="text-xs fill-gray-500 dark:fill-gray-400"
              >
                {d.label}
              </text>
            );
          })}

          {/* Line */}
          <polyline
            points={points}
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className={color}
          />

          {/* Data points */}
          {data.map((d, i) => {
            const x = padding + (i * (width - 2 * padding)) / (data.length - 1);
            const y = height - padding - ((d.value - minValue) / range) * (height - 2 * padding);
            return (
              <g key={i}>
                <circle
                  cx={x}
                  cy={y}
                  r="4"
                  fill="currentColor"
                  className={color}
                />
                <circle
                  cx={x}
                  cy={y}
                  r="8"
                  fill="transparent"
                  className="hover:fill-blue-100 dark:hover:fill-blue-800 cursor-pointer"
                >
                  <title>{`${d.label}: ${formatRupiah(d.value)}`}</title>
                </circle>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default LineGraph;