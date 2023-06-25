<template>
  <div class="content">
    <header-section :header="header" />
    <search-box />

    <div class="display-books"></div>
  </div>
</template>

<script>
import HeaderSection from "./HeaderSection.vue";
import SearchBox from "./SearchBox.vue";

export default {
  name: "LandingPage",
  data() {
    return {
      books: [],
    };
  },
  computed: {},
  components: {
    SearchBox,
    HeaderSection,
  },
  props: {
    header: String,
  },
};
</script>
