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
        small
        :time-from="5 * 60"
        :time-step="5"
        :time-cell-height="30"
        default-view="day"
        :disable-views="['years', 'year', 'month', 'week', 'day']"
        hide-weekends
        hide-view-selector
        hide-title-bar
        :cell-click-hold="false"
        editable-events
        :events="events"
        @cell-dblclick="
          $refs.vuecal.createEvent($event, 120, {
            title: 'New Event',
            class: 'blue-event'
          })
        "
      >
        <!-- イベントの設定日時を初期表示するが、場合によっては -->
        <template v-slot:time-cell="{ hours, minutes }">
          <div :class="{ line: true, hours: !minutes }">
            <strong v-if="!minutes" style="font-size: 20px">{{ hours }}</strong>
            <span v-else style="font-size: 11px">{{ minutes }}</span>
          </div>
        </template>
      </vue-cal>
    </v-card>
  </v-layout>
</template>

<script>
import VueCal from "vue-cal"
import "vue-cal/dist/vuecal.css"

export default {
  components: { VueCal },
  data: () => ({})
}
</script>
