<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
  mounted() {
    document.title = 'To Do List App';
  },
})
</script>
