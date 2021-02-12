<template>
  <div>
    {{ids}}
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  export default {
    name: "index",
    computed: {
      ...mapGetters([
        'ids'
      ])
    }
  }
</script>

<style scoped>

</style>
