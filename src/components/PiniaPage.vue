<template>
  <div></div>
  <!-- <div> {{ todo }}</div>
  <div>
    {{ mytext }}
  </div>

  <input type="text" v-model="mytext">
  <button @click="save">save</button> -->
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from 'src/stores/store1';

export default defineComponent({
  name: 'PiniaPage',
  data() {
    const todoStore = useStore();
    const todo = todoStore.someState;

    return {
      todo,
      mytext: ''
    }
  },
  methods: {
    save() {
      this.todo = this.mytext;
    }
  }

})

</script>
