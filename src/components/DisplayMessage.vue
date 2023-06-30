<template>
  <div class="display-message">
    <div v-if="isLoaded && !message">
      Showing all the books<span v-if="queryDisplay">{{ queryDisplay }}</span
      >:
    </div>
    <div v-if="message">{{ message }}</div>
    <hr />
  </div>
</template>

<script>
export default {
  name: "DisplayMessage",
  props: {
    queryDisplay: String,
    isLoaded: Number,
    message: String,
  },
};
</script>

<style scoped lang="scss">
hr {
  border: 0;
  height: 0;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
}
.display-message {
  height: 40px;
  width: 100%;
  padding: 0px 60px;
}

@media (max-width: 767px) {
  /* CSS styles for small screens */
  .display-message {
    padding: 0px 30px;
  }
}
</style>
