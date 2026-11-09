import { PageTitle, Table } from '../ui.jsx';

export default function FdeOverview({ content }) {
  const o = content.overview;
  return (
    <>
      <PageTitle title="What is a Forward Deployed Engineer?">Start here. Understand the role before you plan your preparation.</PageTitle>

      <section className="card">
        <p className="prose lead">{o.what}</p>
        <h4>What does an FDE do day to day?</h4>
        <ul className="bullets cols">
          {o.daily.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h3 className="card-title">FDE vs Software Engineer vs Solutions Engineer</h3>
        <Table columns={o.compare.columns} rows={o.compare.rows} />
      </section>

      <section>
        <h3 className="section-title">Why choose the FDE path?</h3>
        <div className="grid-cards">
          {o.why.map((w) => (
            <div key={w.title} className="card tight">
              <h4>{w.title}</h4>
              <p>{w.text}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="two-col">
        <section className="card">
          <h3 className="card-title">Companies that hire FDEs</h3>
          <ul className="bullets">
            {o.companies.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </section>
        <section className="card">
          <h3 className="card-title">{o.salary.title}</h3>
          <Table columns={['Experience', 'Approx. CTC']} rows={o.salary.rows} />
          <p className="fineprint">{o.salary.note}</p>
        </section>
      </div>

      <section>
        <h3 className="section-title">Skills every FDE needs</h3>
        <div className="grid-cards">
          {o.skills.map((g) => (
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
          <strong>Common tools:</strong> {o.tools.join(' · ')}
        </p>
      </section>
      <p className="fineprint">{content.program.credit}</p>
    </>
  );
}
