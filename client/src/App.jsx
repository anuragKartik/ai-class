import { useEffect, useMemo, useState } from 'react';
import { ProgressProvider, PlayerProvider, useProgress } from './context.jsx';
import { useCareer, useLocalStorage, useTrackData } from './hooks.js';
import AiRoadmap from './views/AiRoadmap.jsx';
import Plan100 from './views/Plan100.jsx';
import FdeOverview from './views/FdeOverview.jsx';
import FdePlan, { FdeInterview } from './views/FdePlan.jsx';
import Library, { Reading } from './views/Library.jsx';
import Growth from './views/Growth.jsx';
import Mocks from './views/Mocks.jsx';
import Jobs from './views/Jobs.jsx';

const COURSES = [
  {
    id: 'desk',
    label: 'Your desk',
    kicker: 'Start here',
    pages: [
      { id: 'growth', label: 'Growth' },
      { id: 'mocks', label: 'Mock interviews' },
      { id: 'jobs', label: 'Jobs & LinkedIn' },
    ],
  },
  {
    id: 'ai',
    label: 'AI Engineer',
    kicker: 'Course 01',
    pages: [
      { id: 'overview', label: 'Course overview' },
      { id: 'plan100', label: '100-day plan' },
      { id: 'library', label: 'Video classroom' },
      { id: 'reading', label: 'Reading list' },
    ],
  },
  {
    id: 'fde',
    label: 'FDE Prep',
    kicker: 'Course 02',
    pages: [
      { id: 'overview', label: 'What is an FDE?' },
      { id: 'plan', label: 'Study plan' },
      { id: 'interview', label: 'Interview prep' },
      { id: 'library', label: 'Video classroom' },
      { id: 'reading', label: 'Reading list' },
    ],
  },
];

export default function App() {
  return (
    <ProgressProvider>
      <PlayerProvider>
        <Shell />
      </PlayerProvider>
    </ProgressProvider>
  );
}

function Shell() {
  const [theme, setTheme] = useLocalStorage('anurag-ai-classes.theme', 'light');
  const [courseId, setCourseId] = useLocalStorage('anurag-ai-classes.course', 'desk');
  const [page, setPage] = useLocalStorage('anurag-ai-classes.page', 'growth');
  const [menuOpen, setMenuOpen] = useState(false);
  const [sessions, setSessions] = useLocalStorage('anurag-ai-classes.mocks.v1', []);
  const career = useCareer();
  const course = COURSES.find((c) => c.id === courseId) || COURSES[0];
  const currentPage = course.pages.some((p) => p.id === page) ? page : course.pages[0].id;
  const trackId = course.id === 'desk' ? null : course.id;
  const { loading, error, data } = useTrackData(trackId);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const go = (id, nextPage) => {
    setCourseId(id);
    setPage(nextPage);
    setMenuOpen(false);
    document.querySelector('.page')?.scrollTo({ top: 0 });
  };

  const mockAvg = useMemo(() => {
    if (!sessions.length) return null;
    return (sessions.reduce((n, s) => n + s.score, 0) / sessions.length).toFixed(1);
  }, [sessions]);

  return (
    <div className="shell">
      <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <div className="brand">
          <span className="mark">A</span>
          <div>
            <strong>Anurag AI Classes</strong>
            <small>Two courses. One classroom.</small>
          </div>
        </div>
        <div className="sidebar-scroll">
          {COURSES.map((c) => (
            <nav key={c.id} className="course-nav" aria-label={c.label}>
              <p className="nav-kicker">{c.kicker}</p>
              <p className="nav-course">{c.label}</p>
              {c.pages.map((p) => (
                <button
                  key={p.id}
                  className={course.id === c.id && currentPage === p.id ? 'active' : ''}
                  onClick={() => go(c.id, p.id)}
                >
                  {p.label}
                </button>
              ))}
            </nav>
          ))}
        </div>
        <div className="sidebar-foot">
          <SidebarProgress />
          <div className="theme-switch" role="group" aria-label="Colour theme">
            <button className={theme === 'light' ? 'active' : ''} onClick={() => setTheme('light')}>
              Light
            </button>
            <button className={theme === 'dark' ? 'active' : ''} onClick={() => setTheme('dark')}>
              Dark
            </button>
          </div>
        </div>
      </aside>

      <div className="stage">
        <header className="topbar">
          <button className="menu-btn" onClick={() => setMenuOpen((v) => !v)} aria-label="Open course menu">
            Menu
          </button>
          <div>
            <p className="crumb">
              {course.label} <span>/</span> {course.pages.find((p) => p.id === currentPage)?.label}
            </p>
            <h1>{course.pages.find((p) => p.id === currentPage)?.label}</h1>
          </div>
        </header>

        <main className="page">
          {course.id !== 'desk' && loading && <p className="state">Loading the classroom…</p>}
          {course.id !== 'desk' && error && <p className="state error">{error}</p>}
          {(course.id === 'desk' || (!loading && !error && data)) && (
            <CoursePage
              courseId={course.id}
              page={currentPage}
              data={data}
              career={career}
              sessions={sessions}
              setSessions={setSessions}
              mockAvg={mockAvg}
            />
          )}
        </main>
      </div>

      {menuOpen && <button className="backdrop" aria-label="Close menu" onClick={() => setMenuOpen(false)} />}
    </div>
  );
}

function SidebarProgress() {
  const { done } = useProgress();
  const n = Object.keys(done).length;
  return (
    <p className="sidebar-progress">
      {n} item{n === 1 ? '' : 's'} marked complete
    </p>
  );
}

function CoursePage({ courseId, page, data, career, sessions, setSessions, mockAvg }) {
  if (courseId === 'desk') {
    if (page === 'growth') return <Growth mockCount={sessions.length} mockAvg={mockAvg} />;
    if (career.loading) return <p className="state">Loading career desk…</p>;
    if (career.error) return <p className="state error">{career.error}</p>;
    if (page === 'mocks') return <Mocks career={career.data} sessions={sessions} setSessions={setSessions} />;
    if (page === 'jobs') return <Jobs career={career.data} />;
  }
  if (courseId === 'ai' && data) {
    if (page === 'overview') return <AiRoadmap content={data.content} />;
    if (page === 'plan100') return <Plan100 plan={data.plan} />;
    if (page === 'library') return <Library data={data} track="ai" />;
    if (page === 'reading') return <Reading data={data} />;
  }
  if (courseId === 'fde' && data) {
    if (page === 'overview') return <FdeOverview content={data.content} />;
    if (page === 'plan') return <FdePlan content={data.content} />;
    if (page === 'interview') return <FdeInterview content={data.content} />;
    if (page === 'library') return <Library data={data} track="fde" />;
    if (page === 'reading') return <Reading data={data} />;
  }
  return <p className="state">Choose a page from the left.</p>;
}
