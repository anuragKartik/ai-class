import { PageTitle, Table } from '../ui.jsx';

export default function SalesforceOverview({ content }) {
  const { role, overview, program } = content;
  return (
    <>
      <PageTitle title="Your Salesforce target role">
        Course 03 for <strong>{role.title}</strong> ({role.reqId}). Status tip: {role.statusHint}
      </PageTitle>

      <section className="card">
        <p className="eyebrow">{role.location}</p>
        <p className="prose lead">{role.summary}</p>
        <h4>What you will do day to day</h4>
        <ul className="bullets cols">
          {role.dayToDay.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      </section>

      <div className="two-col">
        <section className="card">
          <h3 className="card-title">Must-have signals</h3>
          <ul className="bullets">
            {role.mustHave.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </section>
        <section className="card">
          <h3 className="card-title">Nice-to-have (and learnable)</h3>
          <ul className="bullets">
            {role.niceToHave.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </section>
      </div>

      <section>
        <h3 className="section-title">Why this role fits your path</h3>
        <div className="grid-cards">
          {role.whyThisRole.map((w) => (
            <div key={w.title} className="card tight">
              <h4>{w.title}</h4>
              <p>{w.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <p className="prose lead">{overview.what}</p>
        <h4>How interviewers imagine your week</h4>
        <ul className="bullets cols">
          {overview.daily.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h3 className="card-title">This MTS role vs nearby paths</h3>
        <Table columns={overview.compare.columns} rows={overview.compare.rows} />
      </section>

      <section>
        <h3 className="section-title">Why prepare hard for this loop</h3>
        <div className="grid-cards">
          {overview.why.map((w) => (
            <div key={w.title} className="card tight">
              <h4>{w.title}</h4>
              <p>{w.text}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="two-col">
        <section className="card">
          <h3 className="card-title">Related teams & context</h3>
          <ul className="bullets">
            {overview.companies.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </section>
        <section className="card">
          <h3 className="card-title">{overview.salary.title}</h3>
          <Table columns={['Level', 'Orientation']} rows={overview.salary.rows} />
          <p className="fineprint">{overview.salary.note}</p>
        </section>
      </div>

      <section>
        <h3 className="section-title">Skills this interview actually tests</h3>
        <div className="grid-cards">
          {overview.skills.map((g) => (
            <div key={g.title} className="card tight">
              <h4>{g.title}</h4>
              <ul className="bullets">
                {g.items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="tools">
          <strong>Common tools:</strong> {overview.tools.join(' · ')}
        </p>
      </section>
      <p className="fineprint">{program.credit}</p>
    </>
  );
}
