import assert from "node:assert/strict";
import test from "node:test";

import { getUserTodosPathSegments } from "../firebase-path";

test("getUserTodosPathSegments returns user-scoped todos path", () => {
  assert.deepEqual(getUserTodosPathSegments("user-123"), ["users", "user-123", "todos"]);
});
