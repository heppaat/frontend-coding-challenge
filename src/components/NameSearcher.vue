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
        @input="validateInput"
        placeholder="Enter name..."
      />
      <button
        class="border-2 px-2 py-1 mb-5 disabled:opacity-50 disabled:cursor-not-allowed"
        type="submit"
        :disabled="inputError !== '' || winnersArray.length >= 10"
      >
        Check
      </button>
      <p v-if="inputError" class="text-red-500">{{ inputError }}</p>
    </form>

    <p v-if="error" class="flex mt-10 text-red-500">Error: {{ error }}</p>
    <p v-if="previousDayError" class="flex mt-10 text-red-500">
      Error: {{ previousDayError }}
    </p>

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

    <div class="flex justify-center">
      <button @click="nextDay" class="border-2 px-2 py-1 mt-4">Next day</button>
    </div>

    <div class="flex justify-center">
      <button @click="clearPreviousDaysWinners" class="border-2 px-2 py-1 mt-4">
        Clear Previous Days
      </button>
    </div>

    <router-link
      :to="{
        name: 'Winners',
        query: { winners: JSON.stringify(winnersArray) },
      }"
      class="flex justify-center text-blue-500 mt-4"
      >Go to winner's page</router-link
    >
  </div>
</template>

<script>
import NameSearchResponse from "@/components/NameSearchResponse.vue";
import { getAll } from "../api/peopleApi";
import { onMounted, ref, watch } from "vue";
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
    const previousDayError = ref("");
    const winnersArray = ref([]);
    const isDuplicate = ref(false);
    const accepted = ref(false);
    const showWinners = ref(false);
    const inputError = ref("");
    const currentDay = ref(1);
    const previousDaysWinners = ref([]);

    onMounted(() => {
      const savedWinners = localStorage.getItem("winnersArray");
      const savedCurrentDay = localStorage.getItem("currentDay");
      const savedPreviousDaysWinners = localStorage.getItem(
        "previousDaysWinners"
      );
      if (savedWinners) {
        winnersArray.value = JSON.parse(savedWinners);
      }
      if (savedCurrentDay) {
        currentDay.value = JSON.parse(savedCurrentDay);
      }
      if (savedPreviousDaysWinners) {
        previousDaysWinners.value = JSON.parse(savedPreviousDaysWinners);
      }
    });

    watch(
      winnersArray,
      (newVal) => {
        localStorage.setItem("winnersArray", JSON.stringify(newVal));
      },
      { deep: true }
    );

    watch(currentDay, (newVal) => {
      localStorage.setItem("currentDay", JSON.stringify(newVal));
    });

    watch(
      previousDaysWinners,
      (newVal) => {
        localStorage.setItem("previousDaysWinners", JSON.stringify(newVal));
      },
      { deep: true }
    );

    watch(accepted, (newVal) => {
      if (newVal) {
        inputName.value = "";
        accepted.value = false;
      }
    });

    const handleSubmit = async () => {
      await checkName();
    };

    const isLucky = (input, array) => {
      const lowerCaseInputName = input.toLowerCase().trim();
      return array.some(
        (person) => person.name.toLowerCase() === lowerCaseInputName
      );
    };

    const validateInput = () => {
      const value = inputName.value.trim();
      if (!value.match(/^[a-zA-Z\s]*$/)) {
        inputError.value = "Only letters and spaces are allowed";
      } else if (value.length <= 2) {
        inputError.value = "Name must be at least 2 characters long";
      } else {
        inputError.value = "";
      }
    };

    const checkName = async () => {
      error.value = "";
      previousDayError.value = "";
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

        if (previousDaysWinners.value.includes(formattedInputName)) {
          previousDayError.value = `${formattedInputName} was already a winner on a previous day`;
          result.value = null;
        } else {
          isDuplicate.value = winnersArray.value.includes(formattedInputName);
        }
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
      if (
        result.value &&
        !isDuplicate.value &&
        winnersArray.value.length < 10
      ) {
        winnersArray.value.push(result.value.name);
      }
      result.value = null;
    };

    const toggleWinnersArrayVisibility = () => {
      showWinners.value = !showWinners.value;
    };

    const nextDay = () => {
      previousDaysWinners.value.push(...winnersArray.value);
      winnersArray.value = [];
      currentDay.value += 1;
    };

    const clearPreviousDaysWinners = () => {
      previousDaysWinners.value = [];
      localStorage.setItem("previousDaysWinners", JSON.stringify([]));
    };

    return {
      inputName,
      result,
      error,
      previousDayError,
      winnersArray,
      isDuplicate,
      accepted,
      handleSubmit,
      handleReject,
      handleAccept,
      showWinners,
      toggleWinnersArrayVisibility,
      inputError,
      validateInput,
      nextDay,
      currentDay,
      clearPreviousDaysWinners,
    };
  },
};
</script>

<style scoped lang="scss">
.container {
  width: 50%;
}
</style>
