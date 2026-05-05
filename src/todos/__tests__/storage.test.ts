import assert from "node:assert/strict";
import test from "node:test";

import { getTodoStorageType } from "../storage";

test("getTodoStorageType returns firebase only for firebase value", () => {
  assert.equal(getTodoStorageType("firebase"), "firebase");
});

test("getTodoStorageType keeps localStorage when value is localStorage", () => {
  assert.equal(getTodoStorageType("localStorage"), "localStorage");
});

test("getTodoStorageType auto-selects firebase when firebase env exists", () => {
  const originalEnv = process.env;
  process.env = {
    ...originalEnv,
    NEXT_PUBLIC_FIREBASE_API_KEY: "api-key",
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: "auth-domain",
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: "project-id",
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: "storage-bucket",
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: "sender-id",
    NEXT_PUBLIC_FIREBASE_APP_ID: "app-id",
  };

  try {
    assert.equal(getTodoStorageType(undefined), "firebase");
    assert.equal(getTodoStorageType("unknown"), "firebase");
  } finally {
    process.env = originalEnv;
  }
});

test("getTodoStorageType falls back to localStorage without firebase env", () => {
  const originalEnv = process.env;
  process.env = {
    ...originalEnv,
    NEXT_PUBLIC_FIREBASE_API_KEY: "",
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: "",
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: "",
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: "",
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: "",
    NEXT_PUBLIC_FIREBASE_APP_ID: "",
  };

  try {
  assert.equal(getTodoStorageType("unknown"), "localStorage");
  assert.equal(getTodoStorageType(undefined), "localStorage");
  } finally {
    process.env = originalEnv;
  }
});
