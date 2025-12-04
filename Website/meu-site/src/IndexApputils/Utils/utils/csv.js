export function saveCsv(filename, rows = [], columns = null) {
  // columns: [{key,label}] optional. If null, infer from rows keys.
  if (!rows || !rows.length) {
    const blob = new Blob([""], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    link.click();
    return;
  }

  const keys = columns && Array.isArray(columns) ? columns.map(c => c.key) : Object.keys(rows[0]);
  const headers = columns && Array.isArray(columns) ? columns.map(c => c.label) : keys;

  const escapeCsv = (v) => {
    if (v === null || v === undefined) return '';
    const s = String(v).replace(/"/g, '""');
    if (s.includes(',') || s.includes('\n') || s.includes('"')) return `"${s}"`;
    return s;
  };

  const lines = [headers.join(',')];
  for (const r of rows) {
    const fields = keys.map(k => {
      const val = r[k];
      // nested keys not supported; just stringify
      return escapeCsv(val);
    });
    lines.push(fields.join(','));
  }

  const csvContent = lines.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default saveCsv;
