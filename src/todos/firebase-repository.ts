import type { TodoRepository } from "./repository";

export const createFirebaseTodoRepository = (): TodoRepository => ({
  getAll: async () => {
    throw new Error("Firebase repository is not configured yet.");
  },
  saveAll: async () => {
    throw new Error("Firebase repository is not configured yet.");
  },
});

