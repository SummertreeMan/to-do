import assert from "node:assert/strict";
import test from "node:test";

import { filterTodos } from "../filters";
import type { Todo } from "../types";

const sampleTodos: Todo[] = [
  { id: "1", title: "Read PRD", completed: false, createdAt: 1 },
  { id: "2", title: "Build MVP", completed: true, createdAt: 2 },
];

test("filterTodos returns all todos", () => {
  assert.deepEqual(filterTodos(sampleTodos, "all"), sampleTodos);
});

test("filterTodos returns only active todos", () => {
  assert.deepEqual(filterTodos(sampleTodos, "active"), [sampleTodos[0]]);
});

test("filterTodos returns only completed todos", () => {
  assert.deepEqual(filterTodos(sampleTodos, "completed"), [sampleTodos[1]]);
});

