"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, ArrowRight, Info } from "lucide-react";
import { Button, useSession } from "@simply/ui";
import DocSideUploader, {
  DniSideUploadResult,
} from "@/components/registro/DocSideUploader";

export default function RegistroDniPage() {
  const router = useRouter();
  const { session, loaded } = useSession();
  const [front, setFront] = useState<DniSideUploadResult | null>(null);
  const [back, setBack] = useState<DniSideUploadResult | null>(null);

  useEffect(() => {
    if (!loaded) return;
    if (!session) {
      router.replace("/registro");
      return;
    }
    const status = (session as any).profileStatus;
    if (!status || status === "LEAD" || status === "GUEST") {
      router.replace("/registro/datos");
    }
  }, [loaded, session, router]);

  if (!loaded || !session) {
    return <div className="text-center py-12 text-white/60">Cargando...</div>;
  }

  const customerId = (session as any).customerId;
  const frontOk = !!(front && front.ok && front.crossCheck.ok);
  const backOk = !!(back && back.ok && back.crossCheck.ok);
  const bothOk = frontOk && backOk;

  function handleContinue() {
    if (!bothOk) return;
    router.push("/registro/selfie");
  }

  return (
    <div className="space-y-6 animate-page-in">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-accent-500/15 mx-auto flex items-center justify-center">
          <Camera className="w-6 h-6 text-accent-400" />
        </div>
        <h1 className="text-2xl font-semibold">Subí tu documento</h1>
        <p className="text-sm text-white/60">
          Necesitamos las dos caras de tu documento de identidad.
        </p>
      </div>

      <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-3 flex gap-2 text-xs text-blue-200/90">
        <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p>Asegurate de:</p>
          <ul className="list-disc pl-4 space-y-0.5">
            <li>Buena iluminación, sin reflejos</li>
            <li>Documento completo en cuadro, sin recortes</li>
            <li>Foto nítida, sin movimiento</li>
            <li>Fondo limpio, sin objetos extra</li>
          </ul>
        </div>
      </div>

      <div className="space-y-3">
        <DocSideUploader
          side="front"
          title="Frente del documento"
          hint="Lado con tu foto"
          customerId={customerId}
          onUploaded={setFront}
        />
        <DocSideUploader
          side="back"
          title="Dorso del documento"
          hint="Lado con código de barras"
          customerId={customerId}
          onUploaded={setBack}
        />
      </div>

      <Button
        onClick={handleContinue}
        disabled={!bothOk}
        rightIcon={<ArrowRight className="w-5 h-5" />}
      >
        Continuar
      </Button>

      {!bothOk && (front || back) && (
        <p className="text-center text-xs text-amber-400/80">
          Para continuar, ambos lados deben coincidir con tus datos registrados.
        </p>
      )}

      {!front && !back && (
        <p className="text-center text-xs text-white/40">
          Tus documentos se guardan de forma segura y solo se usan para verificación.
        </p>
      )}
    </div>
  );
}
