<template>
  <div>
    <navbar></navbar>
    <app-main></app-main>
  </div>
</template>

<script>
  import {AppMain, Navbar} from './components'

  export default {
    name: "Layout",
    components: {
      Navbar,
      AppMain,
    }
  }
</script>

<style scoped>

</style>
