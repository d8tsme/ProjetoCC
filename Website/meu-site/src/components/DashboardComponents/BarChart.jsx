import React, { useEffect, useState } from 'react';

function SimpleBars({ data = [] }) {
  const max = Math.max(...data, 1);
  return (
    <div className="bar-chart" style={{display:'flex',alignItems:'end',gap:6,height:120}}>
      {data.map((v, i) => (
        <div key={i} className="bar" style={{ flex:1, height: `${(v / max) * 100}%`, background:'var(--primary-brown-light)', borderRadius:4 }} title={`Month ${i + 1}: ${v}`} />
      ))}
    </div>
  );
}

export default function BarChart({ data = [] }) {
  const [lib, setLib] = useState(null);

  useEffect(() => {
    let mounted = true;
    import('recharts').then(m => { if (mounted) setLib(m); }).catch(() => { if (mounted) setLib(null); });
    return () => { mounted = false; };
  }, []);

  const chartData = data.map((v, i) => ({ name: `M${i + 1}`, value: v }));

  if (!lib) return <div style={{ width: '100%' }}><SimpleBars data={data} /></div>;

  const { BarChart: ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } = lib;

  return (
    <div style={{ width: '100%', height: 180 }}>
      <ResponsiveContainer>
        <ReBarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.06} />
          <XAxis dataKey="name" stroke="var(--text-medium)" />
          <YAxis stroke="var(--text-medium)" />
          <Tooltip />
          <Bar dataKey="value" fill="var(--primary-brown-light)" />
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  );
}

