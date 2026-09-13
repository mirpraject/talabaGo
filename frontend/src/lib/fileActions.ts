import { downloadBlob } from "./api";

export async function downloadFile(path: string, filename: string) {
  const blob = await downloadBlob(path);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export async function openFileInNewTab(path: string) {
  const blob = await downloadBlob(path);
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
}