import { createFirebaseTodoRepository } from "./firebase-repository";
import { createLocalStorageTodoRepository } from "./local-storage-repository";
import type { TodoRepository, TodoStorageType } from "./repository";

const FALLBACK_STORAGE: TodoStorageType = "localStorage";

const normalizeStorageType = (value: string | undefined): TodoStorageType =>
  value === "firebase" ? "firebase" : FALLBACK_STORAGE;

export const getTodoStorageType = (
  value: string | undefined = process.env.NEXT_PUBLIC_TODO_STORAGE,
): TodoStorageType => normalizeStorageType(value);

export const createTodoRepository = (): TodoRepository =>
  getTodoStorageType() === "firebase"
    ? createFirebaseTodoRepository()
    : createLocalStorageTodoRepository();
