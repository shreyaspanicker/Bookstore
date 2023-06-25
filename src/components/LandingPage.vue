<template>
  <div class="content">
    <nav>
      <header-section :header="header" />
      <search-box />
    </nav>
    <display-books />
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
      books: [],
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
};
</script>
