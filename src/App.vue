<template>
  <div id="app">
    <landing-page :header="header" />
  </div>
</template>

<script>
import LandingPage from "./components/LandingPage.vue";

export default {
  name: "App",
  components: {
    LandingPage,
  },
  computed: {
    header() {
      return {
        title: this.$store.state.header.title,
        tagline: this.$store.state.header.tagline,
      };
    },
  },
};
</script>

<style lang="scss">
html {
  height: 100%;
  width: 100%;
  font-family: "Fira Sans", sans-serif;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  padding: 60px;
}

@media (max-width: 767px) {
  /* CSS styles for small screens */
  #app {
    padding: 30px;
  }
}
</style>
