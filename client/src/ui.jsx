import { useProgress } from './context.jsx';

/** Checkbox bound to the shared progress store. */
export function Check({ id, label, className = '' }) {
  const { done, toggle } = useProgress();
  return (
    <label className={`check ${className}`}>
      <input type="checkbox" checked={!!done[id]} onChange={() => toggle(id)} />
      <span>{label}</span>
    </label>
  );
}

export function Meter({ value, max, label, tone = 'brand' }) {
  const pct = max ? Math.round((value / max) * 100) : 0;
  return (
    <div className={`meter tone-${tone}`}>
      <div className="meter-row">
        <span>{label}</span>
        <strong>
          {value}/{max} · {pct}%
        </strong>
      </div>
      <div className="meter-bar" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max} aria-label={label}>
        <div style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function PageTitle({ title, children }) {
  return (
    <header className="page-title">
      <h2>{title}</h2>
      {children && <p>{children}</p>}
    </header>
  );
}

export function Table({ columns, rows, firstColHeader = true }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {columns.map((c, i) => (
              <th key={i}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => (j === 0 && firstColHeader ? <th key={j} scope="row">{c}</th> : <td key={j}>{c}</td>))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Chip({ active, onClick, children, count }) {
  return (
    <button className={`chip ${active ? 'active' : ''}`} onClick={onClick} aria-pressed={active}>
      {children}
      {count != null && <span className="chip-count">{count}</span>}
    </button>
  );
}

export function Segmented({ options, value, onChange, label }) {
  return (
    <div className="segmented" role="group" aria-label={label}>
      {options.map((o) => (
        <button key={o.id} className={value === o.id ? 'active' : ''} onClick={() => onChange(o.id)} aria-pressed={value === o.id}>
          {o.label}
        </button>
      ))}
    </div>
  );
}
