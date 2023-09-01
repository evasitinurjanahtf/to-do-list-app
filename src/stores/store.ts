import { defineStore } from 'pinia';
import { createPersistedState } from 'pinia-plugin-persistedstate';
import { Todo, ExtendedTodo } from '../components/models';

// Your store definition

export const useTodoStore = defineStore('todo', {
  state: () => ({
    todoList: [] as Todo[],
    ExtendedTodo: [] as ExtendedTodo[],
  }),
  actions: {
    addTodo(todo: Todo) {
      this.todoList.push(todo);
      this.saveToLocalStorage(this.todoList);
    },
    saveToLocalStorage(todoList: Todo[]) {
      localStorage.setItem('todolist', JSON.stringify(todoList));
      this.todoList = todoList;
    },
    getFromLocalStorage() {
      const storedTodoList = localStorage.getItem('todolist');
      if (storedTodoList) {
        this.todoList = JSON.parse(storedTodoList);
      }
    },
    getExtendedTodo() {
      this.ExtendedTodo = this.todoList.map((todo: Todo) => {
        return { ...todo, edited: false };
      });
    },

    plugins: [createPersistedState()],
  },
});
