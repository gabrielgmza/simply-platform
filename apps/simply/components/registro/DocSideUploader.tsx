"use client";

import { useRef, useState } from "react";
import {
  Camera,
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RotateCcw,
  ScanBarcode,
} from "lucide-react";
import CameraCapture from "./CameraCapture";
import { tryReadPdf417 } from "@/lib/pdf417-reader";

const MAX_PAYLOAD_BYTES = 3.5 * 1024 * 1024;
const TARGET_LONG_SIDE = 1400;
const INITIAL_QUALITY = 0.78;
const MIN_QUALITY = 0.5;
const MAX_INPUT_BYTES = 25 * 1024 * 1024;

export interface DniExtractedData {
  numero?: string;
  dni?: string;
  cuil?: string;
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

function isMobile(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export default function DocSideUploader({
  side,
  title,
  hint,
  onUploaded,
  customerId,
}: Props) {
  const cameraRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [showWebcam, setShowWebcam] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState<string>("Procesando…");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DniSideUploadResult | null>(null);
  const [usedPdf417, setUsedPdf417] = useState(false);

  function openCamera() {
    if (isMobile()) cameraRef.current?.click();
    else setShowWebcam(true);
  }

  async function handleFile(file: File) {
    setError(null);
    setResult(null);
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("El archivo debe ser JPG, PNG o WEBP");
      return;
    }
    if (file.size > MAX_INPUT_BYTES) {
      setError("La foto pesa demasiado. Sacá una nueva con menor calidad.");
      return;
    }
    await processAndUpload(await fileToDataUrl(file));
  }

  async function handleWebcamCapture(dataUrl: string) {
    setShowWebcam(false);
    setError(null);
    setResult(null);
    await processAndUpload(dataUrl);
  }

  async function processAndUpload(rawDataUrl: string) {
    setUsedPdf417(false);

    // 1. Intentar PDF417 (especialmente útil en el dorso)
    let pdf417Text: string | null = null;
    if (side === "back") {
      setPreview(rawDataUrl);
      setLoading(true);
      setLoadingMsg("Buscando código de barras…");
      try {
        pdf417Text = await tryReadPdf417(rawDataUrl);
        if (pdf417Text) {
          setUsedPdf417(true);
        }
      } catch {
        // ignoramos, seguimos con OCR
      }
    }

    // 2. Comprimir + enhance para enviar al backend
    let processed: { dataUrl: string };
    try {
      processed = await compressAndEnhance(rawDataUrl);
    } catch (e: any) {
      setError(e.message || "No pudimos procesar la imagen");
      setLoading(false);
      setPreview(null);
      return;
    }

    setPreview(processed.dataUrl);
    setLoading(true);
    setLoadingMsg(pdf417Text ? "Verificando código de barras…" : "Leyendo documento…");

    try {
      const base64 = processed.dataUrl.replace(/^data:image\/\w+;base64,/, "");
      const res = await fetch("/api/auth/upload-dni", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId,
          side,
          imageBase64: base64,
          mimeType: "image/jpeg",
          pdf417: pdf417Text || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 413) {
          throw new Error(
            "Foto demasiado pesada. Probá con la cámara o una imagen más liviana.",
          );
        }
        throw new Error(data.message || "Error procesando documento");
      }

      const num = data.extracted?.numero || data.extracted?.dni;
      if (!num) {
        setError(
          "No pudimos leer el documento. Asegurate de que esté nítido, bien iluminado y completo en cuadro.",
        );
        setPreview(null);
        return;
      }

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
    setUsedPdf417(false);
    if (cameraRef.current) cameraRef.current.value = "";
    if (fileRef.current) fileRef.current.value = "";
  }

  const successUI = result && result.ok && result.crossCheck.ok;
  const warningUI = result && (!result.ok || !result.crossCheck.ok);

  return (
    <>
      <div className="rounded-2xl border border-white/10 bg-zinc-950/80 p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-0.5">
            <h3 className="text-sm font-medium text-white">{title}</h3>
            <p className="text-xs text-white/50">{hint}</p>
          </div>
          {successUI && (
            <span className="inline-flex items-center gap-1 text-xs text-green-400">
              <CheckCircle2 className="w-4 h-4" /> OK
              {usedPdf417 && (
                <span className="inline-flex items-center gap-0.5 text-blue-300 ml-1">
                  <ScanBarcode className="w-3.5 h-3.5" />
                </span>
              )}
            </span>
          )}
          {warningUI && (
            <span className="inline-flex items-center gap-1 text-xs text-amber-400">
              <AlertCircle className="w-4 h-4" /> Revisar
            </span>
          )}
        </div>

        <div className="aspect-[16/10] w-full rounded-xl border border-white/10 bg-black/40 overflow-hidden flex items-center justify-center relative">
          {preview ? (
            <>
              <img src={preview} alt={title} className="object-contain w-full h-full" />
              {loading && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white/80 gap-2 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" /> {loadingMsg}
                </div>
              )}
            </>
          ) : (
            <p className="text-xs text-white/30">Sin foto</p>
          )}
        </div>

        {result && !loading && (
          <div className="rounded-xl bg-black/40 border border-white/5 p-3 text-xs space-y-1">
            {usedPdf417 && (
              <div className="flex items-center gap-1 text-blue-300 pb-1 border-b border-white/5 mb-1.5">
                <ScanBarcode className="w-3.5 h-3.5" />
                <span>Datos leídos del código de barras</span>
              </div>
            )}
            {(result.extracted.numero || result.extracted.dni) && (
              <div className="flex justify-between">
                <span className="text-white/50">N° doc</span>
                <span className="font-mono">
                  {result.extracted.numero || result.extracted.dni}
                </span>
              </div>
            )}
            {(result.extracted.apellido || result.extracted.nombre) && (
              <div className="flex justify-between">
                <span className="text-white/50">Nombre</span>
                <span>
                  {[result.extracted.nombre, result.extracted.apellido]
                    .filter(Boolean)
                    .join(" ")}
                </span>
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
            {result.extracted.cuil && (
              <div className="flex justify-between">
                <span className="text-white/50">CUIL</span>
                <span className="font-mono">{result.extracted.cuil}</span>
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

        {!result || warningUI ? (
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={openCamera}
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

      {showWebcam && (
        <CameraCapture
          facingMode="environment"
          onClose={() => setShowWebcam(false)}
          onCapture={handleWebcamCapture}
        />
      )}
    </>
  );
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = () => reject(new Error("No pudimos leer la imagen"));
    r.readAsDataURL(file);
  });
}

async function compressAndEnhance(dataUrl: string): Promise<{ dataUrl: string }> {
  const img = await loadImage(dataUrl);

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

  try {
    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;
    const contrast = 1.15;
    const intercept = 128 * (1 - contrast);
    for (let i = 0; i < data.length; i += 4) {
      data[i] = clamp255(data[i] * contrast + intercept);
      data[i + 1] = clamp255(data[i + 1] * contrast + intercept);
      data[i + 2] = clamp255(data[i + 2] * contrast + intercept);
    }
    ctx.putImageData(imgData, 0, 0);
  } catch {
    /* noop */
  }

  let quality = INITIAL_QUALITY;
  let out = canvas.toDataURL("image/jpeg", quality);
  while (estimateBase64Bytes(out) > MAX_PAYLOAD_BYTES && quality > MIN_QUALITY) {
    quality -= 0.08;
    out = canvas.toDataURL("image/jpeg", quality);
  }

  if (estimateBase64Bytes(out) > MAX_PAYLOAD_BYTES) {
    throw new Error(
      "No pudimos reducir lo suficiente la imagen. Sacá una con menor resolución.",
    );
  }

  return { dataUrl: out };
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = () => reject(new Error("Imagen inválida"));
    i.src = src;
  });
}

function clamp255(v: number): number {
  return v < 0 ? 0 : v > 255 ? 255 : v;
}

function estimateBase64Bytes(dataUrl: string): number {
  const commaIdx = dataUrl.indexOf(",");
  const b64Len = dataUrl.length - (commaIdx + 1);
  return Math.floor((b64Len * 3) / 4);
}
