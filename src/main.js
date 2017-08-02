// === DEFAULT / CUSTOM STYLE ===
// WARNING! always comment out ONE of the two require() calls below.
// 1. use next line to activate CUSTOM STYLE (./src/themes)
// require(`./themes/app.${__THEME}.styl`)
// 2. or, use next line to activate DEFAULT QUASAR STYLE
require(`quasar/dist/quasar.${__THEME}.css`)
    // ==============================

import Vue from 'vue'
import VueResource from 'vue-resource'
import Quasar from 'quasar'
import router from './router'
import chance from 'chance'
import App from './App'

import {
    store
} from './store';

Vue.use(Quasar) // Install Quasar Framework
Vue.use(VueResource)

localStorage.setItem("idpersona", 4765);
localStorage.setItem("path", "http://dev41:8080");
localStorage.setItem("uo", 57);

Quasar.start(() => {
    /* eslint-disable no-new */
    new Vue({
        el: '#q-app',
        store: store,
        router,
        render: h => h(App)
    })
})