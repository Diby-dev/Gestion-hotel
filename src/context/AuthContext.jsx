import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('grandh_user') || 'null'); } catch { return null; }
  });

  const saveSession = (session) => {
    localStorage.setItem('grandh_token', session.token);
    localStorage.setItem('grandh_user', JSON.stringify(session.user));
    setUser(session.user);
  };
  const logout = async () => {
    try { await api('/logout', { method: 'POST' }); } catch { /* token may already be expired */ }
    localStorage.removeItem('grandh_token');
    localStorage.removeItem('grandh_user');
    setUser(null);
  };
  useEffect(() => {
    if (!localStorage.getItem('grandh_token')) return;
    api('/user').then((currentUser) => {
      localStorage.setItem('grandh_user', JSON.stringify(currentUser));
      setUser(currentUser);
    }).catch(() => logout());
  }, []);
  return <AuthContext.Provider value={{ user, saveSession, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth doit être utilisé dans AuthProvider');
  return context;
}
