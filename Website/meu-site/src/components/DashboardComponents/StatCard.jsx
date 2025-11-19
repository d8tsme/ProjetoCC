import React from 'react';

function StatCard({ title, value, color }) {
  // color can be a hex string like '#ff0000' or a variable key like 'accent-1'
  const borderColor = (typeof color === 'string' && color.startsWith('#')) ? color : `var(--${color || 'accent-1'})`;
  return (
    <div className="stat-card" style={{ borderLeft: `6px solid ${borderColor}` }}>
      <div className="stat-title">{title}</div>
      <div className="stat-value">{value}</div>
    </div>
  );
}

export default StatCard;
