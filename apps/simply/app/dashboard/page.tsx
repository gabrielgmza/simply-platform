"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BalanceHero from "./BalanceHero";
import QuickActions from "./QuickActions";
import FeaturedRecommendation from "./FeaturedRecommendation";
import RecentActivity from "./RecentActivity";
import ActiveProducts from "./ActiveProducts";

interface Session {
  customerId: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  profileStatus?: string;
  accountLevel?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const raw = typeof window !== "undefined" ? localStorage.getItem("simply_session") : null;
    if (!raw) {
      router.push("/login");
      return;
    }
    try {
      const s = JSON.parse(raw);
      if (!s?.customerId) throw new Error();
      setSession(s);
    } catch {
      router.push("/login");
    }
  }, [router]);

  if (!session) return null;

  return (
    <div className="space-y-5 animate-page-in">
      <BalanceHero customerId={session.customerId} firstName={session.firstName || undefined} />
      <QuickActions />
      <FeaturedRecommendation customerId={session.customerId} />
      <ActiveProducts customerId={session.customerId} />
      <RecentActivity customerId={session.customerId} />
    </div>
  );
}
