import type { Todo } from "./types";

export type TodoRepository = {
  getAll: () => Promise<Todo[]>;
  saveAll: (todos: ReadonlyArray<Todo>) => Promise<void>;
};

export type TodoStorageType = "localStorage" | "firebase";

