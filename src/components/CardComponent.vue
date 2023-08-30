<template>
  <div></div>
  <!-- <div class="content">
    <header>
      <h4>{{ title }}</h4>
    </header>
    <div class="col-xl-6 col-md-6 col-xs-6 form">
      <input v-model="todo_input" type="text" class="todo-inputs" />
      <button @click="firstDate" class="deadline-btn">
        <i class="fa-solid fa-calendar"><i></i></i>
        <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
          <strong>Set Deadline Date</strong>
        </q-tooltip>
      </button>
      <q-dialog v-model="modalDateError" persistent>
        <q-card>
          <div class="modal-content">
            <div class="modal-body">
              <p>Masukan waktu yang berbeda dengan task yang lainnya</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-default btn-close" @click="closeModalError">Close</button>
            </div>
          </div>
        </q-card>
      </q-dialog>
      <q-dialog v-model="firstDeadline">
        <div class="q-pa-md" style="text-align: center; max-width:350px;">
          <div class="q-gutter-sm" style="margin-bottom: 5px;">
            <q-badge color="teal" style="padding: 10px;">
              Deadline: {{ model }}
            </q-badge>
          </div>
          <div class="q-gutter-md row items-start">
            <q-date :options="dateOptions" v-model="model" mask="YYYY-MM-DD HH:mm" color="purple" />
            <q-time v-model="model" color="purple" mask="YYYY-MM-DD HH:mm" />
          </div>
          <button style="padding: 5px; margin-top: 5px;" class="btn btn-success" @click="saveFirstDate">Save
            Date</button>
          <button style="padding: 5px; margin-top: 5px;" class="btn btn-default" v-close-popup>Cancel</button>
        </div>
      </q-dialog>
      <button class='todo-button' @click="addList">
        <i class='fas fa-plus-square'></i>
        <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
          <strong>Add List</strong>
        </q-tooltip>
      </button>
      <div class="select">
        <select name="todos" class='filter-todos' @change="filter_status($event)">
          <option value="all">All</option>
          <option value="true">Completed</option>
          <option value="false">Uncompleted</option>
        </select>
      </div>
    </div>
    <div>
      <draggable v-model="todo_list" item-key="id" @end="saveOrder">
        <template #item="{ element, index }">
          <div class="todo-container" style="max-width: 300px;">
            <ul class="todo-list">
              <div class="todo">
                <input type="text" v-model="todo_list[index].name" @input="editList(index)"
                  :disabled="element.edited == false || indexToEdit != index">
                <li class="todo-item"></li>
                <button @click="setDate(index)" class="deadline-btn">
                  <i class="fa-solid fa-calendar"><i></i></i>
                  <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                    <strong>Set Deadline Date</strong>
                  </q-tooltip>
                </button>
                <q-dialog v-if="index === indexToSetDate && deadline" v-model="deadline">
                  <div class="q-pa-md" style="text-align: center; max-width:350px;">
                    <div class="q-gutter-sm" style="margin-bottom: 5px;">
                      <q-badge color="teal" style="padding: 10px;">
                        Deadline: {{ element.deadline }}
                      </q-badge>
                    </div>
                    <div class="q-gutter-md row items-start">
                      <q-date :options="dateOptions" v-model="model" mask="YYYY-MM-DD HH:mm" color="purple" />
                      <q-time v-model="model" color="purple" mask="YYYY-MM-DD HH:mm" />
                    </div>
                    <button style="padding: 5px; margin-top: 5px;" class="btn btn-success" @click="saveDate(index)">Save
                      Date</button>
                    <button style="padding: 5px; margin-top: 5px;" class="btn btn-default" v-close-popup>Cancel</button>
                  </div>
                </q-dialog>
                <button @click="saveList(index)" class="complete-btn">
                  <i class="fas fa-check"><i></i></i>
                  <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                    <strong>Save Change</strong>
                  </q-tooltip>
                </button>
                <button @click="editList(index)" class="edit-btn">
                  <i class="fas fa-edit"></i>
                  <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                    <strong>Edit</strong>
                  </q-tooltip>
                </button>
                <button @click="deleteList(index)" class="trash-btn">
                  <i class="fas fa-trash"><i></i></i>
                  <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                    <strong>Delete</strong>
                  </q-tooltip>
                </button>
                <button class="status-btn" for="status" @click="toggleStatus(index)">
                  <input type="checkbox" id="status" name="status" v-model="todo_list[index].status">
                  <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                    <strong>{{ todo_list[index].status == true ? 'Not yet' : 'Done' }}</strong>
                  </q-tooltip>
                </button>
                <q-dialog v-if="index === indexToDelete && confirm" v-model="confirm" persistent>
                  <q-card>
                    <div class="modal-content">
                      <div class="modal-header">
                        <button type="button" class="close" v-close-popup aria-label="Close">
                          <span aria-hidden="true">×</span></button>
                        <h6 class="modal-title">Delete Task</h6>
                      </div>
                      <div class="modal-body">
                        <p>Are you sure do you want to delete this item?</p>
                      </div>
                      <div class="modal-footer">
                        <button type="submit" name="submit" @click="deleted(index)"
                          class="btn btn-success">Delete</button>
                        <button type="button" class="btn btn-default btn-close" v-close-popup>Cancel</button>
                      </div>
                    </div>
                  </q-card>
                </q-dialog>
              </div>
            </ul>
          </div>
        </template>
      </draggable>
    </div>
    <div style="margin-top: 10px; margin-bottom: 20px" class="q-pa-md row items-start q-gutter-md">
      <CardList />
    </div>

  </div> -->
