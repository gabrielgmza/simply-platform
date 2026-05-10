"use client";

import { useRef, useState } from "react";
import { Camera, Upload, CheckCircle2, AlertCircle, Loader2, RotateCcw } from "lucide-react";
import { Button } from "@simply/ui";

const MAX_SIZE_MB = 8;
const TARGET_LONG_SIDE = 1600; // pixels — comprimimos antes de subir

export interface DniExtractedData {
  numero?: string;
  apellido?: string;
  nombre?: string;
  fechaNacimiento?: string;
  sexo?: string;
  fechaVencimiento?: string;
  [key: string]: any;
}

export interface DniSideUploadResult {
  ok: boolean;
  side: "front" | "back";
  extracted: DniExtractedData;
  warnings?: string[];
  crossCheck: { ok: boolean; message: string };
}

interface Props {
  side: "front" | "back";
  title: string;
  hint: string;
  onUploaded: (result: DniSideUploadResult) => void;
  customerId: string;
}

export default function DocSideUploader({ side, title, hint, onUploaded, customerId }: Props) {
  const cameraRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DniSideUploadResult | null>(null);

  async function handleFile(file: File) {
    setError(null);
    setResult(null);

    // Validar tipo
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("El archivo debe ser JPG, PNG o WEBP");
      return;
    }

    // Comprimir y redimensionar
    let processed: { dataUrl: string; mimeType: string };
    try {
      processed = await compressImage(file);
    } catch (e: any) {
      setError(e.message || "No pudimos procesar la imagen");
      return;
    }

    setPreview(processed.dataUrl);
    setLoading(true);

    try {
      const base64 = processed.dataUrl.replace(/^data:image\/\w+;base64,/, "");
      const res = await fetch("/api/auth/upload-dni", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId,
          side,
          imageBase64: base64,
          mimeType: processed.mimeType,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error procesando documento");
      setResult(data);
      onUploaded(data);
    } catch (e: any) {
      setError(e.message);
      setPreview(null);
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setPreview(null);
    setResult(null);
    setError(null);
    if (cameraRef.current) cameraRef.current.value = "";
    if (fileRef.current) fileRef.current.value = "";
  }

  // ─── Render ───

  const successUI = result && result.ok && result.crossCheck.ok;
  const warningUI = result && (!result.ok || !result.crossCheck.ok);

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950/80 p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-0.5">
          <h3 className="text-sm font-medium text-white">{title}</h3>
          <p className="text-xs text-white/50">{hint}</p>
        </div>
        {successUI && (
          <span className="inline-flex items-center gap-1 text-xs text-green-400">
            <CheckCircle2 className="w-4 h-4" /> OK
          </span>
        )}
        {warningUI && (
          <span className="inline-flex items-center gap-1 text-xs text-amber-400">
            <AlertCircle className="w-4 h-4" /> Revisar
          </span>
        )}
      </div>

      {/* Preview */}
      <div className="aspect-[16/10] w-full rounded-xl border border-white/10 bg-black/40 overflow-hidden flex items-center justify-center relative">
        {preview ? (
          <>
            <img src={preview} alt={title} className="object-contain w-full h-full" />
            {loading && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white/80 gap-2 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" /> Procesando...
              </div>
            )}
          </>
        ) : (
          <p className="text-xs text-white/30">Sin foto</p>
        )}
      </div>

      {/* Datos extraídos */}
      {result && !loading && (
        <div className="rounded-xl bg-black/40 border border-white/5 p-3 text-xs space-y-1">
          {result.extracted.numero && (
            <div className="flex justify-between">
              <span className="text-white/50">N° doc</span>
              <span className="font-mono">{result.extracted.numero}</span>
            </div>
          )}
          {(result.extracted.apellido || result.extracted.nombre) && (
            <div className="flex justify-between">
              <span className="text-white/50">Nombre</span>
              <span>{[result.extracted.nombre, result.extracted.apellido].filter(Boolean).join(" ")}</span>
            </div>
          )}
          {result.extracted.fechaNacimiento && (
            <div className="flex justify-between">
              <span className="text-white/50">Nacimiento</span>
              <span>{result.extracted.fechaNacimiento}</span>
            </div>
          )}
          {result.extracted.sexo && (
            <div className="flex justify-between">
              <span className="text-white/50">Sexo</span>
              <span>{result.extracted.sexo}</span>
            </div>
          )}
          {!result.crossCheck.ok && (
            <div className="text-amber-300/90 pt-1 border-t border-white/5 mt-2">
              ⚠️ {result.crossCheck.message}
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-2">
          {error}
        </div>
      )}

      {/* Inputs ocultos */}
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />

      {/* Botones */}
      {!result || warningUI ? (
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => cameraRef.current?.click()}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600/90 hover:bg-blue-500 disabled:opacity-40 transition text-sm font-medium"
          >
            <Camera className="w-4 h-4" /> Cámara
          </button>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/15 hover:border-white/30 disabled:opacity-40 transition text-sm"
          >
            <Upload className="w-4 h-4" /> Archivo
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={reset}
          className="w-full inline-flex items-center justify-center gap-2 py-2 rounded-xl border border-white/10 hover:border-white/30 text-xs text-white/60 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Volver a tomar
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Compresión y normalización de la imagen antes de subir
// ─────────────────────────────────────────────────────────────

async function compressImage(file: File): Promise<{ dataUrl: string; mimeType: string }> {
  if (file.size > MAX_SIZE_MB * 1024 * 1024 * 2) {
    throw new Error(`La imagen pesa más de ${MAX_SIZE_MB * 2}MB. Sacá una nueva foto con menos calidad.`);
  }

  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("No pudimos leer la imagen"));
    reader.readAsDataURL(file);
  });

  // Cargar imagen y redimensionar con canvas
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = () => reject(new Error("Imagen inválida"));
    i.src = dataUrl;
  });

  const longSide = Math.max(img.width, img.height);
  const scale = longSide > TARGET_LONG_SIDE ? TARGET_LONG_SIDE / longSide : 1;
  const w = Math.round(img.width * scale);
  const h = Math.round(img.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Tu navegador no soporta canvas");
  ctx.drawImage(img, 0, 0, w, h);

  // Salimos en JPEG con calidad 0.85 (balance entre tamaño y OCR)
  const compressed = canvas.toDataURL("image/jpeg", 0.85);
  return { dataUrl: compressed, mimeType: "image/jpeg" };
}
