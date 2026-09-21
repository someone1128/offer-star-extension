import { describe, expect, it } from "vitest";
import { describeAttachment, removeAttachmentAt } from "../src/shared/attachment-preview";

describe("附件预览", () => {
  const photo = { dataUrl: "data:image/png;base64,AA==", fileName: "证件照.png", mimeType: "image/png" };
  const pdf = { dataUrl: "data:application/pdf;base64,AA==", fileName: "简历.pdf", mimeType: "application/pdf" };

  it("根据 MIME 类型显示照片和 PDF 标识", () => {
    expect(describeAttachment(photo)).toEqual({ kind: "照片", icon: "▧" });
    expect(describeAttachment(pdf)).toEqual({ kind: "PDF", icon: "PDF" });
  });

  it("可以逐个移除附件且不会修改原数组", () => {
    const files = [photo, pdf];
    expect(removeAttachmentAt(files, 0)).toEqual([pdf]);
    expect(files).toHaveLength(2);
  });

  it("索引越界时不会误删附件", () => {
    const files = [photo, pdf];
    expect(removeAttachmentAt(files, 9)).toBe(files);
  });
});
