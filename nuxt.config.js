const pkg = require("./package");

module.exports = {
    mode: "spa",

    /*
     ** Headers of the page
     */
    head: {
        title: "Marathon Myanmar",
        meta: [{
                charset: "utf-8"
            },
            {
                name: "viewport",
                content: "width=device-width, initial-scale=1"
            },
            {
                hid: "description",
                name: "description",
                content: pkg.description
            }
        ],
        link: [{
                rel: "icon",
                type: "image/x-icon",
                href: "/favicon.ico"
            },
            {
                rel: "stylesheet",
                href: "https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons"
            }
        ]
    },

    /*
     ** Customize the progress-bar color
     */
    loading: {
        color: "blue"
    },

    /*
     ** Global CSS
     */
    //css: [],
    css: ['@assets/styles/index.scss'],

    /*
     ** Plugins to load before mounting the App
     */
    plugins: [
        "@/plugins/vuetify",
        "@/plugins/vee-validate",
        "@/plugins/common",
        "@/plugins/api",
        "@/plugins/xlsx",
        "@/plugins/vue-json-excel",
        "@/plugins/vue-print-nb",
        "@/plugins/vue-qrcode",
        "@/plugins/components.js",
        {
            src: "@/plugins/vue-shortkey"
        }
    ],

    /*
     ** Nuxt.js modules
     */
    modules: [
        // Doc: https://github.com/nuxt-community/axios-module#usage
        "@nuxtjs/axios"
    ],
    /*
     ** Axios module configuration
     */
    axios: {
        // See https://github.com/nuxt-community/axios-module#options
    },
    buildModules: [
        '@nuxtjs/vuetify',
    ],
    /*
     ** Build configuration
     */
    build: {
        /*
         ** You can extend webpack config here
         */
        extend(config, ctx) {},
        // analyze: true
        build: {
            vendor: [
                "vuetify",
                "vee-validate",
                "common",
                "api",
                "vue-json-excel",
                "vue-print-nb",
                "vue-qrcode",
                "vue-shortkey"
            ]
        }
    },
    env: {
        baseUrl: process.env.NODE_ENV === "production" ?
            "https://backend.marathonmyanmar.net/api/v1/merchant_dashboard" : "https://backend.marathonmyanmar.net/api/v1/merchant_dashboard",
        fbapi: `blahblah/`
    }
    // transition: {
    //   name: "fade",
    //   mode: "out-in"
    // }
};