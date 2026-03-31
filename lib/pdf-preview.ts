/* eslint-disable @typescript-eslint/no-explicit-any */
export async function renderPdfFirstPage(file: File): Promise<string> {
  const mod = await import("pdfjs-dist/legacy/build/pdf.js" as any);
  const pdfjsLib = (mod as any).default ?? mod;

  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
  const pdf = await loadingTask.promise;

  const page = await pdf.getPage(1);
  const scale = 1.5;
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement("canvas");
  canvas.width = viewport.width;
  canvas.height = viewport.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2d context unavailable");

  await page.render({ canvasContext: ctx, viewport }).promise;
  return canvas.toDataURL("image/png");
}
