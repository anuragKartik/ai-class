import { usePlayer } from '../context.jsx';
import { Check, PageTitle } from '../ui.jsx';

export default function AiRoadmap({ content }) {
  const play = usePlayer();
  const { why, steps, checklist, mistakes, program } = content;
  return (
    <>
      <PageTitle title="The 5-step AI Engineer roadmap">
        Go in order. Finish each step by building something small before moving on. Every link is free - skip the paid bootcamps and the endless certificate collecting.
        Hiring teams care most about projects you have shipped.
      </PageTitle>

      <section className="card">
        <h3 className="card-title">Why AI engineering, and why now?</h3>
        <p className="prose">{why.intro}</p>
        <div className="stat-row">
          {why.stats.map((s) => (
            <div className="stat" key={s.value}>
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
        <p className="fineprint">{why.note}</p>
      </section>

      <ol className="steps">
        {steps.map((s, i) => (
          <li key={s.id} className="step card">
            <div className="step-head">
              <span className="step-no">{i + 1}</span>
              <div>
                <h3>{s.title}</h3>
                <p className="tagline">{s.tagline}</p>
              </div>
              <Check id={`ai.step.${s.id}`} label="Step complete" className="step-check" />
            </div>
            <p className="outcome">
              <strong>Outcome:</strong> {s.outcome}
            </p>
            <h4>What to do</h4>
            <ul className="bullets">
              {s.todo.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <h4>Free resources</h4>
            <ul className="resources">
              {s.resources.map((r) => (
                <li key={r.url}>
                  <div>
                    <a href={r.url} target="_blank" rel="noreferrer">
                      {r.label} ↗
                    </a>
                    <span>{r.note}</span>
                  </div>
                  {r.videoId && (
                    <button className="btn small" onClick={() => play({ id: r.videoId, type: 'video', title: r.label, url: r.url })}>
                      ▶ Watch here
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      <div className="two-col">
        <section className="card">
          <h3 className="card-title">Your project checklist</h3>
          <ul className="checklist">
            {checklist.map((c, i) => (
              <li key={c}>
                <Check id={`ai.proj.${i}`} label={c} />
              </li>
            ))}
          </ul>
        </section>
        <section className="card warn">
          <h3 className="card-title">Common mistakes to avoid</h3>
          <ul className="bullets">
            {mistakes.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </section>
      </div>
      <p className="fineprint">{program.credit}</p>
    </>
  );
}
