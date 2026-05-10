"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, X, RotateCcw, Check } from "lucide-react";

interface Props {
  /** Callback cuando se confirma la foto (data URL JPEG) */
  onCapture: (dataUrl: string) => void;
  /** Callback al cerrar sin capturar */
  onClose: () => void;
  /** 'environment' = trasera (recomendado para DNI), 'user' = frontal (para selfie) */
  facingMode?: "environment" | "user";
}

/**
 * Modal de cámara en vivo. Solo se monta cuando el usuario decide tomar foto.
 * Funciona en desktop con webcam y en móvil pidiendo permisos.
 */
export default function CameraCapture({ onCapture, onClose, facingMode = "environment" }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [starting, setStarting] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function start() {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error("Tu navegador no permite cámara. Usá 'Archivo' en su lugar.");
        }
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: facingMode },
            width: { ideal: 1920 },
            height: { ideal: 1080 },
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
        if (e.name === "NotAllowedError") msg = "Necesitamos permiso para usar la cámara. Revisá los permisos del navegador.";
        else if (e.name === "NotFoundError") msg = "No encontramos una cámara conectada.";
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
  }, [facingMode]);

  function handleShoot() {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
    setPreviewUrl(dataUrl);
  }

  function handleConfirm() {
    if (previewUrl) onCapture(previewUrl);
  }

  function handleRetry() {
    setPreviewUrl(null);
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <h2 className="text-white font-medium flex items-center gap-2">
          <Camera className="w-5 h-5" /> Tomar foto
        </h2>
        <button
          onClick={onClose}
          className="text-white/60 hover:text-white p-2 rounded-lg"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Viewport */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
        {error ? (
          <div className="text-center max-w-sm space-y-3">
            <p className="text-red-400 text-sm">{error}</p>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-white/15 text-white/80 hover:border-white/30 text-sm"
            >
              Cerrar y subir archivo
            </button>
          </div>
        ) : previewUrl ? (
          <img
            src={previewUrl}
            alt="Captura"
            className="max-w-full max-h-full object-contain rounded-xl"
          />
        ) : (
          <div className="relative w-full max-w-3xl aspect-video">
            <video
              ref={videoRef}
              playsInline
              muted
              className="w-full h-full object-contain rounded-xl bg-black"
            />
            {starting && (
              <div className="absolute inset-0 flex items-center justify-center text-white/70 text-sm">
                Iniciando cámara…
              </div>
            )}
            {/* Marco guía */}
            {!starting && (
              <div className="pointer-events-none absolute inset-x-8 inset-y-12 border-2 border-blue-400/60 rounded-2xl" />
            )}
          </div>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Controles */}
      <div className="p-6 pb-10">
        {!error && (
          <div className="flex items-center justify-center gap-4">
            {previewUrl ? (
              <>
                <button
                  onClick={handleRetry}
                  className="px-5 py-3 rounded-xl border border-white/15 hover:border-white/40 text-white/80 inline-flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" /> Repetir
                </button>
                <button
                  onClick={handleConfirm}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold inline-flex items-center gap-2"
                >
                  <Check className="w-5 h-5" /> Usar esta foto
                </button>
              </>
            ) : (
              <button
                onClick={handleShoot}
                disabled={starting}
                className="w-20 h-20 rounded-full bg-white hover:bg-white/90 disabled:opacity-40 transition shadow-2xl ring-4 ring-white/20"
                aria-label="Disparar"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
