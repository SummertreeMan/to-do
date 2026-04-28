import type { Todo, TodoFilter } from "./types";

export const filterTodos = (todos: ReadonlyArray<Todo>, filter: TodoFilter): Todo[] => {
  const predicates: Record<TodoFilter, (todo: Todo) => boolean> = {
    all: () => true,
    active: (todo) => !todo.completed,
    completed: (todo) => todo.completed,
  };

  return todos.filter(predicates[filter]);
};

