"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/registro");
  }, [router]);
  return (
    <div className="text-center py-12 text-white/60">
      Redirigiendo...
    </div>
  );
}
