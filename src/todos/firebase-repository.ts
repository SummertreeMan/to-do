import { initializeApp, type FirebaseOptions, getApps } from "firebase/app";
import { getAuth, signInAnonymously, type Auth } from "firebase/auth";
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
import { getUserTodosPathSegments } from "./firebase-path";
import type { Todo } from "./types";

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
let auth: Auth | null = null;

const getClientFirestore = (): Firestore => {
  if (firestore !== null) {
    return firestore;
  }

  const app = getApps()[0] ?? initializeApp(firebaseConfigFromEnv());
  firestore = getFirestore(app);

  return firestore;
};

const getClientAuth = (): Auth => {
  if (auth !== null) {
    return auth;
  }

  const app = getApps()[0] ?? initializeApp(firebaseConfigFromEnv());
  auth = getAuth(app);

  return auth;
};

const ensureAnonymousUser = async (): Promise<string> => {
  const clientAuth = getClientAuth();

  if (clientAuth.currentUser?.uid !== undefined) {
    return clientAuth.currentUser.uid;
  }

  try {
    const credential = await signInAnonymously(clientAuth);
    return credential.user.uid;
  } catch (error: unknown) {
    const firebaseErrorCode =
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      typeof (error as { code?: unknown }).code === "string"
        ? (error as { code: string }).code
        : "unknown";

    throw new Error(
      `익명 로그인에 실패했습니다. Firebase Console > Authentication에서 Anonymous 제공업체를 활성화하세요. (code: ${firebaseErrorCode})`,
    );
  }
};

const getUserTodosCollection = (db: Firestore, uid: string) => collection(db, ...getUserTodosPathSegments(uid));

export const createFirebaseTodoRepository = (): TodoRepository => ({
  getAll: async () => {
    const db = getClientFirestore();
    const uid = await ensureAnonymousUser();
    const todosQuery = query(getUserTodosCollection(db, uid), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(todosQuery);

    return snapshot.docs
      .map((item) => item.data())
      .filter(isTodo);
  },
  saveAll: async (todos) => {
    const db = getClientFirestore();
    const uid = await ensureAnonymousUser();
    const todoCollection = getUserTodosCollection(db, uid);
    const currentSnapshot = await getDocs(todoCollection);
    const nextTodoIds = new Set(todos.map((todo) => todo.id));
    const batch = writeBatch(db);

    currentSnapshot.docs.forEach((item) => {
      if (!nextTodoIds.has(item.id)) {
        batch.delete(item.ref);
      }
    });

    todos.forEach((todo) => {
      const todoRef = doc(db, ...getUserTodosPathSegments(uid), todo.id);
      batch.set(todoRef, todo);
    });

    await batch.commit();
  },
});

