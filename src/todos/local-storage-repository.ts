import type { TodoRepository } from "./repository";
import type { Todo } from "./types";

const STORAGE_KEY = "todos:v1";

const isTodo = (value: unknown): value is Todo => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Partial<Todo>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.title === "string" &&
    typeof candidate.completed === "boolean" &&
    typeof candidate.createdAt === "number"
  );
};

const parseTodos = (value: string | null): Todo[] => {
  if (value === null) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter(isTodo) : [];
  } catch {
    return [];
  }
};

export const createLocalStorageTodoRepository = (): TodoRepository => ({
  getAll: async () => {
    if (typeof window === "undefined") {
      return [];
    }

    return parseTodos(window.localStorage.getItem(STORAGE_KEY));
  },
  saveAll: async (todos) => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  },
});

