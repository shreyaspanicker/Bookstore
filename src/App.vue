<template>
  <div id="app">
    <landing-page
      :header="header"
      @stopPageScroll="settings.suppressScrollY = true"
      @startPageScroll="settings.suppressScrollY = false"
    />
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
* {
  box-sizing: border-box;
}

html,
body {
  overflow-x: clip;
  height: 100%;
  width: 100%;
  margin: 0px;
  padding: 0px;
  font-family: "Fira Sans", sans-serif;
  &.modal-active {
    overflow: hidden;
  }
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  nav {
    padding: 60px;
  }
}

@media (max-width: 767px) {
  /* CSS styles for small screens */
  #app {
    nav {
      padding: 20px;
    }
  }
}
</style>
