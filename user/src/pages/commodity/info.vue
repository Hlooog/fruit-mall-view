<template>
  <div>

  </div>
</template>

<script>
  export default {
    name: "info",
    created() {
      this.id = this.$route.query.id
    },
    data() {
      return {
        id: 0
      }
    },
    method: {},
  }
</script>

<style scoped>

</style>
