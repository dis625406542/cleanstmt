/* eslint-disable @typescript-eslint/no-explicit-any */
export async function renderPdfFirstPage(file: File): Promise<string> {
  const mod = await import("pdfjs-dist/legacy/build/pdf.js" as any);
  const pdfjsLib = (mod as any).default ?? mod;

  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
  const pdf = await loadingTask.promise;

  const page = await pdf.getPage(1);
  const scale = 1.25;
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement("canvas");
  const maxDim = 1600;
  const ratio = Math.min(1, maxDim / Math.max(viewport.width, viewport.height));
  canvas.width = Math.max(1, Math.round(viewport.width * ratio));
  canvas.height = Math.max(1, Math.round(viewport.height * ratio));

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2d context unavailable");

  const renderViewport = ratio < 1 ? page.getViewport({ scale: scale * ratio }) : viewport;
  await page.render({ canvasContext: ctx, viewport: renderViewport }).promise;
  return canvas.toDataURL("image/jpeg", 0.72);
}
