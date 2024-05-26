<template>
  <div class="container">
    <h1 class="text-[20px] mt-10 mb-4">Today's winners:</h1>
    <div v-if="winnersArray.length" class="mb-10">
      <p v-for="(name, index) in winnersArray" :key="index">{{ name }}</p>
    </div>
    <div v-else class="mb-10">
      <p>No winners yet</p>
    </div>
    <router-link to="/" class="text-blue-500">Back to home</router-link>
  </div>
</template>

<script>
export default {
  name: "Winners",
  props: {
    winnersArray: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped lang="scss">
.container {
  width: 50%;
}
</style>
