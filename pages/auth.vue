<template>
  <section class="container">
    <div>
      <h1 class="title">
        {{ name }}
      </h1>
      <h2 class="subtitle">
        Nuxt.jsとFirebaseを使って簡単なWebサービスを作るテストです。
      </h2>

      <div class="links">
        <Home v-if="!isLogin" />
        <Mypage v-if="isLogin" :user="userData" />
      </div>
    </div>
  </section>
</template>

<script>
import firebase from "@/plugins/firebase"
import Home from "~/components/Home.vue"
import Mypage from "~/components/Mypage.vue"
export default {
  components: {
    Home,
    Mypage
  },
  fetch() {
    // `fetch` メソッドはページの描画前にストアを満たすために使用されます
  },
  asyncData(context) {
    console.log({ context })
    // コンポーネントをロードする前に毎回呼び出されます
    return { name: "Hello, World！！", isLogin: false, userData: null }
  },
  mounted: function() {
    firebase.auth().onAuthStateChanged(user => {
      console.log(user)
      if (user) {
        this.isLogin = true
        this.userData = user
      } else {
        this.isLogin = false
        this.userData = null
      }
    })
  },
  methods: {
    googleLogin: function() {
      firebase.auth().signInWithRedirect(new firebase.auth.GoogleAuthProvider())
    }
  }
}
</script>

<style>
.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; /* 1 */
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}
.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}
.links {
  padding-top: 15px;
}
</style>
