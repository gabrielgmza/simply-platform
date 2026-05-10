"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Smile, ArrowRight, Info, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button, useSession } from "@simply/ui";
import LivenessCapture, {
  LivenessChallenge,
  CapturedFrame,
} from "@/components/registro/LivenessCapture";
import StateCard from "@/components/registro/StateCard";

type Phase = "intro" | "challenges_loading" | "capturing" | "uploading" | "result";

export default function RegistroSelfiePage() {
  const router = useRouter();
  const { session, loaded, update } = useSession();
  const [phase, setPhase] = useState<Phase>("intro");
  const [challenges, setChallenges] = useState<LivenessChallenge[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

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

  async function start() {
    setError(null);
    setPhase("challenges_loading");
    try {
      const res = await fetch("/api/auth/liveness-challenges?cantidad=3");
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "No pudimos preparar los desafíos");
      setChallenges(data.challenges || []);
      setPhase("capturing");
    } catch (e: any) {
      setError(e.message);
      setPhase("intro");
    }
  }

  async function handleCaptureComplete(payload: { mainSelfie: Blob; frames: CapturedFrame[] }) {
    setPhase("uploading");
    setError(null);

    const customerId = (session as any).customerId;

    try {
      // 1. Pedir signed URL
      const signRes = await fetch("/api/auth/signed-upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId,
          kind: "selfie",
          mimeType: "image/jpeg",
        }),
      });
      const signData = await signRes.json();
      if (!signRes.ok) throw new Error(signData.message || "No pudimos preparar la subida");

      // 2. Subir blob HD a GCS
      const putRes = await fetch(signData.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": "image/jpeg" },
        body: payload.mainSelfie,
      });
      if (!putRes.ok) throw new Error(`Error subiendo a GCS: ${putRes.status}`);

      // 3. Pedir al backend que procese (face-match + liveness)
      const procRes = await fetch("/api/auth/process-selfie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId,
          gcsPath: signData.gcsPath,
          mimeType: "image/jpeg",
          livenessFrames: payload.frames,
        }),
      });
      const data = await procRes.json();
      if (!procRes.ok) throw new Error(data.message || "Error verificando identidad");

      setResult(data);
      setPhase("result");

      if (data.ok && data.profileStatus === "VERIFIED_BASIC") {
        update({ profileStatus: "VERIFIED_BASIC" } as any);
      }
    } catch (e: any) {
      setError(e.message);
      setPhase("intro");
    }
  }

  function handleContinue() {
    router.push("/destinatario");
  }

  if (!loaded || !session) {
    return <div className="text-center py-12 text-white/60">Cargando...</div>;
  }

  return (
    <div className="space-y-6 animate-page-in">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-accent-500/15 mx-auto flex items-center justify-center">
          <Smile className="w-6 h-6 text-accent-400" />
        </div>
        <h1 className="text-2xl font-semibold">Verificación de identidad</h1>
        <p className="text-sm text-white/60">
          Una selfie con desafíos de prueba de vida.
        </p>
      </div>

      {phase === "intro" && (
        <>
          <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-3 flex gap-2 text-xs text-blue-200/90">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p>Vas a pasar por 3 desafíos cortos. Asegurate de:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>Estar en un lugar con buena luz</li>
                <li>Sin lentes oscuros, gorra o tapaboca</li>
                <li>Mirar de frente a la cámara</li>
                <li>Cara completa visible</li>
              </ul>
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
              {error}
            </div>
          )}

          <Button onClick={start} rightIcon={<ArrowRight className="w-5 h-5" />}>
            Empezar verificación
          </Button>
        </>
      )}

      {phase === "challenges_loading" && (
        <div className="text-center py-12 space-y-3">
          <Loader2 className="w-10 h-10 text-white/60 mx-auto animate-spin" />
          <p className="text-sm text-white/60">Preparando los desafíos…</p>
        </div>
      )}

      {phase === "capturing" && challenges.length > 0 && (
        <LivenessCapture
          challenges={challenges}
          onComplete={handleCaptureComplete}
          onClose={() => setPhase("intro")}
        />
      )}

      {phase === "uploading" && (
        <div className="text-center py-12 space-y-3">
          <Loader2 className="w-10 h-10 text-white/60 mx-auto animate-spin" />
          <p className="text-sm text-white/60">Verificando identidad…</p>
          <p className="text-xs text-white/40">
            Comparando con tu documento. Puede tardar unos segundos.
          </p>
        </div>
      )}

      {phase === "result" && result && (
        <div className="space-y-4">
          {result.ok ? (
            <>
              <StateCard
                kind="verified"
                title="¡Identidad verificada!"
                description={`Tu documento e imagen coinciden al ${Math.round((result.faceMatch?.score || 0) * 100)}%. Listo para operar.`}
              />
              <Button onClick={handleContinue} rightIcon={<ArrowRight className="w-5 h-5" />}>
                Continuar a tu operación
              </Button>
            </>
          ) : (
            <>
              <StateCard
                kind="warning"
                title="No pudimos verificarte"
                description={
                  result.faceMatch
                    ? `Coincidencia con DNI: ${Math.round((result.faceMatch.score || 0) * 100)}%. Probá con mejor iluminación o sin lentes.`
                    : "Probá nuevamente con buena iluminación y sin accesorios en la cara."
                }
              >
                {result.warnings && result.warnings.length > 0 && (
                  <ul className="text-xs text-amber-200/60 space-y-0.5">
                    {result.warnings.map((w: string, i: number) => (
                      <li key={i}>• {w}</li>
                    ))}
                  </ul>
                )}
              </StateCard>
              <Button
                onClick={() => {
                  setResult(null);
                  setPhase("intro");
                }}
              >
                Reintentar
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
