<template>
  <div class="my-content">

    <div class="container">
      <tempate v-for="(data, index) of cardList" :key="index">
        <div class="card-list">
          <div style="display: flex;">
            <p>{{ data.name }}</p>
            <i class="fas fa-edit"></i>
          </div>
          <q-input filled bottom-slots v-model="todo_input" label="Add a card" :dense="dense">
            <template v-slot:append>
              <q-btn round dense flat icon="event" />
              <q-btn @click="addCard" round dense flat icon="add" />
            </template>
          </q-input>
          <template v-if="data.input.length !== 0">
            <q-card flat bordered class="my-card" :class="$q.dark.isActive ? 'bg-grey-4' : 'bg-grey-6'">
              <q-card-section>
                <div class="row items-center no-wrap">
                  <div class="col">
                    <div class="text-h6">Our Planet</div>
                    <div class="text-subtitle2">by John Doe</div>
                  </div>

                  <div class="col-auto">
                    <q-btn color="grey-7" round flat icon="more_vert">
                      <q-menu cover auto-close>
                        <q-list>
                          <q-item clickable>
                            <q-item-section>Remove Card</q-item-section>
                          </q-item>
                          <q-item clickable>
                            <q-item-section>Send Feedback</q-item-section>
                          </q-item>
                          <q-item clickable>
                            <q-item-section>Share</q-item-section>
                          </q-item>
                        </q-list>
                      </q-menu>
                    </q-btn>
                  </div>
                </div>
              </q-card-section>

              <q-card-section>
                {{ lorem }}
              </q-card-section>

              <q-separator />

              <q-card-actions>
                <q-btn flat>Action 1</q-btn>
                <q-btn flat>Action 2</q-btn>
              </q-card-actions>
            </q-card>
          </template>
        </div>
      </tempate>

      <div class="card-input" style="margin-left: 10px;">
        <q-input filled bottom-slots v-model="card_input" :label="cardList.length > 0 ? 'Add another list' : 'Add list'"
          :dense="dense">
          <template v-slot:append>
            <q-btn @click="addList" round dense flat icon="add" />
          </template>
        </q-input>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { Cardlist } from '../components/models';

export default defineComponent({
  name: 'CardList',
  components: {
    // draggable
  },
  data() {
    const cardId = Date.now();
    return {
      cardList: ref<Array<Cardlist>>([]),
      card_input: ref(''),
      todo_input: ref(''),
      cardId,
      ph: ref(''),
      dense: ref(false),
      lorem: ''
    }
  },
  methods: {
    addList() {
      this.cardList.push({
        id: this.cardId,
        name: this.card_input,
        input: [{
          id: '',
          name: '',
          status: false,
          deadline: '',
          info: ''
        }]
      });
      this.cardId++;
      this.card_input = '';
    },
    addCard() {
      this.card_input
    }

  }

})
</script>

<style scoped>
.container {
  display: flex;
}

.card-list {
  border: 1px solid rgba(0, 0, 0, 0.24);
  width: 250px;
  padding: 10px;
  margin-left: 10px;
}
</style>
