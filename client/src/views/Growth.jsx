import { useMemo } from 'react';
import { countDone, useProgress } from '../context.jsx';
import { Meter, PageTitle } from '../ui.jsx';
import { useTrackData } from '../hooks.js';

const DAY_MS = 86400000;

function ts(v) {
  if (typeof v === 'number') return v;
  return null;
}

function lastNDays(n) {
  const days = [];
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  for (let i = n - 1; i >= 0; i--) {
    days.push(now.getTime() - i * DAY_MS);
  }
  return days;
}

export default function Growth({ mockCount, mockAvg }) {
  const { done } = useProgress();
  const ai = useTrackData('ai');
  const fde = useTrackData('fde');

  const stats = useMemo(() => {
    const fdeMonthMax = fde.data?.content?.fastTrack?.months?.reduce((n, m) => n + m.rows.length, 0) || 42;
    const fdeBeginnerMax = fde.data?.content?.beginnerPath?.phases?.reduce((n, p) => n + p.items.length, 0) || 24;
    const aiVideos = (ai.data?.videos?.length || 0) + (ai.data?.shorts?.length || 0);
    const fdeVideos = (fde.data?.videos?.length || 0) + (fde.data?.shorts?.length || 0);

    const rows = [
      { id: 'days', label: 'AI 100-day plan', value: countDone(done, 'ai.day.'), max: 100 },
      { id: 'steps', label: 'AI roadmap steps', value: countDone(done, 'ai.step.'), max: 5 },
      { id: 'aiproj', label: 'AI projects shipped', value: countDone(done, 'ai.proj.'), max: 5 },
      { id: 'aivid', label: 'AI videos watched', value: countDone(done, 'ai.vid.'), max: Math.max(aiVideos, 1) },
      { id: 'month', label: 'FDE 6-month topics', value: countDone(done, 'fde.month.'), max: fdeMonthMax },
      { id: 'beg', label: 'FDE beginner path', value: countDone(done, 'fde.beginner.'), max: fdeBeginnerMax },
      { id: 'round', label: 'FDE interview rounds prepped', value: countDone(done, 'fde.round.'), max: 8 },
      { id: 'fdeproj', label: 'FDE portfolio projects', value: countDone(done, 'fde.proj.'), max: 5 },
      { id: 'fdevid', label: 'FDE videos watched', value: countDone(done, 'fde.vid.'), max: Math.max(fdeVideos, 1) },
    ];

    const core = rows.filter((r) => r.id !== 'aivid' && r.id !== 'fdevid');
    const value = core.reduce((n, r) => n + r.value, 0);
    const max = core.reduce((n, r) => n + r.max, 0);
    const stamps = Object.values(done).map(ts).filter(Boolean);
    const days = lastNDays(14);
    const hist = days.map((start) => ({
      start,
      count: stamps.filter((t) => t >= start && t < start + DAY_MS).length,
    }));
    const maxBar = Math.max(1, ...hist.map((h) => h.count));
    let streak = 0;
    for (let i = hist.length - 1; i >= 0; i--) {
      if (hist[i].count > 0) streak++;
      else if (i !== hist.length - 1) break;
    }
    const next =
      rows.find((r) => r.value < r.max)?.label ||
      'Everything on the tracker is ticked. Book a live mock interview.';
    return { rows, value, max, hist, maxBar, streak, next };
  }, [done, ai.data, fde.data]);

  const loading = ai.loading || fde.loading;

  return (
    <>
      <PageTitle title="Your growth">
        Every tick on the roadmaps, videos and mocks lands here. This is the picture you want before you apply.
      </PageTitle>

      {loading && <p className="muted">Loading course totals…</p>}

      <section className="stat-row">
        <div className="stat">
          <strong>{stats.max ? Math.round((stats.value / stats.max) * 100) : 0}%</strong>
          <span>Classroom complete ({stats.value}/{stats.max})</span>
        </div>
        <div className="stat">
          <strong>{stats.streak}</strong>
          <span>Day streak (days in a row with a tick)</span>
        </div>
        <div className="stat">
          <strong>{mockCount}</strong>
          <span>Mock interviews logged{mockAvg != null ? ` · avg ${mockAvg}/5` : ''}</span>
        </div>
      </section>

      <section className="card">
        <h3 className="card-title">Last 14 days</h3>
        <p className="fineprint">Bars are items you marked complete that day. Older ticks without a date do not show here.</p>
        <div className="bars" aria-label="Completions per day">
          {stats.hist.map((h) => (
            <div key={h.start} className="bar">
              <div className="bar-fill" style={{ height: `${(h.count / stats.maxBar) * 100}%` }} title={`${h.count} items`} />
              <span>{new Date(h.start).toLocaleDateString(undefined, { weekday: 'narrow' })}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <h3 className="card-title">Breakdown</h3>
        {stats.rows.map((r) => (
          <Meter key={r.id} value={r.value} max={r.max} label={r.label} />
        ))}
      </section>

      <section className="card">
        <h3 className="card-title">Do this next</h3>
        <p className="lede">{stats.next}</p>
      </section>
    </>
  );
}
