import React, { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from 'react';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface LoginResult {
  ok: boolean;
  message?: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<LoginResult>;
  logout: (options?: { silent?: boolean }) => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasRole: (...roles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const verifyToken = useCallback(async (token: string) => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 12000);
    try {
      const response = await fetch('/api/auth/verify', {
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal,
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        localStorage.removeItem('token');
        setUser(null);
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      window.clearTimeout(timeoutId);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      void verifyToken(token);
    } else {
      setIsLoading(false);
    }
  }, [verifyToken]);

  const login = useCallback(async (username: string, password: string): Promise<LoginResult> => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 12000);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        signal: controller.signal,
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        setUser(data.user);
        return { ok: true };
      }

      let message = 'Invalid credentials';
      try {
        const data = await response.json();
        if (typeof data?.message === 'string') message = data.message;
      } catch (_err) {
        /* swallow */
      }
      return { ok: false, message };
    } catch (error) {
      console.error('Login failed:', error);
      return { ok: false, message: 'Unable to reach the server. Please try again.' };
    } finally {
      window.clearTimeout(timeoutId);
    }
  }, []);

  const logout = useCallback(async (options: { silent?: boolean } = {}) => {
    const token = localStorage.getItem('token');
    localStorage.removeItem('token');
    setUser(null);
    if (token && !options.silent) {
      // Fire-and-forget so UI is never blocked by a backend outage.
      fetch('/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => undefined);
    }
  }, []);

  // Global 401 handler — any admin call returning 401 (invalid/expired token)
  // clears credentials and dispatches a custom event the app shell listens for.
  useEffect(() => {
    const originalFetch = window.fetch.bind(window);
    const patchedFetch: typeof window.fetch = async (input, init) => {
      const response = await originalFetch(input, init);
      const url = typeof input === 'string' ? input : (input as Request).url;
      if (
        response.status === 401 &&
        url.includes('/api/') &&
        !url.includes('/api/auth/login') &&
        !url.includes('/api/auth/verify')
      ) {
        localStorage.removeItem('token');
        setUser(null);
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));
      }
      return response;
    };
    window.fetch = patchedFetch;
    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  const hasRole = useCallback(
    (...roles: string[]) => {
      if (!user) return false;
      if (roles.length === 0) return true;
      return roles.includes(user.role);
    },
    [user]
  );

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      login,
      logout,
      isLoading,
      isAuthenticated: !!user,
      hasRole,
    }),
    [user, login, logout, isLoading, hasRole]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
