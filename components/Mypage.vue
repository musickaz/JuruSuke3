<template>
  <div id="mypage">
    <span>こんにちは, {{ user.displayName }}さん</span>
    <p>
      <button @click="logout">
        ログアウト
      </button>
    </p>
    <h2>あなたのノート</h2>
    <p>{{ note_content }}</p>
    <div v-for="(note, index) in notes" id="notesIndex" :key="index">
      <p class="noteContent">
        {{ note.content }}
      </p>
    </div>
    <p><textarea v-model="note_content" /></p>
    <p>
      <button @click="saveContent(note_content)">
        ノートを保存する
      </button>
    </p>
  </div>
</template>

<script>
import firebase from "@/plugins/firebase"
export default {
  name: "Mypage",
  props: ["user"],
  data(context) {
    console.log({ context })
    // コンポーネントをロードする前に毎回呼び出されます
    return { note_content: "", notes: [] }
  },
  created: function() {
    firebase
      .database()
      .ref("notes/" + this.user.uid)
      .once("value")
      .then(result => {
        if (result.val()) {
          this.notes = result.val()
        }
      })
  },
  methods: {
    logout: function() {
      firebase.auth().signOut()
    },
    saveContent: function(value) {
      // 新しいテキストのためのキーを取得
      var newNoteKey = firebase
        .database()
        .ref()
        .child("notes")
        .push().key
      firebase
        .database()
        .ref("notes/" + this.user.uid + "/" + newNoteKey)
        .set({ content: value })
    }
  }
}
</script>
