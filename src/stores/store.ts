import { defineStore } from 'pinia';
import { createPersistedState } from 'pinia-plugin-persistedstate';
import { Todo, Todone } from '../components/models';

// Your store definition

export const useTodoStore = defineStore('todo', {
  state: () => ({
    todoList: [] as Todo[],
    doneList: [] as Todone[],
  }),
  actions: {
    addTodo(todo: Todo) {
      this.todoList.push(todo);
      this.saveToLocalStorage(this.todoList);
    },
    addTodone(todone: Todone) {
      this.doneList.push(todone);
      this.saveToLocalStorageDone(this.doneList);
    },
    saveToLocalStorage(todoList: Todo[]) {
      localStorage.setItem('todolist', JSON.stringify(todoList));
      this.todoList = todoList;
    },
    saveToLocalStorageDone(doneList: Todone[]) {
      localStorage.setItem('donelist', JSON.stringify(doneList));
      this.doneList = doneList;
    },
    getFromLocalStorage() {
      const storedTodoList = localStorage.getItem('todolist');
      if (storedTodoList) {
        this.todoList = JSON.parse(storedTodoList);
      }
    },
    getFromLocalStorageDone() {
      const storedDoneList = localStorage.getItem('donelist');
      if (storedDoneList) {
        this.doneList = JSON.parse(storedDoneList);
      }
    },
    plugins: [createPersistedState()],
  },
});
