import colors from "vuetify/es5/util/colors"
require("dotenv").config()

const {
  API_KEY,
  SENDER_ID,
  APP_ID,
  MEASUREMENT_ID,
  npm_package_name,
  npm_package_description
} = process.env

export default {
  mode: "spa",
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: "%s",
    title: npm_package_name || "",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: npm_package_description || ""
      }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#fff" },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: ["@nuxtjs/vuetify"],
  /*
   ** Nuxt.js modules
   */
  modules: [],

  // manifest: {
  //   name: "JuruSuke3",
  //   short_name: "JS3",
  //   theme_color: "#0dcff1",
  //   background_color: "#cf21f3",
  //   display: "minimal-ui",
  //   scope: "/",
  //   start_url: "/",
  //   lang: 'ja',
  //   icon:"/icon.png"
  // },
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ["~/assets/variables.scss"],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config) {
      config.node = {
        fs: "empty"
      }
    }
  },
  env: {
    API_KEY,
    SENDER_ID,
    APP_ID,
    MEASUREMENT_ID,
    npm_package_name,
    npm_package_description
  }
}
