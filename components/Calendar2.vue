<template>
  <v-layout column justify-center align-center>
    <v-card class="mx-auto" width="600" height="600">
      <v-toolbar dense color="gray">
        <v-card-text>イベントタイトル読み込み</v-card-text>

        <v-spacer />

        <!-- イベントのユニークURLを取得しシェア。（ルームアドレス） -->
        <v-btn icon>
          <v-icon>mdi-share-variant</v-icon>
        </v-btn>
      </v-toolbar>

      <vue-cal
        ref="vuecal"
        active-view="day"
        editable-events
        hide-view-selector
        small
        selected-date="2020-04-17"
        :events="events"
        :disable-views="['years', 'year', 'month', 'week']"
        :time-cell-height="30"
        :time-from="5 * 60"
        :time-step="10"
        :time-to="29 * 60"
        :on-event-click="onEventClick"
        :on-event-create="onEventCreate"
        :watch-real-time="true"
        @cell-dblclick="
          $refs.vuecal.createEvent($event, 15, {
            title: 'New Event',
            class: 'new-event'
          })
        "
        @event-duration-change="onEventChange('event-duration-change', $event)"
      >
        <template #time-cell="{ hours, minutes }">
          <div :class="{ line: true }">
            <strong v-if="!minutes" style="font-size: 20px">{{ hours }}</strong>
            <span v-else style="font-size: 11px">{{ minutes }}</span>
          </div>
        </template>
      </vue-cal>

      <v-dialog v-model="showDialog">
        <v-card>
          <v-card-title>
            <v-icon>{{ selectedEvent.icon }}</v-icon>
            <span>{{ selectedEvent.title }}</span>
            <v-spacer />
            <strong>
              {{ selectedEvent.start && selectedEvent.start }}
            </strong>
          </v-card-title>
          <v-card-text>
            <p>{{ selectedEvent.contentFull }}</p>

            <strong>Event details:</strong>
            <ul>
              <li>
                Event starts at:
                {{ selectedEvent.start && selectedEvent.start }}
              </li>
              <li>
                Event ends at:
                {{ selectedEvent.end && selectedEvent.end }}
              </li>
            </ul>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-card>
  </v-layout>
</template>

<script>
import VueCal from "vue-cal"
import "vue-cal/dist/vuecal.css"
import "vue-cal/dist/drag-and-drop.js"
import { db } from "~/store"
export default {
  components: { VueCal },
  data: () => ({
    selectedEvent: {},
    showDialog: false,
    events: []
  }),
  computed: {},
  mounted() {
    console.log(this.events)
    this.getEvents()
  },
  methods: {
    async getEvents() {
      let snapshot = await db.collection("vueCalEvent").get()
      const events = []

      snapshot.forEach(doc => {
        const { start, end, title, content, id, ...dist } = doc.data()

        events.push({
          start: String(start),
          end: String(end),
          title,
          content,
          class: dist.class
        })
      })

      this.events = events
      console.log(this.events)
    },
    async addEvent({ start, end, title, content, ...dist }) {
      await db.collection("vueCalEvent").add({
        start: start.format("YYYY-MM-DD HH:mm"),
        end: end.format("YYYY-MM-DD HH:mm"),
        title,
        content,
        class: dist.class
      })
      this.getEvents()
      // this.name = ""
      // this.details = ""
      // this.start = ""
      // this.end = ""
      // this.color = ""
    },
    onEventClick(event, e) {
      this.selectedEvent = event
      this.showDialog = true
      console.log(event, e)

      e.stopPropagation() // Prevent navigating to narrower view (default vue-cal behavior).
    },
    onEventCreate(e, d) {
      console.log(e, d)
      this.addEvent(e)
    },
    onEventChange(e, d) {
      console.log(e, d)
    }
  }
}
</script>

<style>
.vuecal__now-line {
  color: rgb(0, 255, 0);
  border-top-width: 2px;
}
.v-dialog {
  max-width: 600px;
}
.vuecal__event {
  color: #fff;
}
.vuecal__event.clear-orange {
  background-color: rgba(253, 156, 66, 0.9);
  border: 1px solid rgb(233, 136, 46);
}
.vuecal__event.clear-pink {
  background-color: rgba(255, 102, 102, 0.9);
  border: 1px solid rgb(235, 82, 82);
}
.vuecal__event.clear-blue {
  background-color: rgba(102, 117, 255, 0.9);
  border: 1px solid rgb(97, 82, 235);
}
.vuecal__event.clear-yellow {
  background-color: rgba(255, 240, 102, 0.9);
  border: 1px solid rgb(235, 225, 82);
  color: gray;
}
.vuecal__event.new-event {
  background-color: rgb(218, 218, 218);
  color: gray;
}
</style>
