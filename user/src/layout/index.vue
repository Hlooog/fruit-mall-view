<template>
  <div>
    <navbar></navbar>
    <app-main></app-main>
    <navigation></navigation>
  </div>
</template>

<script>
  import {AppMain, Navbar} from './components'
  import Navigation from "./components/Navigation";

  export default {
    name: "Layout",
    components: {
      Navigation,
      Navbar,
      AppMain,
    }
  }
</script>

<style scoped>

</style>
