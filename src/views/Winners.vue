<template>
  <div class="container">
    <h1 class="text-[20px] mt-10 mb-4">Today's winners:</h1>
    <div v-if="winnersArrayToShow.length" class="mb-10">
      <p v-for="(name, index) in winnersArray" :key="index">{{ name }}</p>
    </div>
    <div v-else class="mb-10">
      <p>No winners yet</p>
    </div>
    <div class="flex justify-center">
      <button @click="clearWinners" class="border-2 px-2 py-1 mb-4">
        Clear winners
      </button>
    </div>
    <router-link to="/" class="text-blue-500">Back to home</router-link>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";

export default {
  name: "Winners",
  props: {
    winnersArray: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    const localWinnersArray = ref([]);

    onMounted(() => {
      if (props.winnersArray.length) {
        localWinnersArray.value = props.winnersArray;
      } else {
        const savedWinners = localStorage.getItem("winnersArray");
        if (savedWinners) {
          localWinnersArray.value = JSON.parse(savedWinners);
        }
      }
    });

    const winnersArrayToShow = computed(() => localWinnersArray.value);

    const clearWinners = () => {
      localWinnersArray.value = [];
      localStorage.setItem("winnersArray", JSON.stringify([]));
    };

    return {
      winnersArrayToShow,
      clearWinners,
    };
  },
};
</script>

<style scoped lang="scss">
.container {
  width: 50%;
}
</style>
