import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import api, { getToken, setToken } from '../api/client.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [pregnancy, setPregnancy] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!getToken()) {
      setUser(null);
      setPregnancy(null);
      setLoading(false);
      return null;
    }

    try {
      const data = await api.auth.me();
      setUser(data.user);
      setPregnancy(data.pregnancy);
      return data;
    } catch {
      setToken(null);
      setUser(null);
      setPregnancy(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback(async (credentials) => {
    const data = await api.auth.login(credentials);
    setToken(data.token);
    setUser(data.user);
    const me = await api.auth.me();
    setPregnancy(me.pregnancy);
    return data;
  }, []);

  const register = useCallback(async (payload) => {
    const data = await api.auth.register(payload);
    setToken(data.token);
    setUser(data.user);
    const me = await api.auth.me();
    setPregnancy(me.pregnancy);
    return data;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setPregnancy(null);
  }, []);

  const updatePregnancy = useCallback((value) => {
    setPregnancy(value);
  }, []);

  const value = useMemo(
    () => ({
      user,
      pregnancy,
      loading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      refresh,
      setPregnancy: updatePregnancy,
    }),
    [user, pregnancy, loading, login, register, logout, refresh, updatePregnancy],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
}
