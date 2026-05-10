"use client";

import { usePathname } from "next/navigation";
import WizardHeader from "@/components/WizardHeader";

const BACK_BY_PATH: Record<string, string | undefined> = {
  "/registro":         undefined,        // primer paso, no hay atrás
  "/registro/datos":   "/registro",
  "/registro/dni":     "/registro/datos",
  "/registro/selfie":  "/registro/dni",
};

export default function RegistroLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const backTo = BACK_BY_PATH[pathname];

  return (
    <>
      <style>{`
        body > div > header { display: none !important; }
        body > div > footer { display: none !important; }
        main { padding-top: 5rem !important; padding-bottom: 3rem !important; }
      `}</style>

      <WizardHeader backTo={backTo} />

      <div className="animate-fade-up">{children}</div>
    </>
  );
}
