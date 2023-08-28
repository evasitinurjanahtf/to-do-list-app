import { defineStore } from 'pinia';

// Your store definition
interface Todo {
  id: string;
  name: string;
  status: boolean;
  edited: boolean;
  deadline: string;
}

export const useTodoStore = defineStore('todo', {
  state: () => ({
    todoList: [] as Todo[],
  }),
  actions: {
    addTodo(todo: Todo) {
      this.todoList.push(todo);
      this.saveToLocalStorage(this.todoList); // Pass the todoList to the saveToLocalStorage action
    },

    saveToLocalStorage(todoList: Todo[]) {
      localStorage.setItem('todolist', JSON.stringify(todoList));
      this.todoList = todoList; // Update the todoList state
    },

    getFromLocalStorage() {
      const storedTodoList = localStorage.getItem('todolist');
      if (storedTodoList) {
        this.todoList = JSON.parse(storedTodoList);
      }
    },
  },
});
