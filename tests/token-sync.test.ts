import { describe, expect, it } from "vitest";
import { readOfferStarToken, tokenFromStorageEvent } from "../src/shared/token-sync";

describe("官网登录状态同步", () => {
  it("只提取 SECRET_TOKEN 且去除首尾空格", () => {
    expect(tokenFromStorageEvent({ key: "SECRET_TOKEN", newValue: "  token-1  " } as StorageEvent)).toBe("token-1");
    expect(tokenFromStorageEvent({ key: "OTHER_TOKEN", newValue: "token-2" } as StorageEvent)).toBeNull();
    expect(tokenFromStorageEvent({ key: "SECRET_TOKEN", newValue: "   " } as StorageEvent)).toBeNull();
  });

  it("同一页面轮询时读取当前 SECRET_TOKEN，并把空值视为退出登录", () => {
    const storage = { getItem: (key: string) => key === "SECRET_TOKEN" ? "  token-3  " : null } as Storage;
    expect(readOfferStarToken(storage)).toBe("token-3");
    expect(readOfferStarToken({ getItem: () => "   " } as Storage)).toBeNull();
  });
});
