<template>
  <div class="header">
    <div class="title">{{ header.title }}</div>
    <div class="tagline">{{ header.tagline }}</div>
  </div>
</template>

<script>
export default {
  name: "HeaderSection",
  props: {
    header: Object,
  },
};
</script>

<style lang="scss" scoped>
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
