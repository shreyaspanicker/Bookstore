<template>
  <div class="search-box">
    <input
      type="text"
      placeholder="Type in book or author name..."
      v-model="userInput"
      @keydown.enter="searchForBooks"
      @keydown.esc="clearSearch"
    />
    <span class="logo" @click="searchForBooks"
      ><uil-search-alt size="30px"
    /></span>
  </div>
</template>

<script>
import { UilSearchAlt } from "@iconscout/vue-unicons";

export default {
  name: "SearchBox",
  data() {
    return {
      userInput: "",
    };
  },
  components: {
    UilSearchAlt,
  },
  methods: {
    clearSearch() {
      this.userInput = "";
      this.$emit("clear");
    },
    searchForBooks() {
      this.$emit("searchedWith", this.userInput);
    },
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
  .logo {
    cursor: pointer;
    display: flex;
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
