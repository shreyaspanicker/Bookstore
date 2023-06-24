<template>
  <div class="content">
    <div class="header">
      <div class="title">{{ title }}</div>
      <div class="tagline">A store you can't afford to miss</div>
    </div>
    <search-box />

    <div class="display-books"></div>
  </div>
</template>

<script>
import SearchBox from "./SearchBox.vue";
export default {
  name: "LandingPage",
  data() {
    return {
      books: [],
    };
  },
  components: {
    SearchBox,
  },
  props: {
    title: String,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.content {
  .header {
    .title {
      font-size: 25px;
    }

    .tagline {
      margin-top: 15px;
    }
  }
}
</style>
