import { useMemo, useState } from 'react';
import { useLocalStorage } from '../hooks.js';
import { countDone, usePlayer, useProgress } from '../context.jsx';
import { Check, Chip, Meter, PageTitle, Segmented } from '../ui.jsx';

const LEVELS = [
  { id: 'beginner', label: 'Beginner' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'advanced', label: 'Advanced' },
];

function Resource({ opt, featured }) {
  const play = usePlayer();
  if (!opt) return null;
  return (
    <div className={`res ${featured ? 'featured' : ''}`}>
      <div className="res-main">
        <span className="pill">{opt.type || 'Resource'}</span>
        <strong className="res-title">{opt.title}</strong>
        <span className="res-meta">
          {opt.creator}
          {opt.mins ? ` · ${opt.mins} min` : ''}
        </span>
      </div>
      <div className="res-actions">
        {opt.videoId && (
          <button className="btn small" onClick={() => play({ id: opt.videoId, type: 'video', title: opt.title, url: opt.url })}>
            ▶ Watch
          </button>
        )}
        {opt.url ? (
          <a className="btn small ghost" href={opt.url} target="_blank" rel="noreferrer">
            Open ↗
          </a>
        ) : (
          <span className="res-note">In your notes{opt.note ? `: ${opt.note.replace(/^\(?section in /i, '').replace(/\)$/, '')}` : ''}</span>
        )}
      </div>
    </div>
  );
}

function DayCard({ d, level, open, onToggleOpen }) {
  const main = d.options[level];
  const others = LEVELS.filter((l) => l.id !== level);
  return (
    <article className="day card" id={`day-${d.day}`}>
      <div className="day-head">
        <Check id={`ai.day.${d.day}`} label={<span className="day-no">Day {d.day}</span>} />
        <div className="day-topic">
          <h3>{d.topic}</h3>
          <p>{d.outcome}</p>
        </div>
      </div>
      <Resource opt={main} featured />
      <button className="link-btn" onClick={onToggleOpen} aria-expanded={open}>
        {open ? 'Hide other levels' : 'See other levels'}
      </button>
      {open &&
        others.map((l) => (
          <div key={l.id} className="other-level">
            <span className="level-tag">{l.label}</span>
            <Resource opt={d.options[l.id]} />
          </div>
        ))}
    </article>
  );
}

export default function Plan100({ plan }) {
  const { done } = useProgress();
  const [level, setLevel] = useLocalStorage('anurag-ai-classes.level', 'beginner');
  const [openDays, setOpenDays] = useState({});

  const phaseProgress = (p) => p.days.filter((d) => done[`ai.day.${d.day}`]).length;
  const nextDay = useMemo(() => plan.phases.flatMap((p) => p.days).find((d) => !done[`ai.day.${d.day}`]), [plan, done]);
  const currentPhase = nextDay ? plan.phases.find((p) => p.days.includes(nextDay)).no : plan.phases[0].no;
  const [phaseNo, setPhaseNo] = useState(currentPhase);

  const phases = phaseNo === 'all' ? plan.phases : plan.phases.filter((p) => p.no === phaseNo);
  const doneCount = countDone(done, 'ai.day.');

  const jumpToNext = () => {
    if (!nextDay) return;
    const p = plan.phases.find((x) => x.days.includes(nextDay));
    setPhaseNo(p.no);
    setTimeout(() => document.getElementById(`day-${nextDay.day}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 60);
  };

  return (
    <>
      <PageTitle title="100 Days of AI Engineering">
        One focused lesson a day. Pick your level once and every day shows the matching resource. You can always peek at the other levels.
      </PageTitle>

      <section className="card plan-controls">
        <div>
          <span className="label">Your level</span>
          <Segmented label="Choose your level" options={LEVELS} value={level} onChange={setLevel} />
        </div>
        <Meter value={doneCount} max={plan.totalDays} label="Days completed" />
        {nextDay ? (
          <button className="btn" onClick={jumpToNext}>
            {doneCount === 0 ? 'Start with Day 1' : `Continue: Day ${nextDay.day} - ${nextDay.topic}`}
          </button>
        ) : (
          <p className="success">All 100 days complete. Well done!</p>
        )}
      </section>

      <div className="chips" role="group" aria-label="Phases">
        <Chip active={phaseNo === 'all'} onClick={() => setPhaseNo('all')}>
          All phases
        </Chip>
        {plan.phases.map((p) => (
          <Chip key={p.no} active={phaseNo === p.no} onClick={() => setPhaseNo(p.no)} count={`${phaseProgress(p)}/${p.days.length}`}>
            {p.no}. {p.name}
          </Chip>
        ))}
      </div>

      {phases.map((p) => (
        <section key={p.no} className="phase">
          <h3 className="phase-title">
            Phase {p.no}: {p.name}
            <span>
              {phaseProgress(p)}/{p.days.length} days · Days {p.days[0].day}-{p.days.at(-1).day}
            </span>
          </h3>
          <div className="days">
            {p.days.map((d) => (
              <DayCard key={d.day} d={d} level={level} open={!!openDays[d.day]} onToggleOpen={() => setOpenDays((m) => ({ ...m, [d.day]: !m[d.day] }))} />
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
