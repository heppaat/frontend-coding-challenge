<template>
  <div class="container">
    <form @submit.prevent="handleSubmit">
      <input
        class="border-2"
        type="text"
        v-model="inputName"
        placeholder="Enter name..."
      />
      <button type="submit">Check</button>
    </form>
  </div>
  <name-search-response></name-search-response>
</template>

<script>
import NameSearchResponse from "@/components/NameSearchResponse.vue";
import { getAll } from "../api/peopleApi";

export default {
  name: "NameSearcher",
  components: {
    NameSearchResponse,
  },
  data() {
    return {
      inputName: "",
      result: {
        name: "",
        isLucky: null,
      },
      error: "",
      winnersArray: [],
      isDuplicate: false,
      accepted: false,
    };
  },
  watch: {
    accepted(newVal) {
      if (newVal) {
        this.inputName = "";
        this.accepted = false;
      }
    },
  },
  methods: {
    async handleSubmit() {
      await this.checkName();
      console.log(this.result);
    },
    isLucky(input, array) {
      const lowerCaseInputName = input.toLowerCase().trim();
      return array.some(
        (person) => person.name.toLowerCase() === lowerCaseInputName
      );
    },
    async checkName() {
      this.error = "";
      try {
        const response = await getAll();

        const luckyOrNot = this.isLucky(this.inputName, response);

        const formattedInputName =
          this.inputName.trim().charAt(0).toUpperCase() +
          this.inputName.trim().slice(1).toLowerCase();

        this.result = {
          name: formattedInputName,
          isLucky: luckyOrNot,
        };

        this.isDuplicate = this.winnersArray.includes(formattedInputName);
      } catch (error) {
        this.error = "An error occurred while fetching data";
        console.log(this.error);
      }
    },

    handleReject() {
      this.result = null;
    },
    handleAccept() {
      this.accepted = true;
      if (this.result && !this.isDuplicate) {
        this.winnersArray.push(this.result.name);
      }
      this.result = null;
    },
  },
};
</script>

<style scoped lang="scss">
.container {
  width: 50%;
}
</style>