</template>

<!-- <script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import dayjs from 'dayjs';
import { useTodoStore } from 'src/stores/store';
import draggable from 'vuedraggable';
import CardList from './CardList.vue'

export default defineComponent({
  name: 'CardComponent',
  components: {
    draggable,
    CardList
  },
  data() {
    let todo_list = ref<Array<{ id: string, name: string; status: boolean, edited: boolean, deadline: string }>>([]);
    const timestamp = new Date().getTime();
    const today_deadline = dayjs.unix(timestamp / 1000).add(1, 'hour').locale('id').format('YYYY-MM-DD HH:mm');
    const id = Date.now();
    let mydeadline = '';

    const todoStore = useTodoStore();
    const todoList = todoStore.todoList;

    const saveOrder = () => {
      todo_list.value.map(item => item.id);
      localStorage.setItem('todolist', JSON.stringify(todo_list.value));
    };

    const loadOrder = () => {
      const savedOrder = localStorage.getItem('todolist');
      if (savedOrder) {
        const order = JSON.parse(savedOrder);
        todo_list.value.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
      }
    };

    const status1 = ref<string[]>([]);
    const status2 = ref<string[]>([]);

    const dateOptions = (date: string) => {
      const selectedDate = new Date(date);
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      return selectedDate >= currentDate;
    };

    const timeOptions = (timeString: string) => {
      const currentTime = new Date();
      const selectedTime = new Date(currentTime);
      const [hours, minutes] = timeString.split(':');
      selectedTime.setHours(parseInt(hours, 10));
      selectedTime.setMinutes(parseInt(minutes, 10));
      return selectedTime >= currentTime;
    };

    onMounted(() => {
      todoStore.getFromLocalStorage()
      todo_list.value = todoStore.todoList;
      loadOrder();
    });

    return {
      title: 'To Do List',
      todo_container: ref(false),
      todoList,
      todo_list,
      todo_input: ref(''),
      todo_read: ref(''),
      task_done: ref(''),
      confirm: ref(false),
      firstDeadline: ref(false),
      deadline: ref(false),
      delete: ref(false),
      indexToDelete: 0,
      indexToSetDate: 0,
      indexToEdit: 0,
      today_deadline,
      mydeadline,
      model: ref(mydeadline ? mydeadline : ''),
      times: ref(''),
      id,
      dateOptions,
      timeOptions,
      status1,
      status2,
      todoStore,
      saveOrder,
      loadOrder,
      modalDateError: ref(false),
    };
  },
  methods: {
    handler1(mutationRecords: MutationRecord[]): void {
      this.status1 = [];
      for (const record of mutationRecords) {
        const info = `type: ${record.type}, nodes added: ${record.addedNodes.length > 0 ? 'true' : 'false'
          }, nodes removed: ${record.removedNodes.length > 0 ? 'true' : 'false'}, oldValue: ${record.oldValue}`;
        this.status1.push(info);
      }
    },
    handler2(mutationRecords: MutationRecord[]): void {
      this.status2 = [];
      for (const record of mutationRecords) {
        const info = `type: ${record.type}, nodes added: ${record.addedNodes.length > 0 ? 'true' : 'false'
          }, nodes removed: ${record.removedNodes.length > 0 ? 'true' : 'false'}, oldValue: ${record.oldValue}`;
        this.status2.push(info);
      }
    },
    onDragStart(e: DragEvent): void {
      const dataTransfer = e.dataTransfer;
      if (dataTransfer && e.target instanceof HTMLElement) {
        dataTransfer.setData('text', e.target.id,);
        dataTransfer.dropEffect = 'move';
      }
    },
    onDragEnter(e: DragEvent): void {
      if (e.target instanceof HTMLElement && e.target.draggable !== true) {
        e.target.classList.add('drag-enter');
      }
    },
    onDragLeave(e: DragEvent): void {
      if (e.target instanceof HTMLElement) {
        e.target.classList.remove('drag-enter');
      }
    },
    onDragOver(e: DragEvent,): void {
      e.preventDefault();
    },
    onDrop(e: DragEvent): void {
      e.preventDefault();

      const dataTransfer = e.dataTransfer;
      const target = e.target as HTMLElement;

      if (dataTransfer && target) {
        const draggedId = dataTransfer.getData('text');
        const draggedEl = document.getElementById(draggedId);

        if (draggedEl && draggedEl.parentNode === target) {
          target.classList.remove('drag-enter');
          return;
        }

        if (draggedEl && draggedEl.parentNode) {
          draggedEl.parentNode.removeChild(draggedEl);
        }

        if (draggedEl) {
          target.appendChild(draggedEl);
          target.classList.remove('drag-enter');
        }
      }
    },
    addList() {
      this.todo_container = true;
      this.todoStore.getFromLocalStorage()
      this.todo_list = this.todoStore.todoList;
      if (this.todo_input !== '') {
        if (this.model === '') {
          this.todo_list.push({
            id: this.id.toString(),
            name: this.todo_input,
            status: false,
            edited: false,
            deadline: this.model
          });
        } else {
          const existingDeadline = this.todo_list.some(data => data.deadline === this.model && this.model !== '');
          if (existingDeadline) {
            this.modalDateError = true;
          } else {
            this.todo_list.push({
              id: this.id.toString(),
              name: this.todo_input,
              status: false,
              edited: false,
              deadline: this.model
            });
          }
        }
        this.model = '';
        this.id++;
        this.todo_read = this.todo_input;
        this.todoStore.saveToLocalStorage(this.todo_list);
        this.todo_input = '';
      } else {
        console.log('Empty input detected');
      }
    },
    closeModalError() {
      this.modalDateError = false;
    },
    toggleStatus(index: number) {
      this.todo_list[index].status = !this.todo_list[index].status;
      this.todoStore.saveToLocalStorage(this.todo_list);
    },
    saveList(index: number) {
      this.todo_list[index].edited = false;
      this.todoStore.saveToLocalStorage(this.todo_list);
    },
    deleteList(index: number) {
      this.indexToDelete = index;
      this.todoStore.saveToLocalStorage(this.todo_list);
      this.confirm = true;
    },
    deleted(index: number) {
      index = this.indexToDelete;
      this.todo_list.splice(index, 1);
      this.todoStore.saveToLocalStorage(this.todo_list);
      this.confirm = false;
    },
    editList(index: number) {
      this.todo_list[index].edited = true;
      this.todoStore.saveToLocalStorage(this.todo_list);
      this.indexToEdit = index;
    },
    firstDate() {
      this.firstDeadline = true;
    },
    setDate(index: number) {
      this.indexToSetDate = index;
      this.deadline = true;
      this.model = this.todo_list[index].deadline ? this.todo_list[index].deadline : this.today_deadline;
    },
    saveFirstDate() {
      this.firstDeadline = false;
    },
    saveDate(index: number) {
      index = this.indexToSetDate;
      this.todo_list[index].deadline = this.model;
      this.todoStore.saveToLocalStorage(this.todo_list);
      this.deadline = false;
    },
    filter_status(event: MouseEvent) {
      const selectElement = event.target as HTMLSelectElement;
      const selectedStatus = selectElement.value;
      this.todoStore.getFromLocalStorage()
      this.todo_list = this.todoStore.todoList;
      let todo_done = [];
      let todo_not = [];
      for (let i = 0; i < this.todo_list.length; i++) {
        const data = this.todo_list[i];
        const name = data.name;
        const status = data.status;
        if (status === true) {
          todo_done.push({
            id: this.id.toString(),
            name: name,
            status: status,
            edited: false,
            deadline: this.model
          });
        } else if (status === false) {
          todo_not.push({
            id: this.id.toString(),
            name: name,
            status: status,
            edited: false,
            deadline: this.model
          });
        }
      };
      if (selectedStatus == 'true') {
        this.todo_list = todo_done;
      } else if (selectedStatus === 'false') {
        this.todo_list = todo_not;
      } else if (selectedStatus === 'all') {
        this.todoStore.getFromLocalStorage()
        this.todo_list = this.todoStore.todoList;
      }
    }
  },
});

