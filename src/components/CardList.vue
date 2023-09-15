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
            <q-date v-model="task_date" mask="YYYY-MM-DD HH:mm" color="purple" />
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

    <div class="row q-pa-lg">
      <label style="margin-right: 5px;" for="status">Select Filter Status</label>
      <select @change="filtered">
        <option v-for="item of filteredOptions" :key="item.id" :value="item.label">{{ item.label }}</option>
      </select>
    </div>
    <div class="container">
      <div class="container-list">
        <p>Task list</p>
        <draggable class="todo-start" item-key="id" @end="saveOrder" :list="todos.filter((x) => x.info === 1)"
          :group="{ name: 'people', pull: true, put: true }">
          <template #item="{ element }">
            <div style="margin-bottom: 10px;" :class="'random' + element.id">
              <q-card flat bordered class="my-card text-white list-group-item item"
                :class="changeColorDate(element.deadline) == 1 ? 'bg-info' : changeColorDate(element.deadline) == 2 ? 'bg-grey-6' : 'bg-secondary'">
                <q-card-section style="padding-top: 5px;padding-bottom: 2px;">
                  <div class="row items-center no-wrap">
                    <div class="col">
                      <div class="text-subtitle2">
                        <p>Deadline Task : {{ element.deadline }}</p>
                      </div>
                    </div>

                    <div class="col-auto">
                      <q-btn color="grey-7" round flat icon="more_vert">
                        <q-menu cover>
                          <q-list>
                            <q-item clickable @click="deleteList(element.id)">
                              <q-item-section>Remove Card</q-item-section>
                            </q-item>
                            <q-dialog v-if="element.id === indexToDelete && confirm" v-model="confirm" persistent>
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
                                      name="submit" @click="deleted(element.id)" class="btn btn-success">Remove</button>
                                    <button style="background: azure;cursor:pointer;" type="button"
                                      class="btn btn-default btn-close" v-close-popup>Cancel</button>
                                  </div>
                                </div>
                              </q-card>
                            </q-dialog>
                            <q-item clickable @click="setDate(element.id)">
                              <q-item-section>Set Deadline</q-item-section>
                            </q-item>
                            <q-dialog v-if="element.id === indexToSetDate && deadline" v-model="deadline">
                              <div class="q-pa-md" style="text-align: center; max-width:350px; padding: 10px;">
                                <div class="q-gutter-sm" style="margin-bottom: 5px;">
                                  <q-badge color="teal" style="padding: 10px;">
                                    Deadline: {{ element.deadline }}
                                  </q-badge>
                                </div>
                                <div class="q-gutter-md row items-start">
                                  <q-date v-model="task_date" mask="YYYY-MM-DD HH:mm" color="purple" />
                                  <q-time v-model="task_date" color="purple" mask="YYYY-MM-DD HH:mm" />
                                </div>
                                <button style="padding: 5px; margin-top: 5px;" class="btn btn-success"
                                  @click="saveDate(element.id)">Save
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
                  <input v-if="element.edited == true" type="text" class="text-subtitle2 edit-text" v-model="changeName">
                </q-card-section>

                <q-separator />

                <q-card-actions style="display: flex; justify-content: space-between;">
                  <div class="save-edit">
                    <q-btn flat @click="startEdit(element.id)"><i class="fas fa-edit"></i>
                      <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                        <strong>Edit</strong>
                      </q-tooltip></q-btn>
                    <q-btn :disabled="element.edited == false" flat @click="saveEdit(element.id)"><i
                        class="fas fa-check"></i>
                      <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                        <strong>Save</strong>
                      </q-tooltip>
                    </q-btn>
                  </div>
                  <q-btn @click="toggleStatus(element.id)">
                    <input type="checkbox" id="status" name="status" :checked="element.info === 3">
                    <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                      <strong>{{ element.info === 3 ? 'Not yet' : 'Done' }}</strong>
                    </q-tooltip>Done
                  </q-btn>

                </q-card-actions>
              </q-card>
            </div>
          </template>
        </draggable>
      </div>

      <div class="container-doing">
        <p>Doing List</p>
        <draggable class="todo-doing" item-key="id" @end="saveOrder" :list="todos.filter((x) => x.info == 2)"
          :group="{ name: 'people', pull: true, put: true }">
          <template #item="{ element }">
            <div style="margin-bottom: 10px;" :class="'random' + element.id">
              <q-card flat bordered class="my-card text-white list-group-item item"
                :class="changeColorDate(element.deadline) == 1 ? 'bg-info' : changeColorDate(element.deadline) == 2 ? 'bg-grey-6' : 'bg-secondary'">
                <q-card-section style="padding-top: 5px;padding-bottom: 2px;">
                  <div class="row items-center no-wrap">
                    <div class="col">
                      <div class="text-subtitle2">
                        <p>Deadline Task : {{ element.deadline }}</p>
                      </div>
                    </div>

                    <div class="col-auto">
                      <q-btn color="grey-7" round flat icon="more_vert">
                        <q-menu cover>
                          <q-list>
                            <q-item clickable @click="deleteList(element.id)">
                              <q-item-section>Remove Card</q-item-section>
                            </q-item>
                            <q-dialog v-if="element.id === indexToDelete && confirm" v-model="confirm" persistent>
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
                                      name="submit" @click="deleted(element.id)" class="btn btn-success">Remove</button>
                                    <button style="background: azure;cursor:pointer;" type="button"
                                      class="btn btn-default btn-close" v-close-popup>Cancel</button>
                                  </div>
                                </div>
                              </q-card>
                            </q-dialog>
                            <q-item clickable @click="setDate(element.id)">
                              <q-item-section>Set Deadline</q-item-section>
                            </q-item>
                            <q-dialog v-if="element.id === indexToSetDate && deadline" v-model="deadline">
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
                                  @click="saveDate(element.id)">Save
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
                  <input v-if="element.edited == true" type="text" class="text-subtitle2 edit-text" v-model="changeName">
                </q-card-section>

                <q-separator />

                <q-card-actions style="display: flex; justify-content: space-between;">
                  <div class="save-edit">
                    <q-btn flat @click="startEdit(element.id)"><i class="fas fa-edit"></i>
                      <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                        <strong>Edit</strong>
                      </q-tooltip></q-btn>
                    <q-btn :disabled="element.edited == false" flat @click="saveEdit(element.id)"><i
                        class="fas fa-check"></i>
                      <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                        <strong>Save</strong>
                      </q-tooltip>
                    </q-btn>
                  </div>
                  <q-btn @click="toggleStatus(element.id)">
                    <input type="checkbox" id="status" name="status" :checked="element.info === 3">
                    <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                      <strong>{{ element.info === 3 ? 'Not yet' : 'Done' }}</strong>
                    </q-tooltip>Done
                  </q-btn>

                </q-card-actions>
              </q-card>
            </div>
          </template>
        </draggable>
      </div>

      <div class="container-done">
        <p>Done</p>
        <draggable item-key="id" @end="saveOrder" :list="todos.filter((x) => x.info == 3)"
          :group="{ name: 'people1', pull: true, put: true }" class="todo-done">
          <template #item="{ element }">
            <div style="margin-bottom: 10px;" :class="'random' + element.id">
              <q-card flat bordered class="my-card text-white list-group-item item"
                :class="changeColorDate(element.deadline) == 1 ? 'bg-info' : changeColorDate(element.deadline) == 2 ? 'bg-grey-6' : 'bg-secondary'">
                <q-card-section style="padding-top: 5px;padding-bottom: 2px;">
                  <div class="row items-center no-wrap">
                    <div class="col">
                      <div class="text-subtitle2">
                        <p>Deadline Task : {{ element.deadline }}</p>
                      </div>
                    </div>

                    <div class="col-auto">
                      <q-btn color="grey-7" round flat icon="more_vert">
                        <q-menu cover>
                          <q-list>
                            <q-item clickable @click="deleteList(element.id)">
                              <q-item-section>Remove Card</q-item-section>
                            </q-item>
                            <q-dialog v-if="element.id === indexToDelete && confirm" v-model="confirm" persistent>
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
                                      name="submit" @click="deleted(element.id)" class="btn btn-success">Remove</button>
                                    <button style="background: azure;cursor:pointer;" type="button"
                                      class="btn btn-default btn-close" v-close-popup>Cancel</button>
                                  </div>
                                </div>
                              </q-card>
                            </q-dialog>
                            <q-item clickable @click="setDate(element.id)">
                              <q-item-section>Set Deadline</q-item-section>
                            </q-item>
                            <q-dialog v-if="element.id === indexToSetDate && deadline" v-model="deadline">
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
                                  @click="saveDate(element.id)">Save
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
                  <input v-if="element.edited == true" type="text" class="text-subtitle2 edit-text" v-model="changeName">
                </q-card-section>

                <q-separator />

                <q-card-actions style="display: flex; justify-content: space-between;">
                  <div class="save-edit">
                    <q-btn flat @click="startEdit(element.id)"><i class="fas fa-edit"></i>
                      <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                        <strong>Edit</strong>
                      </q-tooltip></q-btn>
                    <q-btn :disabled="element.edited == false" flat @click="saveEdit(element.id)"><i
                        class="fas fa-check"></i>
                      <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                        <strong>Save</strong>
                      </q-tooltip>
                    </q-btn>
                  </div>
                  <q-btn @click="toggleStatus(element.id)">
                    <input type="checkbox" id="status" name="status" :checked="element.info === 3">
                    <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                      <strong>{{ element.info === 3 ? 'Not yet' : 'Done' }}</strong>
                    </q-tooltip>Done
                  </q-btn>
                </q-card-actions>
              </q-card>
            </div>
          </template>
        </draggable>
      </div>

      <div class="container-all">
        <p>All Data => {{ forText }}</p>
        <template v-for="element of valueFilter" :key="element.deadline">
          <div style="margin-bottom: 10px;">
            <q-card flat bordered class="my-card text-white list-group-item item"
              :class="changeColorDate(element.deadline) == 1 ? 'bg-info' : changeColorDate(element.deadline) == 2 ? 'bg-grey-6' : 'bg-secondary'">
              <q-card-section style="padding-top: 5px;padding-bottom: 2px;">
                <div class="row items-center no-wrap">
                  <div class="col">
                    <div class="text-subtitle2">
                      <p>Deadline Task : {{ element.deadline }}</p>
                    </div>
                  </div>

                  <div class="col-auto">
                    <q-btn color="grey-7" round flat icon="more_vert">
                      <q-menu cover>
                        <q-list>
                          <q-item clickable @click="deleteList(element.id)">
                            <q-item-section>Remove Card</q-item-section>
                          </q-item>
                          <q-dialog v-if="element.id === indexToDelete && confirm" v-model="confirm" persistent>
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
                                    name="submit" @click="deleted(element.id)" class="btn btn-success">Remove</button>
                                  <button style="background: azure;cursor:pointer;" type="button"
                                    class="btn btn-default btn-close" v-close-popup>Cancel</button>
                                </div>
                              </div>
                            </q-card>
                          </q-dialog>
                          <q-item clickable @click="setDate(element.id)">
                            <q-item-section>Set Deadline</q-item-section>
                          </q-item>
                          <q-dialog v-if="element.id === indexToSetDate && deadline" v-model="deadline">
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
                                @click="saveDate(element.id)">Save
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
                <input v-if="element.edited == true" type="text" class="text-subtitle2 edit-text" v-model="changeName">
              </q-card-section>

              <q-separator />

              <q-card-actions style="display: flex; justify-content: space-between;">
                <div class="save-edit">
                  <q-btn flat @click="startEdit(element.id)"><i class="fas fa-edit"></i>
                    <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                      <strong>Edit</strong>
                    </q-tooltip></q-btn>
                  <q-btn :disabled="element.edited == false" flat @click="saveEdit(element.id)"><i
                      class="fas fa-check"></i>
                    <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                      <strong>Save</strong>
                    </q-tooltip>
                  </q-btn>
                </div>
                <div
                  style="padding: 7px;border-radius: 2px;box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2), 0 2px 2px rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12);display: flex;align-items: center;">
                  <input @click="toggleStatus(element.id)" style="margin-right:5px;" type="checkbox"
                    :checked="element.info === 3" :id="'status_' + element.id" name="status">
                  <label :for="'status_' + element.id">Done</label>
                  <q-tooltip :for="'status_' + element.id" anchor="top middle" self="bottom middle" :offset="[10, 10]">
                    <strong>{{ element.info === 3 ? 'Not yet' : 'Done' }}</strong>
                  </q-tooltip>
                </div>
              </q-card-actions>
            </q-card>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import dayjs from 'dayjs';
