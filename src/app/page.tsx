"use client";

import { type ChangeEvent, type FormEvent, useEffect, useMemo, useState } from "react";

import {
  appendTodo,
  createTodoRepository,
  createTodo,
  filterTodos,
  removeTodo,
  toggleTodo,
  type Todo,
  type TodoFilter,
} from "@/todos";
import styles from "./page.module.css";

const repository = createTodoRepository();

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<TodoFilter>("all");
  const [title, setTitle] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    void repository
      .getAll()
      .then((savedTodos) => {
        setTodos(savedTodos);
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : "할 일을 불러오지 못했습니다.";
        setLoadError(message);
      })
      .finally(() => {
        setIsLoaded(true);
      });
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    void repository.saveAll(todos).catch((error: unknown) => {
      const message = error instanceof Error ? error.message : "할 일을 저장하지 못했습니다.";
      setLoadError(message);
    });
  }, [isLoaded, todos]);

  const visibleTodos = useMemo(() => filterTodos(todos, filter), [todos, filter]);
  const activeCount = useMemo(() => todos.filter((todo) => !todo.completed).length, [todos]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newTodo = createTodo(title);
    if (newTodo === null) {
      return;
    }

    setTodos((prevTodos) => appendTodo(prevTodos, newTodo));
    setTitle("");
  };

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <header className={styles.header}>
          <h1>To-do List</h1>
          <p>개인 할 일을 빠르게 기록하고 관리하세요.</p>
        </header>

        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            className={styles.input}
            type="text"
            placeholder="할 일을 입력하세요"
            value={title}
            onChange={handleTitleChange}
            aria-label="할 일 입력"
          />
          <button className={styles.addButton} type="submit">
            추가
          </button>
        </form>

        <div className={styles.filters} role="tablist" aria-label="할 일 필터">
          {(["all", "active", "completed"] as const).map((filterItem) => (
            <button
              key={filterItem}
              type="button"
              role="tab"
              aria-selected={filter === filterItem}
              className={filter === filterItem ? styles.filterActive : styles.filter}
              onClick={() => setFilter(filterItem)}
            >
              {filterItem === "all" && "전체"}
              {filterItem === "active" && "진행중"}
              {filterItem === "completed" && "완료"}
            </button>
          ))}
        </div>

        <section className={styles.section}>
          <p className={styles.count}>남은 할 일: {activeCount}</p>
          {loadError !== null && <p className={styles.error}>{loadError}</p>}

          {!isLoaded ? (
            <p className={styles.empty}>불러오는 중...</p>
          ) : visibleTodos.length === 0 ? (
            <p className={styles.empty}>표시할 할 일이 없습니다.</p>
          ) : (
            <ul className={styles.list}>
              {visibleTodos.map((todo) => (
                <li key={todo.id} className={styles.item}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => setTodos((prevTodos) => toggleTodo(prevTodos, todo.id))}
                      aria-label={`${todo.title} 완료 토글`}
                    />
                    <span className={todo.completed ? styles.completed : styles.todoTitle}>{todo.title}</span>
                  </label>
                  <button
                    type="button"
                    className={styles.deleteButton}
                    onClick={() => setTodos((prevTodos) => removeTodo(prevTodos, todo.id))}
                    aria-label={`${todo.title} 삭제`}
                  >
                    삭제
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
