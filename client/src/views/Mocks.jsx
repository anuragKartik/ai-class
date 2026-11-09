import { useEffect, useMemo, useState } from 'react';
import { Chip, PageTitle, Segmented } from '../ui.jsx';

export default function Mocks({ career, sessions, setSessions }) {
  const mocks = career.mocks;
  const [typeId, setTypeId] = useState(mocks.types[0].id);
  const type = mocks.types.find((t) => t.id === typeId) || mocks.types[0];
  const [qid, setQid] = useState(type.questions[0].id);
  const question = type.questions.find((q) => q.id === qid) || type.questions[0];
  const [notes, setNotes] = useState('');
  const [score, setScore] = useState(3);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    setQid(type.questions[0].id);
    setNotes('');
    setSeconds(0);
    setRunning(false);
  }, [type.id]);

  useEffect(() => {
    if (!running) return undefined;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  const overtime = seconds > type.minutes * 60;

  const save = () => {
    const entry = {
      id: `${Date.now()}`,
      at: Date.now(),
      type: type.label,
      question: question.title,
      notes,
      score: Number(score),
      seconds,
    };
    setSessions((list) => [entry, ...list].slice(0, 50));
    setRunning(false);
  };

  const avg = useMemo(() => {
    if (!sessions.length) return null;
    return (sessions.reduce((n, s) => n + s.score, 0) / sessions.length).toFixed(1);
  }, [sessions]);

  return (
    <>
      <PageTitle title="Mock interviews">
        {mocks.intro} Log every session so your growth page can show interview fitness, not just videos watched.
      </PageTitle>

      <section className="grid-cards">
        {mocks.book.map((b) => (
          <article key={b.id} className="card tight">
            <p className="eyebrow">{b.price}</p>
            <h3>{b.title}</h3>
            <p>{b.note}</p>
            {b.url ? (
              <a className="btn small" href={b.url} target="_blank" rel="noreferrer">
                {b.cta} ↗
              </a>
            ) : (
              <span className="pill">{b.cta}</span>
            )}
          </article>
        ))}
      </section>

      <section className="card">
        <div className="plan-controls">
          <div>
            <span className="label">Round type</span>
            <Segmented label="Round type" options={mocks.types} value={typeId} onChange={setTypeId} />
          </div>
          <div className={`timer ${overtime ? 'over' : ''}`}>
            <strong>
              {mm}:{ss}
            </strong>
            <span> / {type.minutes}:00</span>
          </div>
        </div>
        <p className="lede">{type.hint}</p>
        <div className="chips">
          {type.questions.map((q) => (
            <Chip key={q.id} active={qid === q.id} onClick={() => setQid(q.id)}>
              {q.title}
            </Chip>
          ))}
        </div>
        <h3 className="card-title" style={{ marginTop: 18 }}>
          {question.title}
        </h3>
        <p className="prose">{question.prompt}</p>
        <textarea
          className="notes"
          rows={6}
          placeholder="Talk out loud, then jot the structure of your answer here."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <div className="mock-actions">
          <button className="btn" onClick={() => setRunning((v) => !v)}>
            {running ? 'Pause' : seconds ? 'Resume' : 'Start timer'}
          </button>
          <button className="btn ghost" onClick={() => { setSeconds(0); setRunning(false); }}>
            Reset
          </button>
          <label className="score">
            Self-score
            <select value={score} onChange={(e) => setScore(e.target.value)}>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n} / 5
                </option>
              ))}
            </select>
          </label>
          <button className="btn" onClick={save} disabled={!seconds && !notes}>
            Save session
          </button>
        </div>
      </section>

      <section className="card">
        <h3 className="card-title">Your sessions {avg ? `· avg ${avg}/5` : ''}</h3>
        {sessions.length === 0 ? (
          <p className="empty">No mocks logged yet. Do one today, even a 15-minute behavioral.</p>
        ) : (
          <ul className="session-list">
            {sessions.map((s) => (
              <li key={s.id}>
                <strong>
                  {s.type}: {s.question}
                </strong>
                <span>
                  {new Date(s.at).toLocaleString()} · {Math.round(s.seconds / 60)} min · {s.score}/5
                </span>
                {s.notes && <p>{s.notes}</p>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
