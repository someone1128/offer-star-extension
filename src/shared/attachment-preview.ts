import type { FilePayload } from "./messages";

/** 根据附件类型生成面板展示信息，不读取或输出附件正文。 */
export function describeAttachment(file: FilePayload) {
  if (file.mimeType.startsWith("image/")) return { kind: "照片", icon: "▧" };
  if (file.mimeType === "application/pdf" || /\.pdf$/i.test(file.fileName)) return { kind: "PDF", icon: "PDF" };
  if (/wordprocessingml|msword/i.test(file.mimeType) || /\.docx?$/i.test(file.fileName)) return { kind: "Word", icon: "W" };
  return { kind: "附件", icon: "＋" };
}

/** 删除指定附件；索引越界时保持原列表，避免误删其他文件。 */
export function removeAttachmentAt(files: FilePayload[], index: number) {
  if (!Number.isInteger(index) || index < 0 || index >= files.length) return files;
  return files.filter((_, currentIndex) => currentIndex !== index);
}
