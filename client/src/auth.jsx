import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const ACCOUNTS_KEY = 'anurag-ai-classes.accounts.v1';
const SESSION_KEY = 'anurag-ai-classes.session.v1';

const LEGACY_KEYS = {
  progress: 'anurag-ai-classes.progress.v1',
  mocks: 'anurag-ai-classes.mocks.v1',
  apps: 'anurag-ai-classes.apps.v1',
  level: 'anurag-ai-classes.level',
};

const AuthCtx = createContext(null);

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or disabled */
  }
}

function normalizeEmail(email) {
  return String(email || '')
    .trim()
    .toLowerCase();
}

async function hashPassword(password, email) {
  const payload = `${normalizeEmail(email)}::${password}`;
  if (globalThis.crypto?.subtle) {
    const data = new TextEncoder().encode(payload);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }
  // Fallback for rare environments without SubtleCrypto
  let h = 0;
  for (let i = 0; i < payload.length; i++) h = (Math.imul(31, h) + payload.charCodeAt(i)) | 0;
  return `fallback:${h}`;
}

function accountSlug(email) {
  return normalizeEmail(email).replace(/[^a-z0-9]+/g, '_');
}

/** Storage keys for this account's classroom data (same browser only). */
export function userDataKeys(email) {
  const id = accountSlug(email);
  return {
    progress: `anurag-ai-classes.progress.v1.${id}`,
    mocks: `anurag-ai-classes.mocks.v1.${id}`,
    apps: `anurag-ai-classes.apps.v1.${id}`,
    level: `anurag-ai-classes.level.${id}`,
  };
}

function migrateLegacyIfEmpty(email) {
  const keys = userDataKeys(email);
  for (const [kind, legacyKey] of Object.entries(LEGACY_KEYS)) {
    const userKey = keys[kind];
    if (localStorage.getItem(userKey) != null) continue;
    const legacy = localStorage.getItem(legacyKey);
    if (legacy != null) localStorage.setItem(userKey, legacy);
  }
}

function loadAccounts() {
  const raw = readJson(ACCOUNTS_KEY, {});
  return raw && typeof raw === 'object' ? raw : {};
}

function loadSession() {
  const session = readJson(SESSION_KEY, null);
  if (!session?.email) return null;
  const accounts = loadAccounts();
  const account = accounts[normalizeEmail(session.email)];
  if (!account) {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
  return { email: account.email, name: account.name };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => loadSession());
  const [error, setError] = useState('');

  const signup = useCallback(async ({ name, email, password }) => {
    setError('');
    const cleanEmail = normalizeEmail(email);
    const cleanName = String(name || '').trim();
    if (!cleanName) return setError('Enter your name.');
    if (!cleanEmail || !cleanEmail.includes('@')) return setError('Enter a valid email.');
    if (!password || password.length < 4) return setError('Password must be at least 4 characters.');

    const accounts = loadAccounts();
    if (accounts[cleanEmail]) return setError('That email already has an account on this device. Log in instead.');

    const passwordHash = await hashPassword(password, cleanEmail);
    accounts[cleanEmail] = {
      email: cleanEmail,
      name: cleanName,
      passwordHash,
      createdAt: Date.now(),
    };
    writeJson(ACCOUNTS_KEY, accounts);
    migrateLegacyIfEmpty(cleanEmail);
    const next = { email: cleanEmail, name: cleanName };
    writeJson(SESSION_KEY, { email: cleanEmail });
    setUser(next);
  }, []);

  const login = useCallback(async ({ email, password }) => {
    setError('');
    const cleanEmail = normalizeEmail(email);
    const accounts = loadAccounts();
    const account = accounts[cleanEmail];
    if (!account) return setError('No account with that email on this device. Create one first.');

    const passwordHash = await hashPassword(password, cleanEmail);
    if (passwordHash !== account.passwordHash) return setError('Wrong password for this device account.');

    migrateLegacyIfEmpty(cleanEmail);
    writeJson(SESSION_KEY, { email: cleanEmail });
    setUser({ email: cleanEmail, name: account.name });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
    setError('');
  }, []);

  const clearError = useCallback(() => setError(''), []);

  const value = useMemo(
    () => ({
      user,
      isLoggedIn: !!user,
      error,
      clearError,
      signup,
      login,
      logout,
      dataKeys: user ? userDataKeys(user.email) : null,
    }),
    [user, error, clearError, signup, login, logout],
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

export function LoginScreen() {
  const { login, signup, error, clearError } = useAuth();
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === 'signup') await signup({ name, email, password });
      else await login({ email, password });
    } finally {
      setBusy(false);
    }
  };

  const switchMode = (next) => {
    setMode(next);
    clearError();
  };

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="mark">A</span>
          <div>
            <strong>Anurag AI Classes</strong>
            <small>Sign in once on this device. Your growth stays here until you log out.</small>
          </div>
        </div>

        <div className="segmented auth-tabs" role="group" aria-label="Account mode">
          <button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => switchMode('login')}>
            Log in
          </button>
          <button type="button" className={mode === 'signup' ? 'active' : ''} onClick={() => switchMode('signup')}>
            Create account
          </button>
        </div>

        <form className="auth-form" onSubmit={submit}>
          {mode === 'signup' && (
            <label>
              <span className="label">Name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                placeholder="Your name"
                required
              />
            </label>
          )}
          <label>
            <span className="label">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="you@example.com"
              required
            />
          </label>
          <label>
            <span className="label">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              placeholder="At least 4 characters"
              required
              minLength={4}
            />
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button className="btn" type="submit" disabled={busy}>
            {busy ? 'Working…' : mode === 'signup' ? 'Create account & enter' : 'Log in & continue'}
          </button>
        </form>

        <p className="auth-note">
          No server database — accounts and progress are saved only in this browser on this laptop. Stay logged in
          forever here; log out and the classroom clears until you sign back into that same account.
        </p>
      </div>
    </div>
  );
}
