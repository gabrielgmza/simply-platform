import WizardHeader from "@/components/WizardHeader";

export default function RegistroLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Layout custom: oculta el header y footer del root layout para esta sección */}
      <style>{`
        body > div > header { display: none !important; }
        body > div > footer { display: none !important; }
        main { padding-top: 5rem !important; padding-bottom: 3rem !important; }
      `}</style>

      <WizardHeader />

      <div className="animate-fade-up">{children}</div>
    </>
  );
}
