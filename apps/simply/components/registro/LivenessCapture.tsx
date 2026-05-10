"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, X, Loader2 } from "lucide-react";

const FRAMES_PER_CHALLENGE = 3;
const CAPTURE_WIDTH = 720; // selfie no necesita HD enorme, suficiente para face match

export interface LivenessChallenge {
  id: string;
  accion: "blink" | "turn_left" | "turn_right" | "smile" | "face_present";
  instruccion: string;
}

export interface CapturedFrame {
  challengeId: string;
  accion: LivenessChallenge["accion"];
  imageBase64: string;
  ordenFrame: number;
}

interface Props {
  challenges: LivenessChallenge[];
  /** Callback cuando termina TODOS los challenges. mainSelfie es la mejor foto, frames son los de cada challenge */
  onComplete: (result: { mainSelfie: Blob; frames: CapturedFrame[] }) => void;
  onClose: () => void;
}

export default function LivenessCapture({
  challenges,
  onComplete,
  onClose,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<"ready" | "capturing" | "done">("ready");
  const [framesCaptured, setFramesCaptured] = useState<CapturedFrame[]>([]);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let mounted = true;

    async function start() {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error("Tu navegador no permite cámara.");
        }
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: "user" },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
        if (!mounted) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setStarting(false);
      } catch (e: any) {
        let msg = "No pudimos acceder a la cámara";
        if (e.name === "NotAllowedError")
          msg = "Necesitamos permiso para usar la cámara frontal.";
        else if (e.name === "NotFoundError")
          msg = "No encontramos una cámara conectada.";
        else if (e.message) msg = e.message;
        setError(msg);
        setStarting(false);
      }
    }
    start();

    return () => {
      mounted = false;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, []);

  function captureFrame(challenge: LivenessChallenge, orden: number): CapturedFrame | null {
    if (!videoRef.current || !canvasRef.current) return null;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    // Redimensionar a CAPTURE_WIDTH manteniendo proporción
    const scale = CAPTURE_WIDTH / video.videoWidth;
    canvas.width = CAPTURE_WIDTH;
    canvas.height = Math.round(video.videoHeight * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    const imageBase64 = dataUrl.replace(/^data:image\/\w+;base64,/, "");

    return {
      challengeId: challenge.id,
      accion: challenge.accion,
      imageBase64,
      ordenFrame: orden,
    };
  }

  async function startCurrentChallenge() {
    setPhase("capturing");
    const challenge = challenges[currentIndex];

    // Cuenta regresiva 3, 2, 1
    for (let n = 3; n > 0; n--) {
      setCountdown(n);
      await sleep(700);
    }
    setCountdown(0);

    // Capturar 3 frames con 600ms entre uno y otro
    const newFrames: CapturedFrame[] = [];
    for (let i = 0; i < FRAMES_PER_CHALLENGE; i++) {
      const f = captureFrame(challenge, i);
      if (f) newFrames.push(f);
      if (i < FRAMES_PER_CHALLENGE - 1) await sleep(600);
    }
    setFramesCaptured((prev) => [...prev, ...newFrames]);

    // Pasar al siguiente challenge o terminar
    if (currentIndex < challenges.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setPhase("ready");
    } else {
      // Capturar selfie principal HD para face-match contra DNI
      finalizeAndComplete([...framesCaptured, ...newFrames]);
    }
  }

  async function finalizeAndComplete(allFrames: CapturedFrame[]) {
    setPhase("done");
    if (!videoRef.current || !canvasRef.current) return;

    // Snapshot HD para face-match (mismo aspecto que la cámara, max 1600px)
    const video = videoRef.current;
    const TARGET_HD = 1600;
    const longSide = Math.max(video.videoWidth, video.videoHeight);
    const scale = longSide > TARGET_HD ? TARGET_HD / longSide : 1;
    const w = Math.round(video.videoWidth * scale);
    const h = Math.round(video.videoHeight * scale);

    const canvas = canvasRef.current;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, w, h);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setError("No pudimos generar el archivo final");
          return;
        }
        onComplete({ mainSelfie: blob, frames: allFrames });
      },
      "image/jpeg",
      0.92,
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-6 text-center space-y-4">
        <p className="text-red-400 text-sm max-w-sm">{error}</p>
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-xl border border-white/15 text-white/80 hover:border-white/30 text-sm"
        >
          Cerrar
        </button>
      </div>
    );
  }

  const challenge = challenges[currentIndex];
  const progress = `${currentIndex + 1} / ${challenges.length}`;

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div>
          <h2 className="text-white font-medium">Verificación de identidad</h2>
          <p className="text-xs text-white/50">Desafío {progress}</p>
        </div>
        <button
          onClick={onClose}
          className="text-white/60 hover:text-white p-2 rounded-lg"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Video viewport */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
        <div className="relative w-full max-w-md aspect-[3/4]">
          <video
            ref={videoRef}
            playsInline
            muted
            className="w-full h-full object-cover rounded-3xl bg-black scale-x-[-1]"
          />
          {starting && (
            <div className="absolute inset-0 flex items-center justify-center text-white/70 text-sm rounded-3xl">
              Iniciando cámara…
            </div>
          )}
          {!starting && (
            <>
              {/* Marco facial guía */}
              <div className="pointer-events-none absolute inset-x-12 top-12 bottom-20 border-2 border-blue-400/50 rounded-full" />
              {/* Countdown */}
              {countdown > 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white text-8xl font-bold drop-shadow-2xl">
                    {countdown}
                  </div>
                </div>
              )}
              {phase === "done" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-3xl">
                  <Loader2 className="w-10 h-10 text-white animate-spin" />
                </div>
              )}
            </>
          )}
        </div>
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Instrucción */}
      {!starting && phase !== "done" && challenge && (
        <div className="p-6 text-center space-y-4 bg-black/40">
          <p className="text-white text-lg font-medium">
            {challenge.instruccion}
          </p>

          {phase === "ready" && (
            <button
              onClick={startCurrentChallenge}
              className="w-full max-w-xs mx-auto block px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold"
            >
              Estoy listo
            </button>
          )}

          {phase === "capturing" && countdown === 0 && (
            <p className="text-white/60 text-sm">Capturando…</p>
          )}
        </div>
      )}

      {/* Progreso */}
      {!starting && (
        <div className="px-6 pb-6 flex gap-2">
          {challenges.map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-1.5 rounded-full ${
                i < currentIndex
                  ? "bg-green-500"
                  : i === currentIndex && phase === "capturing"
                  ? "bg-blue-500 animate-pulse"
                  : "bg-white/15"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
