import React, { useEffect, useState } from 'react';

function SimpleLine({ data = [] }) {
  const width = 600;
  const height = 220;
  const max = Math.max(...data, 1);
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1 || 1)) * width;
    const y = height - (v / max) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg className="line-chart" viewBox={`0 0 ${width} ${height}`} width="100%" height="100%">
      <polyline points={points} fill="none" stroke="var(--accent-1)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function LineChart({ data = [] }) {
  const [lib, setLib] = useState(null);

  useEffect(() => {
    let mounted = true;
    import('recharts').then(m => { if (mounted) setLib(m); }).catch(() => { if (mounted) setLib(null); });
    return () => { mounted = false; };
  }, []);

  const chartData = data.map((v, i) => ({ name: `M${i + 1}`, value: v }));

  if (!lib) return <div style={{ width: '100%', height: 240 }}><SimpleLine data={data} /></div>;

  const { LineChart: ReLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } = lib;

  return (
    <div style={{ width: '100%', height: 240 }}>
      <ResponsiveContainer>
        <ReLineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.06} />
          <XAxis dataKey="name" stroke="var(--text-medium)" />
          <YAxis stroke="var(--text-medium)" />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="var(--accent-1)" strokeWidth={3} dot={{ r: 3 }} />
        </ReLineChart>
      </ResponsiveContainer>
    </div>
  );
}
