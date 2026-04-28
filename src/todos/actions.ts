import { nanoid } from "nanoid";

import type { Todo } from "./types";

const normalizeTitle = (title: string): string => title.trim();

export const createTodo = (title: string, now: number = Date.now()): Todo | null => {
  const normalizedTitle = normalizeTitle(title);

  if (normalizedTitle.length === 0) {
    return null;
  }

  return {
    id: nanoid(),
    title: normalizedTitle,
    completed: false,
    createdAt: now,
  };
};

export const appendTodo = (todos: ReadonlyArray<Todo>, todo: Todo): Todo[] => [todo, ...todos];

export const toggleTodo = (todos: ReadonlyArray<Todo>, targetId: string): Todo[] =>
  todos.map((todo) => (todo.id === targetId ? { ...todo, completed: !todo.completed } : todo));

export const removeTodo = (todos: ReadonlyArray<Todo>, targetId: string): Todo[] =>
  todos.filter((todo) => todo.id !== targetId);

