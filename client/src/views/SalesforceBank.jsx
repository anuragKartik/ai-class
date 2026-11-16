import { useState } from 'react';
import { Check, Chip, PageTitle } from '../ui.jsx';

export default function SalesforceBank({ content }) {
  const bank = content.questionBank;
  if (!bank) return <p className="state">Question bank missing from course data.</p>;

  const [catId, setCatId] = useState(bank.categories[0].id);
  const category = bank.categories.find((c) => c.id === catId) || bank.categories[0];
  const [showHints, setShowHints] = useState(true);

  return (
    <>
      <PageTitle title="Question bank">
        {bank.intro} Tick a question when you can answer it in under two minutes without reading notes.
      </PageTitle>

      <section className="card plan-controls">
        <div className="chips">
          <Chip active={showHints} onClick={() => setShowHints(true)}>
            Show hints
          </Chip>
          <Chip active={!showHints} onClick={() => setShowHints(false)}>
            Hide hints
          </Chip>
        </div>
      </section>

      <div className="chips" style={{ marginBottom: 16 }}>
        {bank.categories.map((c) => (
          <Chip key={c.id} active={catId === c.id} onClick={() => setCatId(c.id)} count={c.items.length}>
            {c.label}
          </Chip>
        ))}
      </div>

      <ol className="rounds">
        {category.items.map((item, i) => (
          <li key={`${category.id}-${i}`} className="card round">
            <header className="round-head">
              <span className="step-no">{i + 1}</span>
              <div>
                <h3>{item.q}</h3>
                {showHints && item.hint && <p className="meta">Hint: {item.hint}</p>}
              </div>
              <Check id={`sf.q.${category.id}.${i}`} label="Ready" className="step-check" />
            </header>
          </li>
        ))}
      </ol>
    </>
  );
}
