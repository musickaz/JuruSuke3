<template>
  <v-content align-center justify-center>
    <v-parallax
      src="https://deshinon.com/wp-content/uploads/2019/03/4gmq4-9yj4a.gif"
      height="800"
      width="auto"
    >
      <v-layout column align-center justify-center class="dark--text">
        <img src="/Js3logoSmall.png" alt="JuruSuke3" height="100" />
        <NuxtLink to="/" class="black--text mb-2 display-1 text-center">
          <h1>Sorry, I have to go gig now. please come and see again.</h1>
          <h1 v-if="error.statusCode === 404">
            {{ pageNotFound }}
          </h1>
          <h1 v-else>
            {{ otherError }}
          </h1>
        </NuxtLink>
      </v-layout>
    </v-parallax>
  </v-content>
</template>

<script>
export default {
  layout: "empty",
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      pageNotFound: "404 Not Found",
      otherError: "An error occurred"
    }
  },
  head() {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title
    }
  }
}
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
