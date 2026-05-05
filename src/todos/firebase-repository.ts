import { initializeApp, type FirebaseOptions, getApps } from "firebase/app";
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  writeBatch,
  orderBy,
  type Firestore,
} from "firebase/firestore";

import type { TodoRepository } from "./repository";
import type { Todo } from "./types";

const TODO_COLLECTION = "todos";

type FirebaseEnv = Readonly<{
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}>;

const getFirebaseEnv = (): FirebaseEnv => ({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
});

const hasRequiredFirebaseEnv = (env: FirebaseEnv): boolean =>
  Object.values(env).every((value) => value.trim().length > 0);

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

const firebaseConfigFromEnv = (): FirebaseOptions => {
  const env = getFirebaseEnv();

  if (!hasRequiredFirebaseEnv(env)) {
    throw new Error(
      "Firebase 환경변수가 누락되었습니다. README의 NEXT_PUBLIC_FIREBASE_* 설정을 확인하세요.",
    );
  }

  return {
    apiKey: env.apiKey,
    authDomain: env.authDomain,
    projectId: env.projectId,
    storageBucket: env.storageBucket,
    messagingSenderId: env.messagingSenderId,
    appId: env.appId,
  };
};

let firestore: Firestore | null = null;

const getClientFirestore = (): Firestore => {
  if (firestore !== null) {
    return firestore;
  }

  const app = getApps()[0] ?? initializeApp(firebaseConfigFromEnv());
  firestore = getFirestore(app);

  return firestore;
};

export const createFirebaseTodoRepository = (): TodoRepository => ({
  getAll: async () => {
    const db = getClientFirestore();
    const todosQuery = query(collection(db, TODO_COLLECTION), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(todosQuery);

    return snapshot.docs
      .map((item) => item.data())
      .filter(isTodo);
  },
  saveAll: async (todos) => {
    const db = getClientFirestore();
    const todoCollection = collection(db, TODO_COLLECTION);
    const currentSnapshot = await getDocs(todoCollection);
    const nextTodoIds = new Set(todos.map((todo) => todo.id));
    const batch = writeBatch(db);

    currentSnapshot.docs.forEach((item) => {
      if (!nextTodoIds.has(item.id)) {
        batch.delete(item.ref);
      }
    });

    todos.forEach((todo) => {
      const todoRef = doc(db, TODO_COLLECTION, todo.id);
      batch.set(todoRef, todo);
    });

    await batch.commit();
  },
});

