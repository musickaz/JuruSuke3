<template>
  <div class="container">
    <Calendar />
  </div>
</template>

<script>
import Calendar from "~/components/Calendar.vue"
export default {
  components: {
    Calendar
  }
}
</script>

<style>
.container {
  margin-top: 50px;
}
</style>