import { Todo, ContainerType, ExtendedTodo } from './models';
import { useTodoStore } from 'src/stores/store';
import draggable from 'vuedraggable';

export default defineComponent({
  name: 'CardList',
  components: {
    draggable
  },
  data() {
    const id = Date.now();
    const todoStore = useTodoStore();
    const dayJS = dayjs;
    return {
      dayJS,
      dense: ref(false),
      teal: ref(true),
      id,
      todoStore,
      todo_list: ref<Array<Todo>>([]),
      todos: ref<Array<ExtendedTodo>>([]),
      blue: ref<Array<ExtendedTodo>>([]),
      grey: ref<Array<ExtendedTodo>>([]),
      green: ref<Array<ExtendedTodo>>([]),
      todo_input: ref(''),
      changeName: '',
      confirm: ref(false),
      firstDeadline: ref(false),
      deadline: ref(false),
      delete: ref(false),
      indexToDelete: 0,
      indexToSetDate: 0,
      indexToEdit: 0,
      task_date: ref(''),
      modalDateError: ref(false),
      valueFilter: ref<Array<ExtendedTodo>>([]),
      filteredOptions: [
        { id: 1, label: 'All' },
        { id: 2, label: 'Task List' },
        { id: 3, label: 'Doing List' },
        { id: 4, label: 'Done List' }
      ],
      forText: ref('All'),
    }
  },
  mounted() {
    this.todoStore.getTodoList();
    this.todo_list = this.todoStore.todoList;

    this.getExtendedTodo();
    this.getAllData();
  },
  methods: {
    dateSort() {
      let arr = this.valueFilter
      const n = arr.length;
      const today = dayjs().hour(0).minute(0).second(0).unix();
      const tomor = dayjs().add(2, 'day').hour(23).minute(59).second(59).unix();

      for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - 1 - i; j++) {
          const timestamp1 = dayjs(arr[j].deadline).unix();
          const timestamp2 = dayjs(arr[j + 1].deadline).unix();

          if (!(timestamp1 <= tomor && timestamp1 >= today) && (timestamp2 <= tomor && timestamp2 >= today)) {
            const temp = arr[j];
            arr[j] = arr[j + 1];
            arr[j + 1] = temp;
          }

          if ((timestamp1 <= tomor && timestamp1 >= today) && ((timestamp2 <= tomor && timestamp2 >= today) && timestamp2 < timestamp1)) {
            const temp = arr[j];
            arr[j] = arr[j + 1];
            arr[j + 1] = temp;
          }

          if ((timestamp1 > tomor) && (timestamp2 < today)) {
            const temp = arr[j];
            arr[j] = arr[j + 1];
            arr[j + 1] = temp;
          }

          if ((timestamp1 < today) && (timestamp2 < today && timestamp2 < timestamp1)) {
            const temp = arr[j];
            arr[j] = arr[j + 1];
            arr[j + 1] = temp;
          }

          if ((timestamp1 > tomor) && (timestamp2 > tomor && timestamp2 < timestamp1)) {
            const temp = arr[j];
            arr[j] = arr[j + 1];
            arr[j + 1] = temp;
          }
        }
      }

    },
    addList() {
      const existingDeadline = this.todo_list.find(data => data.deadline === this.task_date && this.task_date !== '');
      if (existingDeadline) {
        this.modalDateError = true;
      } else if (this.todo_input !== '' && !existingDeadline) {
        this.todo_list.push({
          id: this.id,
          name: this.todo_input,
          deadline: this.task_date,
          info: 1
        });
        this.getExtendedTodo();
        this.getAllData();
        this.task_date = '';
        this.id++;
        this.todo_input = '';
      }
      else {
        console.log('Empty input detected');
      }
    },
    changeColorDate(date: string) {
      const dayNow = dayjs().hour(0).minute(0).second(0).unix();
      let myday = dayjs(date).hour(0).minute(0).second(0).unix();

      let mydayStamp = dayjs(date).unix();
      const tomorrowStamp1 = dayjs().add(2, 'day').hour(23).minute(59).second(59).unix();

      if (myday >= dayNow && mydayStamp < tomorrowStamp1) {
        return 1;
      } else if (myday < dayNow && mydayStamp < tomorrowStamp1) {
        return 2;
      } else {
        return 3;
      }
    },
    getExtendedTodo() {
      this.todos = this.todo_list.map((todo: Todo) => {
        return { ...todo, edited: false };
      });
    },
    getAllValueFilter() {
      this.valueFilter = this.todo_list.map((todo: Todo) => {
        return { ...todo, edited: false };
      });
      this.dateSort();
    },
    getAllData() {
      this.valueFilter = this.todo_list.map((todo: Todo) => {
        return { ...todo, edited: false };
      });
      this.dateSort();
      this.getAllValueFilter();
    },
    getFilter() {
      if (this.forText == 'All') {
        this.getAllData();
      } else if (this.forText == 'Task List') {
        this.filters(1);
      } else if (this.forText == 'Doing List') {
        this.filters(2);
      } else if (this.forText == 'Done List') {
        this.filters(3);
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
    toggleStatus(id: number) {
      const items = this.todo_list.find(item => item.id === id);
      if (items) {
        this.getExtendedTodo();
        const item = this.todos.find(item => item.id === id);
        if (item) {
          if (item.info == 3) {
            item.info = 2;
            items.info = 2;
          } else {
            item.info = 3;
            items.info = 3;
          }
          items.info = item.info;
          this.todos.sort((a, b) => {
            return a.info === b.info ? 0 : a.info - b.info;
          });
          this.todo_list.sort((a, b) => {
            return a.info === b.info ? 0 : a.info - b.info;
          });
        }
      };
      this.getFilter();
    },
    deleteList(id: number) {
      this.indexToDelete = id;
      this.getExtendedTodo();
      const item = this.todos.find(item => item.id === id);
      if (item) {
        this.confirm = true;
      }
    },
    deleted(id: number) {
      const items = this.todo_list.find(item => item.id === id);
      if (items) {
        this.getExtendedTodo();
        const index = this.todos.findIndex(item => item.id === id);
        if (index !== -1) {
          this.todos.splice(index, 1);
          this.todo_list.splice(index, 1);
        }
      };
      this.getFilter();
    },
    startEdit(id: number) {
      this.getExtendedTodo();
      this.getFilter();
      const item = this.todos.find(item => item.id === id);
      if (item) {
        this.changeName = item.name;
        item.edited = true;
      }
      const items = this.valueFilter.find(items => items.id === id);
      if (items) {
        this.changeName = items.name;
        items.edited = true;
      }
    },
    saveEdit(id: number) {
      const items = this.todo_list.find(item => item.id === id);
      if (items) {
        this.getExtendedTodo();
        const item = this.todos.find(item => item.id === id);
        if (item) {
          if (item.edited = true) {
            item.edited = false;
            item.name = this.changeName;
          }
        }
        const value = this.valueFilter.find(value => value.id);
        if (value) {
          if (value.edited = true) {
            value.edited = false;
            value.name = this.changeName;
            items.name = value.name;
          }
        }
        this.getFilter();
      };
    },
    firstDate() {
      this.task_date = '';
      this.firstDeadline = true;
    },
    setDate(id: number) {
      this.indexToSetDate = id;
      const items = this.todo_list.find(item => item.id === id);
      if (items) {
        this.deadline = true;
        this.getExtendedTodo();
        const item = this.todos.find(item => item.id === id);
        if (item) {
          this.task_date = item.deadline != '' ? item.deadline : '';
        }
        this.getAllData();
        const value = this.valueFilter.find(value => value.id === id);
        if (value) {
          this.task_date = value.deadline != '' ? value.deadline : '';
        }
      };
    },
    saveFirstDate() {
      this.firstDeadline = false;
    },
    saveDate(id: number) {
      id = this.indexToSetDate;
      this.getExtendedTodo();
      this.getFilter();
      const existingDeadline = this.todos.find(data => data.deadline === this.task_date && this.task_date !== '');
      if (existingDeadline) {
        this.modalDateError = true;
      } else {
        const items = this.todo_list.find(item => item.id === id);
        if (items) {
          this.deadline = true;
          const item = this.todos.find(item => item.id === id);
          if (item) {
            item.deadline = this.task_date;
            items.deadline = item.deadline;
          }
          const value = this.valueFilter.find(value => value.id == id);
          if (value) {
            value.deadline = this.task_date;
            items.deadline = value.deadline;
          }
        };
        this.deadline = false;
      }
      this.getFilter();
    },
    saveOrder(container: ContainerType) {
      this.getExtendedTodo();
      this.getFilter();
      try {
        const newIndex = container.newIndex;
        const oldIndex = container.oldIndex;
        const itemValue = container.item;
        let item_id = parseInt(itemValue.classList.value.split('random')[1]);
        let temp = this.todos[this.todos.findIndex((x) => x.id == item_id)];
        let valueTodo = this.todo_list[this.todo_list.findIndex((x) => x.id == item_id)];
        if (container.to.classList.value.includes('todo-done')) {
          temp.info = 3;
          valueTodo.info = 3;
          this.todos.sort((a, b) => {
            return a.info === b.info ? 0 : b.info - a.info;
          });
          this.todo_list.sort((a, b) => {
            return a.info === b.info ? 0 : b.info - a.info;
          });
        } else if (container.to.classList.value.includes('todo-doing')) {
          temp.info = 2;
          valueTodo.info = 2;
          this.todos.sort((a, b) => {
            if (a.info === b.info) {
              return 0;
            } else if (a.info === 2) {
              return -1;
            } else if (b.info === 2) {
              return 1;
            } else {
              return b.info - a.info;
            }
          });
          this.todo_list.sort((a, b) => {
            if (a.info === b.info) {
              return 0;
            } else if (a.info === 2) {
              return -1;
            } else if (b.info === 2) {
              return 1;
            } else {
              return b.info - a.info;
            }
          });
        } else if (container.to.classList.value.includes('todo-start')) {
          temp.info = 1;
          valueTodo.info = 1;
          this.todos.sort((a, b) => {
            return b.info === a.info ? 0 : a.info - b.info;
          });
          this.todo_list.sort((a, b) => {
            return b.info === a.info ? 0 : a.info - b.info;
          });
        }
        const itemToMove = this.todos[oldIndex];
        const itemToMove1 = this.todo_list[oldIndex];
        this.todos.splice(oldIndex, 1);
        this.todo_list.splice(oldIndex, 1);
        this.todos.splice(newIndex, 0, itemToMove);
        this.todo_list.splice(newIndex, 0, itemToMove1);
      } catch (error) {
        console.log(error);
      }
    },
    filters(info: number) {
      this.valueFilter = this.todo_list
        .map((todo: Todo) => {
          return { ...todo, edited: false };
        })
        .filter((x) => x.info === info);
      this.dateSort();
    },
    filtered(event: MouseEvent) {
      const selectElement = event.target as HTMLSelectElement;
      const selectedStatus = selectElement.value;
      this.forText = selectedStatus;
      this.getFilter();
    }
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
.container-doing,
.container-all {
  border: 1px solid rgba(0, 0, 0, 0.24);
  width: 250px;
  padding: 10px;
}

.container-done,
.container-doing,
.container-all {
  margin-left: 10px;
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
