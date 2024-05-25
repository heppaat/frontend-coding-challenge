<template>
  <div class="container">
    <form
      class="flex flex-col items-center gap-4 mt-10"
      @submit.prevent="handleSubmit"
    >
      <input
        class="border-2"
        type="text"
        v-model="inputName"
        placeholder="Enter name..."
      />
      <button class="border-2 px-2 py-1" type="submit">Check</button>
    </form>

    <p v-if="error" class="flex mt-10">Error: {{ error }}</p>

    <div v-if="result" class="flex justify-center">
      <name-search-response
        :result="result"
        :reject="handleReject"
        :accept="handleAccept"
        :isDuplicate="isDuplicate"
      ></name-search-response>
    </div>

    <button
      @click="toggleWinnersArrayVisibility"
      class="border-2 px-2 py-1 mt-10"
    >
      {{ showWinners ? "Hide" : "Show" }} Winners
    </button>

    <div
      v-if="showWinners"
      class="flex flex-col bg-[#f4f4f5] p-4 rounded-lg mt-10 mx-5"
    >
      <h1 class="text-[20px] mb-5">Today's winners:</h1>
      <p v-for="(name, index) in winnersArray" :key="index">{{ name }}</p>
    </div>
  </div>
</template>

<script>
import NameSearchResponse from "@/components/NameSearchResponse.vue";
import { getAll } from "../api/peopleApi";
import { ref, watch } from "vue";
import { PeopleSchema } from "../modell";

export default {
  name: "NameSearcher",
  components: {
    NameSearchResponse,
  },
  setup() {
    const inputName = ref("");
    const result = ref(null);
    const error = ref("");
    const winnersArray = ref([]);
    const isDuplicate = ref(false);
    const accepted = ref(false);
    const showWinners = ref(false);

    watch(accepted, (newVal) => {
      if (newVal) {
        inputName.value = "";
        accepted.value = false;
      }
    });

    const handleSubmit = async () => {
      await checkName();
      console.log(result.value);
      console.log(isDuplicate.value);
    };

    const isLucky = (input, array) => {
      const lowerCaseInputName = input.toLowerCase().trim();
      return array.some(
        (person) => person.name.toLowerCase() === lowerCaseInputName
      );
    };

    const checkName = async () => {
      error.value = "";
      try {
        const response = await getAll();
        const parsedResult = PeopleSchema.safeParse(response);
        if (!parsedResult.success) {
          error.value = "Failed to parse data";
          return;
        }

        const peopleArray = parsedResult.data;

        const luckyOrNot = isLucky(inputName.value, peopleArray);

        const formattedInputName =
          inputName.value.trim().charAt(0).toUpperCase() +
          inputName.value.trim().slice(1).toLowerCase();

        result.value = {
          name: formattedInputName,
          isLucky: luckyOrNot,
        };

        isDuplicate.value = winnersArray.value.includes(formattedInputName);
      } catch (err) {
        error.value = "An error occurred while fetching data";
        console.error(error);
      }
    };

    const handleReject = () => {
      result.value = null;
    };

    const handleAccept = () => {
      accepted.value = true;
      if (result.value && !isDuplicate.value) {
        winnersArray.value.push(result.value.name);
      }
      result.value = null;
    };

    const toggleWinnersArrayVisibility = () => {
      showWinners.value = !showWinners.value;
    };

    return {
      inputName,
      result,
      error,
      winnersArray,
      isDuplicate,
      accepted,
      handleSubmit,
      handleReject,
      handleAccept,
      showWinners,
      toggleWinnersArrayVisibility,
    };
  },
};
</script>

<style scoped lang="scss">
.container {
  width: 50%;
}
</style>
