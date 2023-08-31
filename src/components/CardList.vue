<template>
  <div class="to-do">
    <q-input outlined bottom-slots v-model="todo_input" label="Write your task">
      <template v-slot:before>
        <q-avatar>
          <img src="https://cdn.quasar.dev/img/avatar5.jpg">
        </q-avatar>
      </template>

      <template v-slot:append>
        <q-icon v-if="todo_input !== ''" name="close" @click="todo_input = ''" class="cursor-pointer" />
        <q-icon name="schedule" @click="firstDate" style="cursor: pointer;" />
      </template>

      <!-- first setdate -->
      <q-dialog v-model="firstDeadline">
        <div class="q-pa-md" style="text-align: center; max-width:350px;">
          <div class="q-gutter-sm" style="margin-bottom: 5px;">
            <q-badge color="teal" style="padding: 10px;">
              Deadline: {{ task_date }}
            </q-badge>
          </div>
          <div class="q-gutter-md row items-start">
            <q-date :options="dateOptions" v-model="task_date" mask="YYYY-MM-DD HH:mm" color="purple" />
            <q-time v-model="task_date" color="purple" mask="YYYY-MM-DD HH:mm" />
          </div>
          <button style="padding: 5px; margin-top: 5px;" class="btn btn-success" @click="saveFirstDate">Save
            Date</button>
          <button style="padding: 5px; margin-top: 5px;" class="btn btn-default" v-close-popup>Cancel</button>
        </div>
      </q-dialog>

      <template v-slot:after>
        <q-btn @click="addList" flat round dense icon="send" />
      </template>
    </q-input>
    <!-- same date -->
    <q-dialog v-model="modalDateError" persistent>
      <q-card>
        <div class="modal-content">
          <div class="modal-body">
            <p>Input difference deadline please!</p>
          </div>
          <div class="modal-footer">
            <button style="background: skyblue; cursor:pointer;" type="button" class="btn btn-default btn-close"
              @click="closeModalError">Ok</button>
          </div>
        </div>
      </q-card>
    </q-dialog>

    {{ todo_list }}
    <div class="container">
      <div class=" container-list" style="border: 1px solid rgba(0, 0, 0, 0.24); width: 250px; padding: 10px;">
        <p>Task list</p>
        <draggable class="todo-start" item-key="id" @end="saveOrder" :list="todo_list.filter((x) => x.status == false)"
          :group="{ name: 'people', pull: true, put: true }">
          <template #item="{ element, index }">
            <div style="margin-bottom: 10px;" :class="'asd' + element.id">
              <q-card flat bordered class="my-card bg-secondary text-white list-group-item item">
                <q-card-section style="padding-top: 5px;padding-bottom: 2px;">
                  <div class="row items-center no-wrap">
                    <div class="col">
                      <div class="text-subtitle2">
                        <p>Deadline Task : {{ todo_list[index].deadline }}</p>
                      </div>
                    </div>

                    <div class="col-auto">
                      <q-btn color="grey-7" round flat icon="more_vert">
                        <q-menu cover>
                          <q-list>
                            <q-item clickable @click="deleteList(index, '001')">
                              <q-item-section>Remove Card</q-item-section>
                            </q-item>
                            <q-dialog v-if="index === indexToDelete && confirm" v-model="confirm" persistent>
                              <q-card>
                                <div class="modal-content">
                                  <div class="modal-header">
                                    <button type="button" class="close" v-close-popup aria-label="Close">
                                      <span aria-hidden="true">×</span></button>
                                    <h6 class="modal-title">Remove Card</h6>
                                  </div>
                                  <div class="modal-body">
                                    <p>Are you sure do you want to remove this item?</p>
                                  </div>
                                  <div class="modal-footer">
                                    <button style="background: crimson;margin-right: 5px; cursor:pointer;" type="submit"
                                      name="submit" @click="deleted(index, '001')" class="btn btn-success">Remove</button>
                                    <button style="background: azure;cursor:pointer;" type="button"
                                      class="btn btn-default btn-close" v-close-popup>Cancel</button>
                                  </div>
                                </div>
                              </q-card>
                            </q-dialog>
                            <q-item clickable @click="setDate(index, '001')">
                              <q-item-section>Set Deadline</q-item-section>
                            </q-item>
                            <q-dialog v-if="index === indexToSetDate && deadline" v-model="deadline">
                              <div class="q-pa-md" style="text-align: center; max-width:350px; padding: 10px;">
                                <div class="q-gutter-sm" style="margin-bottom: 5px;">
                                  <q-badge color="teal" style="padding: 10px;">
                                    Deadline: {{ element.deadline }}
                                  </q-badge>
                                </div>
                                <div class="q-gutter-md row items-start">
                                  <q-date :options="dateOptions" v-model="task_date" mask="YYYY-MM-DD HH:mm"
                                    color="purple" />
                                  <q-time v-model="task_date" color="purple" mask="YYYY-MM-DD HH:mm" />
                                </div>
                                <button style="padding: 5px; margin-top: 5px;" class="btn btn-success"
                                  @click="saveDate(index, '001')">Save
                                  Date</button>
                                <button style="padding: 5px; margin-top: 5px;" class="btn btn-default"
                                  v-close-popup>Cancel</button>
                              </div>
                            </q-dialog>
                          </q-list>
                        </q-menu>
                      </q-btn>
                    </div>
                  </div>
                </q-card-section>

                <q-card-section>
                  <div v-if="element.edited == false" style="color: #f4f4f4">
                    {{ element.name }}
                  </div>
                  <input v-if="element.edited == true" type="text" class="text-subtitle2 edit-text"
                    v-model="element.name">
                </q-card-section>

                <q-separator />

                <q-card-actions style="display: flex; justify-content: space-between;">
                  <div class="save-edit">
                    <q-btn flat @click="editList(index, '001')"><i class="fas fa-edit"></i>
                      <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                        <strong>Edit</strong>
                      </q-tooltip></q-btn>
                    <q-btn flat @click="saveList(index, '001')"><i class="fas fa-check"></i>
                      <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                        <strong>Save</strong>
                      </q-tooltip>
                    </q-btn>
                  </div>

                </q-card-actions>
              </q-card>
            </div>
          </template>
        </draggable>
      </div>

      <div class="container-done"
        style="border: 1px solid rgba(0, 0, 0, 0.24); width: 250px; padding: 10px; margin-left:10px">
        <p>Done</p>
        <draggable item-key="id" @end="saveOrder" :list="todo_list.filter((x) => x.status == true)"
          :group="{ name: 'people', pull: true, put: true }" class="todo-done">
          <template #item="{ element, index }">
            <div style="margin-bottom: 10px;" :class="'asd' + element.id">
              <q-card flat bordered class="my-card bg-secondary text-white list-group-item item">
                <q-card-section style="padding-top: 5px;padding-bottom: 2px;">
                  <div class="row items-center no-wrap">
                    <div class="col">
                      <div class="text-subtitle2">
                        <p>Deadline Task : {{ todo_list[index].deadline }}</p>
                      </div>
                    </div>

                    <div class="col-auto">
                      <q-btn color="grey-7" round flat icon="more_vert">
                        <q-menu cover>
                          <q-list>
                            <q-item clickable @click="deleteList(index, '002')">
                              <q-item-section>Remove Card</q-item-section>
                            </q-item>
                            <q-dialog v-if="index === indexToDeleteDone && confirmDone" v-model="confirmDone" persistent>
                              <q-card>
                                <div class="modal-content">
                                  <div class="modal-header">
                                    <button type="button" class="close" v-close-popup aria-label="Close">
                                      <span aria-hidden="true">×</span></button>
                                    <h6 class="modal-title">Remove Card</h6>
                                  </div>
                                  <div class="modal-body">
                                    <p>Are you sure do you want to remove this item?</p>
                                  </div>
                                  <div class="modal-footer">
                                    <button style="background: crimson;margin-right: 5px; cursor:pointer;" type="submit"
                                      name="submit" @click="deleted(index, '002')" class="btn btn-success">Remove</button>
                                    <button style="background: azure;cursor:pointer;" type="button"
                                      class="btn btn-default btn-close" v-close-popup>Cancel</button>
                                  </div>
                                </div>
                              </q-card>
                            </q-dialog>
                            <q-item clickable @click="setDate(index, '002')">
                              <q-item-section>Set Deadline</q-item-section>
                            </q-item>
                            <q-dialog v-if="index === indexToSetDateDone && deadlineDone" v-model="deadlineDone">
                              <div class="q-pa-md" style="text-align: center; max-width:350px;">
                                <div class="q-gutter-sm" style="margin-bottom: 5px;">
                                  <q-badge color="teal" style="padding: 10px;">
                                    Deadline: {{ element.deadline }}
                                  </q-badge>
                                </div>
                                <div class="q-gutter-md row items-start">
                                  <q-date :options="dateOptions" v-model="task_date" mask="YYYY-MM-DD HH:mm"
                                    color="purple" />
                                  <q-time v-model="task_date" color="purple" mask="YYYY-MM-DD HH:mm" />
                                </div>
                                <button style="padding: 5px; margin-top: 5px;" class="btn btn-success"
                                  @click="saveDate(index, '002')">Save
                                  Date</button>
                                <button style="padding: 5px; margin-top: 5px;" class="btn btn-default"
                                  v-close-popup>Cancel</button>
                              </div>
                            </q-dialog>
                          </q-list>
                        </q-menu>
                      </q-btn>
                    </div>
                  </div>
                </q-card-section>

                <q-card-section>
                  <div v-if="element.edited == false" style="color: #f4f4f4">
                    {{ element.name }}
                  </div>
                  <input v-if="element.edited == true" type="text" class="text-subtitle2 edit-text"
                    v-model="element.name">
                </q-card-section>

                <q-separator />

                <q-card-actions style="display: flex; justify-content: space-between;">
                  <div class="save-edit">
                    <q-btn flat @click="editList(index, '002')"><i class="fas fa-edit"></i>
                      <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                        <strong>Edit</strong>
                      </q-tooltip></q-btn>
                    <q-btn flat @click="saveList(index, '002')"><i class="fas fa-check"></i>
                      <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                        <strong>Save</strong>
                      </q-tooltip>
                    </q-btn>
                  </div>
                </q-card-actions>
              </q-card>
            </div>
          </template>
        </draggable>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import dayjs from 'dayjs';
