import { useState } from 'react';
import { Check, Meter, PageTitle, Segmented, Table } from '../ui.jsx';
import { useProgress } from '../context.jsx';

export default function SalesforcePlan({ content }) {
  const [mode, setMode] = useState('fast');
  const { done } = useProgress();
  const { fastTrack, beginnerPath, communication } = content;
  if (!fastTrack || !beginnerPath) return <p className="state">This page needs the Salesforce course data.</p>;
  const monthKeys = fastTrack.months.flatMap((m) => m.rows.map((r) => `sf.month.${m.id}.${r.domain}`));
  const monthDone = monthKeys.filter((k) => done[k]).length;

  return (
    <>
      <PageTitle title="Salesforce study plan">
        Two speeds: a 4-week interview sprint if the call could come soon, or an 8-week deep prep if you have more runway.
      </PageTitle>

      <section className="card plan-controls">
        <div>
          <span className="label">Choose a pace</span>
          <Segmented
            label="Study pace"
            value={mode}
            onChange={setMode}
            options={[
              { id: 'fast', label: '4-week sprint' },
              { id: 'beginner', label: '8-week deep prep' },
            ]}
          />
        </div>
        {mode === 'fast' && <Meter value={monthDone} max={monthKeys.length} label="Topics completed" />}
      </section>

      {mode === 'fast' ? <FastTrack track={fastTrack} /> : <BeginnerPath path={beginnerPath} />}

      {communication && (
        <section className="card">
          <h3 className="card-title">{communication.title}</h3>
          <ul className="bullets">
            {communication.principles.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <h4>{communication.pitch.label}</h4>
          <p className="prose">{communication.pitch.text}</p>
          <h4>STAR checklist</h4>
          <ol className="bullets">
            {communication.starTemplate.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </section>
      )}
    </>
  );
}

function FastTrack({ track }) {
  return (
    <>
      <p className="lede">
        {track.intro} Tick a row when you can explain that domain out loud without notes.
      </p>
      {track.months.map((m) => {
        const total = m.rows.reduce((n, r) => n + r.hours, 0);
        return (
          <section key={m.id} className="card month">
            <header className="month-head">
              <div>
                <p className="eyebrow">{m.title}</p>
                <h3>{m.theme}</h3>
              </div>
              <span className="hours">{total} hrs</span>
            </header>
            <ul className="domain-list">
              {m.rows.map((r) => (
                <li key={r.domain}>
                  <Check
                    id={`sf.month.${m.id}.${r.domain}`}
                    label={
                      <span className="domain-label">
                        <strong>{r.domain}</strong>
                        <span className="hrs">{r.hours} hrs</span>
                      </span>
                    }
                  />
                  <p>{r.topics}</p>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </>
  );
}

function BeginnerPath({ path }) {
  return (
    <>
      <p className="lede">{path.intro}</p>
      <ol className="phase-list">
        {path.phases.map((p) => (
          <li key={p.id} className="card">
            <p className="eyebrow">{p.months}</p>
            <h3>{p.title}</h3>
            <p className="outcome">
              <strong>Goal:</strong> {p.goal}
            </p>
            <ul className="checklist">
              {p.items.map((item, i) => (
                <li key={item}>
                  <Check id={`sf.beginner.${p.id}.${i}`} label={item} />
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </>
  );
}

export function SalesforceInterview({ content }) {
  const { interview, projects, takeaways } = content;
  return (
    <>
      <PageTitle title="Interview rounds">{interview.intro}</PageTitle>

      <ol className="rounds">
        {interview.rounds.map((r) => (
          <li key={r.id} className="card round">
            <header className="round-head">
              <span className="step-no">{r.no}</span>
              <div>
                <h3>
                  {r.name}
                  {r.optional && <span className="pill">Optional</span>}
                </h3>
                <p className="meta">
                  {r.duration !== '-' ? r.duration : 'Varies'} · Tests: {r.tests}
                </p>
              </div>
              <Check id={`sf.round.${r.id}`} label="Prepared" className="step-check" />
            </header>
            <ul className="bullets">
              {r.details.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      <h3 className="block-title">How to prepare for each round</h3>
      <div className="grid-cards">
        {interview.tips.map((t) => (
          <section key={t.title} className="card tight">
            <h4>{t.title}</h4>
            <ul className="bullets">
              {t.items.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <section className="card warn">
        <h3 className="card-title">Mistakes to avoid</h3>
        <ul className="bullets">
          {interview.mistakes.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
        <p className="prose">
          <strong>Pro tip: </strong>
          {interview.proTip}
        </p>
      </section>

      <h3 className="block-title">Projects that match this JD</h3>
      <p className="lede">{projects.intro}</p>
      <ul className="checklist cards">
        {projects.items.map((p) => (
          <li key={p.id} className="card tight">
            <Check
              id={`sf.proj.${p.id}`}
              label={
                <span>
                  <strong>{p.title}</strong>
                  <span className="desc-inline">{p.text}</span>
                </span>
              }
            />
          </li>
        ))}
      </ul>

      <section className="card">
        <h3 className="card-title">Study resources</h3>
        <Table columns={['Area', 'Where to learn']} rows={projects.resources.map((r) => [r.label, r.text])} />
      </section>

      <section className="card">
        <h3 className="card-title">Remember</h3>
        <ul className="bullets">
          {takeaways.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </section>
    </>
  );
}