</script> -->

<style scoped>
.btn-default {
  background-color: #f4f4f4 !important;
  color: #444;
  border-radius: 2px;
  padding: 4px;
  cursor: pointer;
  border: none;
}

.btn-success {
  background-color: #00b451 !important;
  border-color: #00b451 !important;
  margin-right: 5px;
  border-radius: 2px;
  padding: 4px;
  cursor: pointer;
  border: none;
  color: #ffff;
}

* {
  margin: 0px;
  padding: 0px;
  box-sizing: border-box;
}

header {
  font-size: 1.5rem;
  padding: 20px;
}

.form {
  padding: 15px;
}

header,
.form {
  min-height: 20vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

input {
  border: none;
  padding-left: 10px;
}

.completed {
  opacity: 0.5;
}

.form input,
.form button {
  padding: 0.5rem;
  border: none;
  background: white;
  font-size: 2rem;
}

.form button {
  width: 5rem;
  color: rgb(238, 139, 97);
  background: white;
  cursor: pointer;
  transition: all 0.5s ease-out;
}

.form button:hover {
  color: white;
  background: rgb(238, 139, 97);
}

.todo-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.todo-list {
  min-width: 30%;
  list-style: none;
}

.todo {
  background: white;
  color: black;
  margin: 0.5rem;
  font-size: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.5s ease;
}

.todo li {
  flex: 1;
}

.trash-btn,
.complete-btn,
.deadline-btn,
.status-btn,
.edit-btn {
  color: white;
  background: #ff6f47;
  font-size: 1rem;
  cursor: pointer;
  border: none;
  padding: 1rem;
}

.status-btn {
  background: rgb(83, 196, 83);
}

.complete-btn {
  background: #E79666;
}

.deadline-btn {
  background: #909e94;
}

.edit-btn {
  background: #f0de99;
}

.fa-check,
.fa-trash {
  pointer-events: none;
}

.todo-item {
  padding: 0rem 0.5rem;
}

.completed {
  text-decoration: line-through;
  opacity: 0.5;
}

.fall {
  transform: translateY(8rem) rotateZ(20deg);
  opacity: 0;
}

/* select button filter button */
select {
  -web-kit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  outline: none;
  border: none;
  padding: 1rem;
  width: 10rem;
  cursor: pointer;
  color: #ff6f47;
}

.select {
  margin: 1rem;
  position: relative;
  overflow: hidden;
}

.select:after {
  content: "\25BC";
  position: absolute;
  top: 0;
  right: 0;
  background: #ff6f47;
  color: white;
  padding: 1rem;
  pointer-events: none;
  transition: all 0.3s ease;
}

.select:hover::after {
  background: white;
  color: #ff6f47;
}

.modal-content {
  position: relative;
  background-color: #fff;
  background-clip: padding-box;
  outline: 0;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.125);
  border-radius: 0;
}

