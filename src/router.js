import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

function load(component) {
    return () => System.import(`components/${component}.vue`)
}

export default new VueRouter({
    /*
     * NOTE! VueRouter "history" mode DOESN'T works for Cordova builds,
     * it is only to be used only for websites.
     *
     * If you decide to go with "history" mode, please also open /config/index.js
     * and set "build.publicPath" to something other than an empty string.
     * Example: '/' instead of current ''
     *
     * If switching back to default "hash" mode, don't forget to set the
     * build publicPath back to '' so Cordova builds work again.
     */

    routes: [{
        path: '/',
        component: load('people_list')
    }, {
        path: '/feedback',
        component: load('feedback_list')
    }, {
        path: '/dashboard',
        component: load('person_dashboard')
    }]
})