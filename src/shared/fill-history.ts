export type FillSnapshot<T> = { target: T; value: string };

/** 保存一次填写前的值，保证撤销只恢复最近一次批量填写。 */
export function createFillHistory<T>() {
  let snapshots: FillSnapshot<T>[] = [];
  return {
    reset() { snapshots = []; },
    add(snapshot: FillSnapshot<T>) { snapshots.push(snapshot); },
    consume() {
      const result = snapshots;
      snapshots = [];
      return result;
    }
  };
}
