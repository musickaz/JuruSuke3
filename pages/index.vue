<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <v-card class="mx-auto" max-width="600">
        <v-toolbar dense color="deep-purple">
          <v-card-title>Setup Event イベント登録</v-card-title>
        </v-toolbar>
        <v-card-subtitle class="pb-0">
          You can input more details after Setup.
          イベント詳細は登録後に入力できます。
        </v-card-subtitle>

        <v-card-text class="text--primary">
          <form @submit.prevent="onCreateEvent">
            <v-text-field
              id="title"
              v-model="title"
              class="secondary--text"
              name="title"
              label="Event Tiltle"
              type="text"
              required
            />
            <!-- 日付入力 -->
            <datetime
              v-model="datetime"
              name="datetime"
              type="datetime"
              label="Event date time"
              placeholder="Event date time"
              format="yyyy-MM-dd HH:mm"
              :minute-step="5"
              required
            />

            <!-- <hr class="my-3"> -->
            <!-- コピー元の入力事項 この入力事項は後から編集させたい-->
            <!-- <v-text-field
                name="location"
                label="Location"
                id="location"
                type="text"
                v-model="location"
                required
              ></v-text-field>

              <v-btn raised class="primary" @click="onPickFile">Upload image File</v-btn>
              <input
                type="file"
                style="display:none"
                ref="fileInput"
                accept="image/*"
                @change="onFilePicked"
              >

              <img :src="imageUrl" height="200px">

              <v-textarea
                label="Description"
                name="description"
                id="description"
                v-model="description"
                type="text"
                required
              ></v-textarea>

              <h3>Choose Date and Time</h3>

              <v-date-picker v-model="date" :reactive="true" locale="en-us" :first-day-of-week="1"></v-date-picker>

              <v-time-picker v-model="time" format="24hr"></v-time-picker> -->

            <v-card-actions>
              <v-spacer />
              <v-btn type="submit" color="success" :disabled="!formIsVallide">
                Set Event
              </v-btn>
            </v-card-actions>
          </form>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import Vue from "vue"
import { Datetime } from "vue-datetime"
// You need a specific loader for CSS files
import "vue-datetime/dist/vue-datetime.css"

Vue.use(Datetime)

// 以下コピー元から直接貼り付け修正お願いします。
export default {
  components: {
    datetime: Datetime
  },
  data() {
    return {
      title: "",
      datetime: ""
      // description: "",
      // imageUrl: "",
      // location: "",
      // image: null,
      // DateTime: new DateTime().toISOString().substr(0, 10),
      // time: new DateTime()
    }
  },
  computed: {
    formIsVallide() {
      return (
        this.title !== "" && this.datetime !== ""
        // this.location !== "" &&
        // this.description !== "" &&
        // this.imageUrl !== ""
      )
    },
    // この日付取得をformat="yyyy-MM-dd HH:mm"で受け取り,Vue cal上の表示起点としたい
    submittableDateTime() {
      const DateTime = new DateTime(this.DateTime)
      if (typeof this.time === "string") {
        let hours = this.time.match(/^(\d+)/)[1]
        let minutes = this.time.match(/:(\d+)/)[1]
        DateTime.setHours(hours)
        DateTime.setMinutes(minutes)
      } else {
        DateTime.setHours(this.time.getHours())
        DateTime.setMinutes(this.time.getMinutes())
      }
      return DateTime
    }
  },
  methods: {
    onCreateEvent() {
      if (!this.formIsVallide) {
        return
      }
      if (!this.image) {
        return
      }
      const EventData = {
        title: this.title,
        location: this.location,
        description: this.description,
        imageUrl: this.imageUrl,
        image: this.image,
        DateTime: this.submittableDateTime
      }
      this.$store.dispatch("createEvent", EventData)
      this.$router.push("/TimeTable")
      console.log("push")
    },
    onPickFile() {
      this.$refs.fileInput.click()
    },
    onFilePicked(event) {
      const files = event.target.files
      let fileName = files[0].name
      if (fileName.lastIndexOf(".") <= 0) {
        return alert("Please add a valid file!")
      }
      const fileReader = new FileReader()
      fileReader.addEventListener("load", () => {
        this.imageUrl = fileReader.result
        console.log(this.imageUrl)
      })
      fileReader.readAsDataURL(files[0])
      this.image = files[0]
    }
  }
}
</script>
