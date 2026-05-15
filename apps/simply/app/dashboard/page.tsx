"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BalanceHero from "./BalanceHero";
import QuickActions from "./QuickActions";
import FeaturedRecommendation from "./FeaturedRecommendation";
import RecentActivity from "./RecentActivity";
import ActiveProducts from "./ActiveProducts";
import TierProgressCard from "./TierProgress";
import WelcomeCard from "./WelcomeCard";
import FxQuotes from "./FxQuotes";
import { getBalances } from "@/lib/balances-api";
import { listOperations } from "@/lib/operations-api";

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
  const [isNew, setIsNew] = useState<boolean | null>(null);

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

  // Detectar "usuario nuevo": no tiene wallet linkeada y/o no tiene ops
  useEffect(() => {
    if (!session?.customerId) return;
    Promise.all([
      getBalances(session.customerId).catch(() => null),
      listOperations(session.customerId, { limit: 1 }).catch(() => []),
    ]).then(([bal, ops]) => {
      const hasWallet = !!bal?.linked && Object.keys(bal?.balances || {}).length > 0;
      const hasOps = (ops?.length || 0) > 0;
      setIsNew(!hasWallet && !hasOps);
    });
  }, [session?.customerId]);

  if (!session) return null;

  return (
    <div className="space-y-5 animate-page-in">
      <BalanceHero customerId={session.customerId} firstName={session.firstName || undefined} accountLevel={session.accountLevel} />
      <QuickActions customerId={session.customerId} firstName={session.firstName || undefined} accountLevel={session.accountLevel} />
      <FxQuotes />
      {isNew && (
        <WelcomeCard
          profileStatus={session.profileStatus || "REGISTERED"}
          hasWallet={false}
          hasOps={false}
        />
      )}
      <FeaturedRecommendation customerId={session.customerId} accountLevel={session.accountLevel} />
      <ActiveProducts customerId={session.customerId} />
      <RecentActivity customerId={session.customerId} />
      <TierProgressCard customerId={session.customerId} accountLevel={session.accountLevel} />
    </div>
  );
}
