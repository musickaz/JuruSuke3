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
        default-view="day"
        editable-events
        hide-title-bar
        hide-view-selector
        hide-weekends
        small
        selected-date="2020-04-17"
        :disable-views="['years', 'year', 'month', 'week', 'day']"
        :cell-click-hold="false"
        :events="events"
        :time-cell-height="30"
        :time-from="5 * 60"
        :time-step="10"
        :time-to="29 * 60"
        :on-event-click="onEventClick"
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
    this.events = [
      {
        start: "2020-04-17 14:00",
        end: "2020-04-17 18:00",
        title: "Need to go shopping",
        icon: "shopping_cart", // Custom attribute.
        content: "Click to see my shopping list",
        contentFull:
          "My shopping list is rather long:<br><ul><li>Avocados</li><li>Tomatoes</li><li>Potatoes</li><li>Mangoes</li></ul>", // Custom attribute.
        class: "clear-orange"
      },
      {
        start: "2020-04-17 10:00",
        end: "2020-04-17 15:00",
        title: "Golf with John",
        icon: "golf_course", // Custom attribute.
        content: "Do I need to tell how many holes?",
        contentFull: "Okay.<br>It will be a 18 hole golf course.", // Custom attribute.
        class: "clear-yellow"
      }
    ]
  },
  methods: {
    onEventClick(event, e) {
      this.selectedEvent = event
      this.showDialog = true

      // Prevent navigating to narrower view (default vue-cal behavior).
      e.stopPropagation()
    }
  }
}
</script>

<style>
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
}
.vuecal__now-line {
  color: rgb(0, 255, 0);
  border-top-width: 2px;
}
</style>
