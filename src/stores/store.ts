import { defineStore } from 'pinia';
import { Todo } from '../components/models';

// Your store definition

export const useTodoStore = defineStore('todo', {
  state: () => ({
    todoList: [] as Todo[],
  }),
  actions: {
    addTodo(todo: Todo) {
      this.todoList.push(todo);
      this.saveTodoList(this.todoList);
    },
    saveTodoList(todoList: Todo[]) {
      this.todoList = todoList;
    },
    getTodoList() {
      this.todoList;
    },
  },
  persist: true,
});