import { Todo, Todone, Totask } from './models';
import { useTodoStore } from 'src/stores/store';
import draggable from 'vuedraggable';
import { AnyMxRecord } from 'dns';

export default defineComponent({
  name: 'CardList',
  components: {
    draggable
  },
  data() {
    const timestamp = new Date().getTime();
    const today_deadline = dayjs.unix(timestamp / 1000).add(1, 'hour').locale('id').format('YYYY-MM-DD HH:mm');
    const id = Date.now();
    let mydeadline = '';

    const todoStore = useTodoStore();

    return {
      dense: ref(false),
      teal: ref(true),
      id,
      todoStore,
      todo_list: ref<Array<Todo>>([]),
      done_list: ref<Array<Todone>>([]),
      task_list: ref<Array<Totask>>([]),
      todo_input: ref(''),
      task_done: ref(''),
      confirm: ref(false),
      confirmDone: ref(false),
      firstDeadline: ref(false),
      deadline: ref(false),
      deadlineDone: ref(false),
      delete: ref(false),
      deleteDone: ref(false),
      indexToDelete: 0,
      indexToDeleteDone: 0,
      indexToSetDate: 0,
      indexToSetDateDone: 0,
      indexToEdit: 0,
      indexToEditDone: 0,
      today_deadline,
      mydeadline,
      task_date: ref(mydeadline ? mydeadline : ''),
      modalDateError: ref(false),
    }
  },
  mounted() {
    this.todoStore.getFromLocalStorage();
    this.todo_list = this.todoStore.todoList;


  },
  methods: {
    addList() {
      const existingDeadline = this.todo_list.find(data => data.deadline === this.task_date && this.task_date !== '');
      if (existingDeadline) {
        this.modalDateError = true;
      } else if (this.todo_input !== '' && !existingDeadline) {
        this.todo_list.push({
          id: this.id.toString(),
          name: this.todo_input,
          status: false,
          edited: false,
          deadline: this.task_date,
          info: ''
        });
        this.task_date = '';
        this.id++;
        this.todoStore.saveToLocalStorage(this.todo_list);
        this.todo_input = '';
      }
      else {
        console.log('Empty input detected');
      }
    },
    closeModalError() {
      this.modalDateError = false;
    },
    dateOptions(date: string) {
      const selectedDate = new Date(date);
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      return selectedDate >= currentDate;
    },
    toggleStatus(index: number, container: string) {
      if (container === '001') {
        this.todo_list[index].status = true;
      } else {
        this.todo_list[index].status = false;
      }
      this.todoStore.saveToLocalStorage(this.todo_list);
    },
    saveList(index: number, container: string) {
      if (container === '001') {
        this.todo_list[index].edited = false;
        this.todoStore.saveToLocalStorage(this.todo_list);
      } else {
        this.done_list[index].edited = false;
        this.todoStore.saveToLocalStorageDone(this.done_list);
      }
    },
    deleteList(index: number, container: string) {
      if (container === '001') {
        this.indexToDelete = index;
        this.todoStore.saveToLocalStorage(this.todo_list);
        this.confirm = true;
      } else {
        this.indexToDeleteDone = index;
        this.todoStore.saveToLocalStorageDone(this.done_list);
        this.confirmDone = true;
      }
    },
    deleted(index: number, container: string) {
      if (container === '001') {
        index = this.indexToDelete;
        this.todo_list.splice(index, 1);
        this.todoStore.saveToLocalStorage(this.todo_list);
        this.confirm = false;
      } else {
        index = this.indexToDeleteDone;
        this.done_list.splice(index, 1);
        this.todoStore.saveToLocalStorageDone(this.done_list);
        this.confirmDone = false;
      }

    },
    editList(index: number, container: string) {
      if (container === '001') {
        this.todo_list[index].edited = true;
        this.indexToEdit = index;
      } else {
        this.done_list[index].edited = true;
        this.indexToEditDone = index;
      }
    },
    firstDate() {
      this.firstDeadline = true;
    },
    setDate(index: number, container: string) {
      if (container === '001') {
        this.indexToSetDate = index;
        this.deadline = true;
        this.task_date = this.todo_list[index].deadline ? this.todo_list[index].deadline : this.today_deadline;
      } else {
        this.indexToSetDateDone = index;
        this.deadlineDone = true;
        this.task_date = this.done_list[index].deadline ? this.done_list[index].deadline : this.today_deadline;
      }
    },
    saveFirstDate() {
      this.firstDeadline = false;
    },
    saveDate(index: number, container: string) {
      if (container === '001') {
        index = this.indexToSetDate;
        this.todo_list[index].deadline = this.task_date;
        this.todoStore.saveToLocalStorage(this.todo_list);
        this.deadline = false;
      } else {
        index = this.indexToSetDateDone;
        this.done_list[index].deadline = this.task_date;
        this.todoStore.saveToLocalStorageDone(this.done_list);
        this.deadlineDone = false;
      }
    },
    saveOrder(container: any) {
      try {
        const containerValue = container.to.classList.value
        if (containerValue.includes('todo-done')) {
        } else {

        }
        const itemValue = container.item;
        let i = itemValue.classList.value.split('asd')[1];
        console.log(i);
        console.log(this.todo_list.findIndex((x) => x.id == i));

        let temp = this.todo_list[this.todo_list.findIndex((x) => x.id == i)];
        if (container.to.classList.value.includes('todo-done')) {
          temp.status = true;
        } else {
          temp.status = false;
        }
        this.todo_list[i] = temp;
        this.todoStore.saveToLocalStorage(this.todo_list);
      } catch (error) {
        console.log(error);

      }
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
        const info = data.info;
        if (status === true) {
          todo_done.push({
            id: this.id.toString(),
            name: name,
            status: status,
            edited: false,
            deadline: this.task_date,
            info: info
          });
        } else if (status === false) {
          todo_not.push({
            id: this.id.toString(),
            name: name,
            status: status,
            edited: false,
            deadline: this.task_date,
            info: info
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
    },
  }
})
</script>

<style scoped>
.to-do {
  padding: 20px;
}

.edit-text {
  background: #fff !important;
  color: black !important;
}

.container {
  display: flex;
}

.container-list,
.container-done,
.container-doing {
  padding: 20px;
}

.my-card {
  width: 100%;
  max-width: 250px;
}

.text-subtitle2 {
  background: transparent;
  border: none;
  color: #fff;
}

#status {
  margin-right: 4px;
}

.modal-content {
  position: relative;
  background: cadetblue;
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
</style>
