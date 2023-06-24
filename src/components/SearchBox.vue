<template>
  <div class="search-box">
    <input
      type="text"
      placeholder="Type in book or author name..."
      v-model="userInput"
      @keydown="handleKeyDown"
    />
    <uil-arrow-circle-right size="30px" class="logo" @click="searchBooks" />
  </div>
</template>

<script>
import { UilArrowCircleRight } from "@iconscout/vue-unicons";

export default {
  name: "SearchBox",
  data() {
    return {
      userInput: "",
    };
  },
  components: {
    UilArrowCircleRight,
  },
  methods: {
    searchBooks() {},
    handleKeyDown() {},
  },
};
</script>

<style scoped lang="scss">
.search-box {
  margin-top: 30px;
  display: flex;
  input {
    width: 280px;
    border: none;
    padding: 5px 10px 5px 0px;
    outline: none;
    border-bottom: 1px solid #2c3e50;
    font-family: "Fira Sans", sans-serif;
    font-size: 16px;
  }
}

@media (max-width: 767px) {
  /* CSS styles for small screens */
  .search-box {
    input {
      width: 75%;
      min-width: 230px;
    }
  }
}
</style>
