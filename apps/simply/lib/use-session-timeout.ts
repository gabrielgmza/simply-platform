"use client";

import { useEffect, useRef } from "react";

/**
 * Cierra sesión tras N minutos de inactividad.
 * Resetea el timer en cualquier evento de usuario.
 */
export function useSessionTimeout(timeoutMinutes: number | undefined, onTimeout: () => void) {
  const timerRef = useRef<any>(null);
  const onTimeoutRef = useRef(onTimeout);

  // Mantener referencia actualizada sin re-disparar el effect
  useEffect(() => {
    onTimeoutRef.current = onTimeout;
  }, [onTimeout]);

  useEffect(() => {
    if (!timeoutMinutes || timeoutMinutes <= 0) return;
    const ms = timeoutMinutes * 60 * 1000;

    function reset() {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => onTimeoutRef.current(), ms);
    }

    const events = ["mousedown", "keydown", "touchstart", "scroll", "click"];
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    reset();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach((e) => window.removeEventListener(e, reset));
    };
  }, [timeoutMinutes]);
}
