/**
 * Helper para escanear el PDF417 del DNI argentino con @zxing/browser.
 *
 * El PDF417 del dorso del DNI contiene una string con campos separados por '@':
 *   00@DNI@APELLIDO@NOMBRE@SEXO@NUMERO@EJEMPLAR@FECHA_NAC@FECHA_EMISION@CUIL...
 *
 * Acá solo lo leemos y lo enviamos crudo al backend que ya tiene Pdf417ParserService.
 *
 * Cargamos zxing dinámicamente (solo cuando se usa) para no bloar el bundle inicial.
 */

export async function tryReadPdf417(dataUrl: string): Promise<string | null> {
  try {
    // Lazy import para no penalizar el bundle inicial
    const { BrowserPDF417Reader } = await import("@zxing/browser");
    const reader = new BrowserPDF417Reader();

    // zxing necesita un HTMLImageElement
    const img = await loadImage(dataUrl);
    const result = await reader.decodeFromImageElement(img);
    const text = result.getText();
    return text || null;
  } catch (err: any) {
    // NotFoundException, ChecksumException, etc.: no es error, simplemente no encontró
    return null;
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = () => reject(new Error("Imagen inválida"));
    i.src = src;
  });
}
