"use client";

import { useState, useEffect, useCallback } from "react";
import { getSession, setSession, clearSession, patchSession, Session } from "../lib/session";

export function useSession() {
  const [session, setLocalSession] = useState<Session | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLocalSession(getSession());
    setLoaded(true);
  }, []);

  const login = useCallback((s: Session) => {
    setSession(s);
    setLocalSession(s);
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setLocalSession(null);
  }, []);

  const update = useCallback((patch: Partial<Session>) => {
    patchSession(patch);
    setLocalSession(getSession());
  }, []);

  return { session, loaded, login, logout, update };
}
