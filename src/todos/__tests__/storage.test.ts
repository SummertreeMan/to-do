import assert from "node:assert/strict";
import test from "node:test";

import { getTodoStorageType } from "../storage";

test("getTodoStorageType returns firebase only for firebase value", () => {
  assert.equal(getTodoStorageType("firebase"), "firebase");
});

test("getTodoStorageType falls back to localStorage for unknown value", () => {
  assert.equal(getTodoStorageType("unknown"), "localStorage");
  assert.equal(getTodoStorageType(undefined), "localStorage");
});
