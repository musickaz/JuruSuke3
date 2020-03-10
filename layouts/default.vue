<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :clipped="clipped"
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      dense
      :clipped-left="clipped"
      :collapse="!collapseOnScroll"
      :collapse-on-scroll="collapseOnScroll"
      app
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
  <v-btn icon
    nuxt
    to="/">
    <img src="/Js3logoSmall.png" height="40px">
</v-btn>

<v-toolbar-title><h3>　JuruSuke3</h3></v-toolbar-title>
    </v-app-bar>

        <nuxt />

  </v-app>
</template>

<script>
export default {
  data () {
    return {
      collapseOnScroll: true,
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-timetable',
          title: 'Event setup',
          to: '/'
        },
        {
          icon: 'mdi-help',
          title: 'How to use',
          to: '/How to use'
        },
        {
          icon: 'mdi-view-week',
          title: 'TimeTable',
          to: '/TimeTable'
        },
        {
          icon: 'mdi-headset',
          title: 'FAQ and Contact',
          to: '/FAQ'
        },
        {
          icon: 'mdi-library',
          title: 'Terms and Conditions',
          to: '/terms'
        },
      ],
    }
  }
}
</script>
