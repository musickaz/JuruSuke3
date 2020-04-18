<template>
  <v-layout column justify-center align-center>
    <v-card class="mx-auto" width="600" height="600">
      <v-toolbar dense color="gray">
        <v-card-title class="event-title">
          G's Hackathon
        </v-card-title>
        <v-spacer />
        <!-- イベントのユニークURLを取得しシェア。（ルームアドレス） -->
        <v-btn icon>
          <v-icon>mdi-share-variant</v-icon>
        </v-btn>
      </v-toolbar>
      <v-toolbar dense color="gray">
        <v-btn class="ma-2" color="primary" dark @click="scrollToCurrentTime">
          Now
          <v-icon dark right>
            mdi-arrow-down-bold-hexagon-outline
          </v-icon>
        </v-btn>
        <v-card-title>
          <div class="color-black">
            Status:
            <span :class="`current-schedule ${getCurrentStatus.color}`">
              {{ getCurrentStatus.status }}
            </span>
            <v-btn icon @click="scheduleDialog = true">
              <v-icon color="blue-grey">
                mdi-circle-edit-outline
              </v-icon>
            </v-btn>
          </div>
        </v-card-title>
      </v-toolbar>

      <vue-cal
        id="vuecal"
        ref="vuecal"
        active-view="day"
        editable-events
        hide-view-selector
        hide-title-bar
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
          <div class="edit-icon" @click="eventDialog = true">
            <v-btn icon>
              <v-icon color="blue-grey">
                mdi-square-edit-outline
              </v-icon>
            </v-btn>
          </div>
        </template>
      </vue-cal>

      <v-dialog v-model="eventDialog" persistent max-width="500">
        <v-card>
          <v-card-title class="headline">
            {{ selectedEvent.title }}
          </v-card-title>
          <v-card-text>
            <p>{{ selectedEvent.content }}</p>
            {{
              selectedEvent.start &&
                selectedEvent.start.format("YYYY-MM-DD HH:mm")
            }}
            {{
              selectedEvent.end && selectedEvent.end.format("YYYY-MM-DD HH:mm")
            }}
            <div>
              <strong>Change Color</strong>
            </div>
            <div class="color-picke-container">
              <div v-for="(color, i) in colors" :key="i">
                <div
                  :class="
                    `color-box
                ${color}`
                  "
                  @click="
                    onEventChange('class', {
                      event: { id: selectedEvent.id, class: color }
                    })
                  "
                ></div>
              </div>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="eventDialog = false">
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="scheduleDialog" persistent max-width="290">
        <v-card>
          <v-card-title class="headline">
            Edit Status
          </v-card-title>
          <v-card-text>
            <div class="status-edit-wrapper">
              <v-btn icon @click="newStatus = newStatus - 1">
                <v-icon color="blue-grey">
                  mdi-minus-circle-outline
                </v-icon>
              </v-btn>
              <strong class="new-status">
                {{ Number(currentStatus.status) + newStatus }}
              </strong>
              <v-btn icon @click="newStatus = newStatus + 1">
                <v-icon color="blue-grey">
                  mdi-plus-circle-outline
                </v-icon>
              </v-btn>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="onCancelUpdateStatus">
              Cancel
            </v-btn>
            <v-btn
              color="green darken-1"
              text
              @click="
                onUpdateStatus(
                  currentStatus.id,
                  Number(currentStatus.status) + newStatus
                )
              "
            >
              Save
            </v-btn>
          </v-card-actions>
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
    scheduleDialog: false,
    eventDialog: false,
    newStatus: 0,
    events: [],
    currentStatus: { id: "", status: 0 },
    colors: [
      "clear-orange",
      "clear-pink",
      "clear-blue",
      "clear-yellow",
      "new-event",
      "break"
    ]
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
    },
    getCurrentStatus() {
      const currentStatus = Number(this.currentStatus.status)
      console.log(currentStatus)
      const formatedStatus =
        currentStatus === 0
          ? "As Scheduled"
          : currentStatus > 0
          ? `+ ${currentStatus} min`
          : `${currentStatus} min`

      const color =
        currentStatus === 0
          ? "font-green"
          : currentStatus > 0
          ? "font-red"
          : "font-blue"

      return { status: formatedStatus, color }
    }
  },
  mounted() {
    this.getEvents()
  },
  methods: {
    async getEvents() {
      let snapshot = await db.collection("vueCalEvent").get()
      let snapshot2 = await db.collection("vueCalStatus").get()
      console.log(snapshot2.docs[0])
      this.currentStatus = {
        id: snapshot2.docs[0].id,
        status: snapshot2.docs[0].data().status
      }

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
      this.getEvents()
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
    async onUpdateStatus(id, newStatus) {
      this.scheduleDialog = false
      this.currentStatus = { id: this.currentStatus.id, status: newStatus }
      await db
        .collection("vueCalStatus")
        .doc(id)
        .update({
          status: newStatus
        })
      this.newStatus = 0
    },
    onCancelUpdateStatus() {
      this.scheduleDialog = false
      this.newStatus = 0
    },
    scrollToCurrentTime() {
      const now = new Date()
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
  /* margin-left: 10px; */
}
.new-status {
  font-size: 20px;
  font-weight: bold;
  width: 30px;
}
.status-edit-wrapper {
  text-align: center;
  margin: 12px 0 0;
}
.v-card {
  padding: 10px;
}
.v-card .current-schedule {
  margin-left: 5px;
}
.v-card .current-schedule.font-green {
  color: rgb(0, 255, 0);
}
.v-card .current-schedule.font-blue {
  color: #28a8ff;
}
.v-card .current-schedule.font-red {
  color: red;
}
.color-picke-container {
  display: flex;
}
.color-picke-container .color-box {
  cursor: pointer;
  width: 25px;
  height: 25px;
  border-radius: 100%;
  margin-right: 5px;
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
.clear-orange {
  background-color: rgba(253, 156, 66, 0.9);
  border: 1px solid rgb(233, 136, 46);
}
.clear-pink {
  background-color: rgba(255, 102, 102, 0.9);
  border: 1px solid rgb(235, 82, 82);
}
.clear-blue {
  background-color: rgba(102, 117, 255, 0.9);
  border: 1px solid rgb(97, 82, 235);
}
.clear-yellow {
  background-color: rgba(255, 240, 102, 0.9);
  border: 1px solid rgb(235, 225, 82);
  color: gray;
}
.new-event {
  background-color: rgb(218, 218, 218);
  color: gray;
}
.break {
  background: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 9px,
    #e7e7e7 9px,
    #e7e7e7 16px
  ); /* IE 10+ */
  color: dodgerblue;
}
</style>