.modal-header {
  border-bottom-color: #f4f4f4;
  padding: 15px;
  border-bottom: 1px solid #e5e5e5;
}

.modal-title {
  margin: 0;
  line-height: 1.42857143;
}

.modal-header .close {
  margin-top: -2px;
}

button.close {
  padding: 0;
  cursor: pointer;
  background: 0 0;
  border: 0;
}

.close {
  float: right;
  font-size: 21px;
  font-weight: 700;
  line-height: 1;
  color: #000;
  text-shadow: 0 1px 0 #fff;
  opacity: .2;
}

.modal-body {
  position: relative;
  padding: 15px;
}

.modal-footer {
  border-top-color: #f4f4f4;
  padding: 15px;
  text-align: right;
  border-top: 1px solid #e5e5e5;
}


.drop-target {
  /* height: 400px; */
  width: 400px;
  min-width: 100px;
  background-color: gainsboro;
}

.drag-enter {
  outline-style: dashed;
}

.box {
  width: 100px;
  height: 100px;
  float: left;
  cursor: pointer;
}

@media only screen and (max-width: 500px) {
  .drop-target {
    height: 200px;
    width: 100px;
    min-width: 100px;
    background-color: gainsboro;
  }

  .box {
    width: 50px;
    height: 50px;
  }
}

.box:nth-child(3) {
  clear: both
}

.navy {
  background-color: navy;
}


.red {
  background-color: firebrick
}

.green {
  background-color: darkgreen;
}


.orange {
  background-color: orange
}
</style>
