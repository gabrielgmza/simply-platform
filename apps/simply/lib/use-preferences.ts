"use client";

import { useEffect, useRef, useState } from "react";
import { getPreferences, updatePreferences, type CustomerPreferences, type TextSize } from "./preferences-api";

const DEFAULTS: Omit<CustomerPreferences, "customerId"> = {
  sessionTimeoutMinutes: 30,
  textSize: "normal",
  highContrast: false,
  reducedMotion: false,
};

function applyToDOM(p: Pick<CustomerPreferences, "textSize" | "highContrast" | "reducedMotion">) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;

  // text size → atributo data-text-size; el CSS define el zoom
  root.setAttribute("data-text-size", p.textSize);

  if (p.highContrast) root.classList.add("high-contrast");
  else root.classList.remove("high-contrast");

  if (p.reducedMotion) root.classList.add("reduced-motion");
  else root.classList.remove("reduced-motion");
}

export function usePreferences(customerId?: string) {
  const [prefs, setPrefs] = useState<CustomerPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const debounceRef = useRef<any>(null);

  useEffect(() => {
    if (!customerId) {
      setLoading(false);
      return;
    }
    getPreferences(customerId)
      .then((p) => {
        setPrefs(p);
        applyToDOM(p);
      })
      .catch(() => {
        setPrefs({ customerId, ...DEFAULTS });
        applyToDOM(DEFAULTS);
      })
      .finally(() => setLoading(false));
  }, [customerId]);

  function update(patch: Partial<Omit<CustomerPreferences, "customerId">>) {
    if (!prefs || !customerId) return;
    const next = { ...prefs, ...patch };
    setPrefs(next);
    applyToDOM(next);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSaving(true);
      try {
        const saved = await updatePreferences(customerId, patch);
        setPrefs(saved);
        setSavedAt(Date.now());
      } catch {
        // rollback silencioso
      } finally {
        setSaving(false);
      }
    }, 600);
  }

  return { prefs, loading, saving, savedAt, update };
}
