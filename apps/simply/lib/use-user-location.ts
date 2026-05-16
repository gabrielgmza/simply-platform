"use client";

import { useEffect, useState } from "react";
import { currencyForCountry } from "./country-currency";

export interface UserLocation {
  country: string | null;
  city: string | null;
  currency: string;
  source: "gps" | "ip" | "cache" | "default";
}

const CACHE_KEY = "simply_user_location";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24h

interface CachedLocation {
  data: UserLocation;
  timestamp: number;
}

function getCached(): UserLocation | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed: CachedLocation = JSON.parse(raw);
    if (Date.now() - parsed.timestamp > CACHE_TTL_MS) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    return { ...parsed.data, source: "cache" };
  } catch {
    return null;
  }
}

function setCache(loc: UserLocation) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data: loc, timestamp: Date.now() }));
  } catch {}
}

async function fetchIPLocation(): Promise<UserLocation> {
  try {
    const res = await fetch("/api/geo", { cache: "no-store" });
    const data = await res.json();
    return {
      country: data.country,
      city: data.city,
      currency: currencyForCountry(data.country),
      source: "ip",
    };
  } catch {
    return {
      country: null,
      city: null,
      currency: "USD",
      source: "default",
    };
  }
}

async function tryGPS(): Promise<{ country: string } | null> {
  if (typeof navigator === "undefined" || !navigator.geolocation) return null;
  return new Promise((resolve) => {
    const timeout = setTimeout(() => resolve(null), 8000);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        clearTimeout(timeout);
        // Reverse geocoding: usamos un servicio gratis sin API key
        // Como precaución, si falla devolvemos null y caemos a IP
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`,
            { headers: { "User-Agent": "simply-app" } },
          );
          if (!res.ok) {
            resolve(null);
            return;
          }
          const data = await res.json();
          const country = data?.address?.country_code?.toUpperCase();
          if (country) resolve({ country });
          else resolve(null);
        } catch {
          resolve(null);
        }
      },
      () => {
        clearTimeout(timeout);
        resolve(null);
      },
      { enableHighAccuracy: false, timeout: 6000, maximumAge: 300000 },
    );
  });
}

export function useUserLocation(opts: { askGps?: boolean } = {}): {
  location: UserLocation | null;
  loading: boolean;
  refetch: () => Promise<void>;
} {
  const [location, setLocation] = useState<UserLocation | null>(() => getCached());
  const [loading, setLoading] = useState(!location);

  async function detect() {
    setLoading(true);
    // 1. Si pide GPS, probarlo (timeout 8s)
    let gpsCountry: string | null = null;
    if (opts.askGps) {
      const gps = await tryGPS();
      gpsCountry = gps?.country || null;
    }
    // 2. Pedir al server (lee headers Vercel)
    const ipLoc = await fetchIPLocation();
    const finalLoc: UserLocation = gpsCountry
      ? {
          country: gpsCountry,
          city: ipLoc.city, // Mantenemos ciudad del IP si GPS resolvió país
          currency: currencyForCountry(gpsCountry),
          source: "gps",
        }
      : ipLoc;
    setLocation(finalLoc);
    setCache(finalLoc);
    setLoading(false);
  }

  useEffect(() => {
    if (!location) detect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { location, loading, refetch: detect };
}
