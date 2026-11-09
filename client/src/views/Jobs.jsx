import { useState } from 'react';
import { useLocalStorage } from '../hooks.js';
import { PageTitle } from '../ui.jsx';

const STATUSES = ['Wishlist', 'Applied', 'Referral asked', 'Interview', 'Offer', 'Rejected'];

export default function Jobs({ career }) {
  const [apps, setApps] = useLocalStorage('anurag-ai-classes.apps.v1', []);
  const [form, setForm] = useState({ company: '', role: '', url: '', status: 'Wishlist' });
  const [copied, setCopied] = useState('');

  const add = (e) => {
    e.preventDefault();
    if (!form.company || !form.role) return;
    setApps((list) => [{ ...form, id: `${Date.now()}` }, ...list]);
    setForm({ company: '', role: '', url: '', status: 'Wishlist' });
  };

  const copy = async (id, text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(''), 1500);
    } catch {
      setCopied('');
    }
  };

  return (
    <>
      <PageTitle title="Jobs, referrals and LinkedIn">
        {career.jobs.intro} Use the message templates, then track every application so you can see movement, not just effort.
      </PageTitle>

      <h3 className="block-title">Open roles</h3>
      <ul className="link-grid">
        {career.jobs.boards.map((j) => (
          <li key={j.url}>
            <a href={j.url} target="_blank" rel="noreferrer">
              <span className="where">{j.company}</span>
              {j.role}
            </a>
          </li>
        ))}
      </ul>
      <ul className="link-grid" style={{ marginTop: 10 }}>
        {career.jobs.searches.map((s) => (
          <li key={s.url}>
            <a href={s.url} target="_blank" rel="noreferrer">
              <span className="where">Search</span>
              {s.label}
            </a>
          </li>
        ))}
      </ul>

      <h3 className="block-title">Connect on LinkedIn</h3>
      <p className="lede">{career.linkedin.intro}</p>
      <ul className="link-grid">
        {career.linkedin.peopleSearches.map((s) => (
          <li key={s.url}>
            <a href={s.url} target="_blank" rel="noreferrer">
              <span className="where">LinkedIn</span>
              {s.label}
            </a>
          </li>
        ))}
      </ul>

      <div className="two-col" style={{ marginTop: 18 }}>
        {career.linkedin.templates.map((t) => (
          <section key={t.id} className="card tight">
            <h3 className="card-title">{t.title}</h3>
            <pre className="template">{t.text}</pre>
            <button className="btn small" onClick={() => copy(t.id, t.text)}>
              {copied === t.id ? 'Copied' : 'Copy message'}
            </button>
          </section>
        ))}
      </div>

      <h3 className="block-title">Application tracker</h3>
      <form className="card app-form" onSubmit={add}>
        <input placeholder="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} required />
        <input placeholder="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} required />
        <input placeholder="Job URL (optional)" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
        <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
          {STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <button className="btn" type="submit">
          Add
        </button>
      </form>

      {apps.length === 0 ? (
        <p className="empty">No applications yet. Add the first role you will apply to this week.</p>
      ) : (
        <ul className="app-list">
          {apps.map((a) => (
            <li key={a.id} className="card tight">
              <div>
                <strong>{a.company}</strong>
                <p>
                  {a.role}
                  {a.url && (
                    <>
                      {' · '}
                      <a href={a.url} target="_blank" rel="noreferrer">
                        posting ↗
                      </a>
                    </>
                  )}
                </p>
              </div>
              <select
                value={a.status}
                onChange={(e) => setApps((list) => list.map((x) => (x.id === a.id ? { ...x, status: e.target.value } : x)))}
              >
                {STATUSES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              <button className="btn ghost small" onClick={() => setApps((list) => list.filter((x) => x.id !== a.id))}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
