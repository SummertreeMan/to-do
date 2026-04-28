import assert from "node:assert/strict";
import test from "node:test";

import { appendTodo, createTodo, removeTodo, toggleTodo } from "../actions";
import type { Todo } from "../types";

const todosFixture: Todo[] = [
  { id: "a", title: "A", completed: false, createdAt: 1 },
  { id: "b", title: "B", completed: true, createdAt: 2 },
];

test("createTodo returns null when title is blank", () => {
  assert.equal(createTodo("   "), null);
});

test("createTodo trims title and creates todo", () => {
  const todo = createTodo("  first  ", 123);

  assert.notEqual(todo, null);
  assert.equal(todo?.title, "first");
  assert.equal(todo?.completed, false);
  assert.equal(todo?.createdAt, 123);
  assert.equal(typeof todo?.id, "string");
});

test("appendTodo prepends todo", () => {
  const newTodo: Todo = { id: "new", title: "N", completed: false, createdAt: 3 };
  const result = appendTodo(todosFixture, newTodo);

  assert.equal(result[0].id, "new");
  assert.equal(result.length, 3);
});

test("toggleTodo toggles matching todo only", () => {
  const result = toggleTodo(todosFixture, "a");

  assert.equal(result[0].completed, true);
  assert.equal(result[1].completed, true);
});

test("removeTodo removes matching todo", () => {
  const result = removeTodo(todosFixture, "a");

  assert.deepEqual(result, [todosFixture[1]]);
});

