import { createFirebaseTodoRepository } from "./firebase-repository";
import { createLocalStorageTodoRepository } from "./local-storage-repository";
import type { TodoRepository, TodoStorageType } from "./repository";

const FALLBACK_STORAGE: TodoStorageType = "localStorage";
const FIREBASE_ENV_KEYS = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
] as const;

const hasFirebaseEnvironment = (
  env: Readonly<Partial<Record<(typeof FIREBASE_ENV_KEYS)[number], string>>>,
): boolean => FIREBASE_ENV_KEYS.every((key) => (env[key] ?? "").trim().length > 0);

const getFirebaseEnvironment = (): Readonly<Partial<Record<(typeof FIREBASE_ENV_KEYS)[number], string>>> => ({
  NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
});

const normalizeStorageType = (value: string | undefined): TodoStorageType => {
  if (value === "firebase") {
    return "firebase";
  }

  if (value === "localStorage") {
    return "localStorage";
  }

  return hasFirebaseEnvironment(getFirebaseEnvironment()) ? "firebase" : FALLBACK_STORAGE;
};

export const getTodoStorageType = (
  value: string | undefined = process.env.NEXT_PUBLIC_TODO_STORAGE,
): TodoStorageType => normalizeStorageType(value);

export const createTodoRepository = (): TodoRepository =>
  getTodoStorageType() === "firebase"
    ? createFirebaseTodoRepository()
    : createLocalStorageTodoRepository();
