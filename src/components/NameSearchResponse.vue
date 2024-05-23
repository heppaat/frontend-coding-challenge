<template>
  <div class="container">
    <div
      v-if="result.isLucky && !isDuplicate"
      class="flex flex-col items-center gap-4 mt-10 px-5"
    >
      <h1>
        Congratulations, {{ result.name }} is a lucky name! You've won a prize.
        Will you accept it?
      </h1>
      <button @click="accept" class="border-2 px-2 py-1">Accept</button>
      <button @click="reject" class="border-2 px-2 py-1">Reject</button>
    </div>

    <div v-if="isDuplicate" class="flex flex-col items-center gap-4 mt-10 px-5">
      <h1>
        I'm sorry, {{ result.name }} has already received their prize today!
      </h1>
    </div>

    <div
      v-if="!result.isLucky"
      class="flex flex-col items-center gap-4 mt-10 px-5"
    >
      <h1>
        I'm sorry, {{ result.name }} is not in today's list of lucky names.
      </h1>
      <button @click="reject" class="border-2 px-2 py-1">Ok</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "NameSearchResponse",
  props: {
    result: {
      type: Object,
      required: true,
    },
    reject: {
      type: Function,
      required: true,
    },
    accept: {
      type: Function,
      required: true,
    },
    isDuplicate: {
      type: Boolean,
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
