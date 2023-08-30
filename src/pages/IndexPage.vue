<template>
  <q-page class="row items-center justify-evenly">
    <CardList />
  </q-page>
</template>

<script lang="ts">
import CardList from 'components/CardList.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'IndexPage',
  components: { CardList },
});
</script>
