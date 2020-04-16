<template>
  <v-row class="fill-height">
    <v-col>
      <v-sheet height="64">
        <v-toolbar flat color="">
          <v-btn color="primary" dark @click.stop="dialog = true">
            New Event
          </v-btn>
          <v-btn outlined class="mr-4" @click="setToday">
            Today
          </v-btn>
          <v-btn fab text small @click="prev">
            <v-icon small>
              mdi-chevron-left
            </v-icon>
          </v-btn>
          <v-btn fab text small @click="next">
            <v-icon small>
              mdi-chevron-right
            </v-icon>
          </v-btn>
          <v-toolbar-title>{{ title }}</v-toolbar-title>
          <div class="flex-grow-1"></div>
        </v-toolbar>
      </v-sheet>

      <v-dialog v-model="dialog" max-width="500">
        <v-card>
          <v-container>
            <v-form @submit.prevent="addEvent">
              <v-text-field
                v-model="name"
                type="text"
                label="event name (required)"
              ></v-text-field>
              <v-text-field
                v-model="details"
                type="text"
                label="detail"
              ></v-text-field>
              <v-text-field
                v-model="start"
                type="date"
                label="start (required)"
              ></v-text-field>
              <v-text-field
                v-model="end"
                type="date"
                label="end (required)"
              ></v-text-field>
              <v-text-field
                v-model="end"
                type="time"
                label="end (required)"
              ></v-text-field>
              <v-time-picker v-model="timePicker"></v-time-picker>
              <v-text-field
                v-model="color"
                type="color"
                label="color (click to open color menu)"
              ></v-text-field>
              <v-btn
                type="submit"
                color="primary"
                class="mr-4"
                @click.stop="dialog = false"
              >
                create event
              </v-btn>
            </v-form>
          </v-container>
        </v-card>
      </v-dialog>

      <v-sheet height="600">
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          interval-height="30"
          interval-minutes="10"
          interval-width="50"
          type="day"
          :event-color="getEventColor"
          :event-margin-bottom="3"
          :events="events"
          :first-interval="6 * 6"
          :interval-count="6 * 24"
          :interval-format="intervalFormat"
          @click:event="showEvent"
          @click:date="setDialog"
          @change="updateRange"
        ></v-calendar>

        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          full-width
          offset-x
        >
          <v-card color="grey" :width="350" flat>
            <v-toolbar :color="selectedEvent.color" dark>
              <v-btn icon @click="deleteEvent(selectedEvent.id)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
              <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
              <div class="flex-grow-1"></div>
            </v-toolbar>

            <v-card-text>
              <form v-if="currentlyEditing !== selectedEvent.id">
                {{ selectedEvent.details }}
              </form>
              <form v-else>
                <v-textarea
                  v-model="selectedEvent.details"
                  type="text"
                  style="width: 100%"
                  :min-height="100"
                  placeholder="add note"
                ></v-textarea>
              </form>
            </v-card-text>

            <v-card-actions>
              <v-btn text color="secondary" @click="selectedOpen = false">
                close
              </v-btn>
              <v-btn
                v-if="currentlyEditing !== selectedEvent.id"
                text
                @click.prevent="editEvent(selectedEvent)"
              >
                edit
              </v-btn>
              <v-btn
                v-else
                text
                type="submit"
                @click.prevent="updateEvent(selectedEvent)"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
import { db } from "~/store"
export default {
  data: () => ({
    today: new Date().toISOString().substr(0, 10),
    focus: new Date().toISOString().substr(0, 10),
    name: null,
    details: null,
    start: null,
    end: null,
    color: "#1976D2", // default event color
    currentlyEditing: null,
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    events: [],
    timePicker: null,
    dialog: false
  }),
  computed: {
    title() {
      const { start, end } = this
      if (!start || !end) {
        return ""
      }
      const startMonth = this.monthFormatter(start)
      const startYear = start.year
      const startDay = start.day + this.nth(start.day)
      return `${startMonth} ${startDay} ${startYear}`
    },
    monthFormatter() {
      return this.$refs.calendar.getFormatter({
        timeZone: "UTC",
        month: "long"
      })
    }
  },
  mounted() {
    this.getEvents()
  },
  methods: {
    async getEvents() {
      let snapshot = await db.collection("calaEvent").get()
      const events = []

      snapshot.forEach(doc => {
        let appData = doc.data()
        appData.id = doc.id
        appData.start = `${appData.start} 14:10`
        appData.end = `${appData.end} 15:10`

        events.push(appData)
      })
      this.events = events
    },
    setDialog({ date }) {
      this.dialog = true
      this.focus = date
    },
    intervalFormat({ minute, hour }) {
      return hour + ":" + (minute === 0 ? "00" : minute)
    },
    getEventColor(event) {
      return event.color
    },
    setToday() {
      this.focus = this.today
    },
    prev() {
      this.$refs.calendar.prev()
    },
    next() {
      this.$refs.calendar.next()
    },
    async addEvent() {
      if (this.name && this.start && this.end) {
        await db.collection("calaEvent").add({
          name: this.name,
          details: this.details,
          start: this.start,
          end: this.end,
          color: this.color
        })
        this.getEvents()
        this.name = ""
        this.details = ""
        this.start = ""
        this.end = ""
        this.color = ""
      } else {
        alert("You must enter event name, start, and end time")
      }
    },
    editEvent(ev) {
      this.currentlyEditing = ev.id
    },
    async updateEvent(ev) {
      await db
        .collection("calaEvent")
        .doc(this.currentlyEditing)
        .update({
          details: ev.details
        })
      ;(this.selectedOpen = false), (this.currentlyEditing = null)
    },
    async deleteEvent(ev) {
      await db
        .collection("calaEvent")
        .doc(ev)
        .delete()
      ;(this.selectedOpen = false), this.getEvents()
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event
        this.selectedElement = nativeEvent.target
        setTimeout(() => (this.selectedOpen = true), 10)
      }
      if (this.selectedOpen) {
        this.selectedOpen = false
        setTimeout(open, 10)
      } else {
        open()
      }
      nativeEvent.stopPropagation()
    },
    updateRange({ start, end }) {
      this.start = start
      this.end = end
    },
    nth(d) {
      return d > 3 && d < 21
        ? "th"
        : ["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th"][d % 10]
    }
  }
}
</script>
