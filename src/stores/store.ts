import { defineStore } from 'pinia';
import { createPersistedState } from 'pinia-plugin-persistedstate';

// Your store definition
interface Todo {
  id: string;
  name: string;
  status: boolean;
  edited: boolean;
  deadline: string;
  info: string;
}

export const useTodoStore = defineStore('todo', {
  state: () => ({
    todoList: [] as Todo[],
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

    plugins: [createPersistedState()],
  },
});
