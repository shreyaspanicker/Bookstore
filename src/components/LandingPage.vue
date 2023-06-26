<template>
  <div class="content">
    <nav>
      <header-section :header="header" />
      <search-box @clear="isCleared = true" @searchedWith="searchFor" />
    </nav>
    <display-books :searchedQuery="searchedQuery" :isCleared="isCleared" />
  </div>
</template>

<script>
import HeaderSection from "./HeaderSection.vue";
import SearchBox from "./SearchBox.vue";
import DisplayBooks from "./DisplayBooks.vue";

export default {
  name: "LandingPage",
  data() {
    return {
      isCleared: true,
      searchedQuery: "",
    };
  },
  computed: {},
  components: {
    SearchBox,
    HeaderSection,
    DisplayBooks,
  },
  props: {
    header: Object,
  },
  methods: {
    searchFor(value) {
      this.searchedQuery = value;
    },
  },
};
</script>
