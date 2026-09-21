import { describe, expect, it } from "vitest";
import { createFillHistory } from "../src/shared/fill-history";

describe("填写撤销记录", () => {
  it("只消费最近一次填写记录，重复撤销不会重复恢复", () => {
    const history = createFillHistory<{ id: string }>();
    history.add({ target: { id: "name" }, value: "原姓名" });
    history.add({ target: { id: "email" }, value: "old@example.com" });
    expect(history.consume().map((item) => item.value)).toEqual(["原姓名", "old@example.com"]);
    expect(history.consume()).toEqual([]);
  });
});
