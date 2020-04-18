<template>
  <v-layout column justify-center align-center>
    <v-card class="mx-auto" width="600" height="600">
      <v-toolbar dense color="gray">
        <v-btn class="ma-2" color="primary" dark @click="scrollToCurrentTime">
          Now
          <v-icon dark right>
            mdi-arrow-down-bold-hexagon-outline
          </v-icon>
        </v-btn>

        <div class="event-title">
          G's Hackathon
        </div>
        <v-spacer />
        <!-- イベントのユニークURLを取得しシェア。（ルームアドレス） -->
        <v-btn icon>
          <v-icon>mdi-share-variant</v-icon>
        </v-btn>
      </v-toolbar>

      <vue-cal
        id="vuecal"
        ref="vuecal"
        active-view="day"
        editable-events
        hide-view-selector
        small
        selected-date="2020-04-18"
        :time-cell-height="getTimecellHeight"
        :events="events"
        :disable-views="['years', 'year', 'month', 'week']"
        :time-from="getTimeFrom * 60"
        :time-step="getTimeStep"
        :time-to="29 * 60"
        :on-event-click="onEventClick"
        :on-event-create="addEvent"
        :watch-real-time="true"
        @ready="scrollToCurrentTime"
        @event-duration-change="onEventChange('end', $event)"
        @event-delete="onEventDelete('event-delete', $event)"
        @event-drop="onEventDorop('event-drop', $event)"
        @cell-dblclick="
          $refs.vuecal.createEvent($event, 15, {
            title: 'New Event',
            class: 'new-event'
          })
        "
      >
        <template #time-cell="{ hours, minutes }">
          <div :class="{ line: true }">
            <strong v-if="!minutes" style="font-size: 20px">{{ hours }}</strong>
            <span v-else style="font-size: 11px">{{ minutes }}</span>
          </div>
        </template>

        <template #event="{ event }">
          <small class="vuecal__event-time">
            <span>{{ event.start.formatTime("h:mm") }}</span>
            <span>-</span>
            <span>{{ event.end.formatTime("h:mm") }}</span>
          </small>
          <div
            class="vuecal__event-title vuecal__event-title--edit"
            contenteditable
            @blur="
              onEventChange('title', {
                event: { id: event.id, title: $event.target.innerHTML }
              })
            "
          >
            {{ event.title }}
          </div>
          <div class="edit-icon" @click="isOpenDialog = true">
            <v-icon color="blue-grey">
              mdi-square-edit-outline
            </v-icon>
          </div>
        </template>
      </vue-cal>

      <v-dialog v-model="isOpenDialog">
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

const TIME_CELL_HEIGHT = 30
const TIME_STEP = 5
const TIME_FROM = 5
const AN_HOUR = 60

export default {
  components: { VueCal },
  data: () => ({
    selectedEvent: {},
    isOpenDialog: false,
    events: []
  }),
  computed: {
    getTimecellHeight() {
      return TIME_CELL_HEIGHT
    },
    getTimeStep() {
      return TIME_STEP
    },
    getTimeFrom() {
      return TIME_FROM
    }
  },
  mounted() {
    console.log(this.events)
    this.getEvents()
  },
  methods: {
    async getEvents() {
      let snapshot = await db.collection("vueCalEvent").get()
      const events = []

      snapshot.forEach(doc => {
        const { title, start, end, content, ...dist } = doc.data()
        const formatTimestamp = date =>
          String(new Date(date.seconds * 1000).format("YYYY-MM-DD HH:mm"))

        events.push({
          id: doc.id,
          title,
          start: formatTimestamp(start),
          end: formatTimestamp(end),
          content,
          class: dist.class
        })
      })

      this.events = events
      console.log(this.events)
    },
    async addEvent({ start, end, title, content, ...dist }) {
      await db.collection("vueCalEvent").add({
        start,
        end,
        title,
        content,
        class: dist.class
      })
      this.getEvents()
    },
    onEventClick(event, e) {
      this.selectedEvent = event
      e.stopPropagation() // Prevent navigating to narrower view (default vue-cal behavior).
    },
    async onEventChange(eventKind, { event }) {
      await db
        .collection("vueCalEvent")
        .doc(event.id)
        .update({
          [eventKind]: event[eventKind]
        })
    },
    async onEventDorop(eventKind, { event }) {
      await db
        .collection("vueCalEvent")
        .doc(event.id)
        .update({
          start: event.start,
          end: event.end
        })
    },
    async onEventDelete(eventKind, { id }) {
      await db
        .collection("vueCalEvent")
        .doc(id)
        .delete()
    },
    scrollToCurrentTime() {
      const now = new Date()
      console.log(now.getHours())
      const calendar = document.querySelector("#vuecal .vuecal__bg")
      const hours =
        ((now.getHours() + now.getMinutes() / AN_HOUR - TIME_FROM) * AN_HOUR) /
        TIME_STEP
      calendar.scrollTo({
        top: hours * TIME_CELL_HEIGHT,
        behavior: "smooth"
      })
    }
  }
}
</script>

<style>
.event-title {
  margin-left: 10px;
}
.vuecal__now-line {
  color: rgb(0, 255, 0);
  border-top-width: 2px;
}
.v-dialog {
  max-width: 600px;
}
.vuecal__event {
  color: #fff;
  padding: 0 5px;
  text-align: left;
  position: relative;
}
.edit-icon {
  position: absolute;
  right: 5px;
  bottom: 10px;
  cursor: pointer;
}
.vuecal__event-title {
  text-align: left;
  padding: 0 5px;
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
.vuecal__event.break {
  background: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 10px,
    #e7e7e7 10px,
    #e7e7e7 20px
  ); /* IE 10+ */
  color: dodgerblue;
}
</style>
