<template>
    <q-layout>
        <div slot="header" class="toolbar peoplebar" :class="{'peoplebar1': active == 1, 'noplace': searchModel==''}" >
            <q-toolbar-title>
                <span class="titolo">Continuous Feedback</span>
                <p></p>
                <q-search v-if="!adv" v-model="searchModel" placeholder="cerca per cognome" @enter="loadAll()" 
                :icon="active==0 ? 'search' : null"></q-search>
                <button v-else class="info" click="deleteFilter">
                  <i class="on-left">clear</i> Rimuovi Filtro
                </button>
                <button v-if="active==1 && !adv" @click="loadAll()" style="padding-right: 5px;">
                  <i>search</i>
                </button>
                <button class="ell" @click="advopn()">
                  <i>more_vert</i>
                </button>
            </q-toolbar-title>
        </div>
        <q-tabs slot="navigation" :refs="$refs" ref="tabs" default-tab="tab-0">
              <q-tab name="tab-0" @selected="switchActive($event, 0)">
                Il tuo Team
              </q-tab>
              <q-tab name="tab-1" @selected="switchActive($event, 1)">
                Tutti
              </q-tab>
        </q-tabs>
        <transition name="slide0">
            <div class="list window-width" v-if="active == 0" v-touch-swipe.horizontal="handler">
                <transition-group tag="div" name="fade" v-if="people.length > 0">
                    <div class="item multiple-lines" v-for="persona in people" :key="persona.IDPERSONA">
                        <img class="item-primary" :src="path+'/'+persona.IMMAGINE"  onerror="this.src = 'statics/profile-photo_small.png'">
                        <div class="item-content has-secondary">
                            <div>{{persona.COGNOME}} {{persona.NOME}}</div>
                            <hr>
                            <div class="item-label item-smaller"><i class="black">work</i> {{persona.UO}}</div>
                            <div class="item-label item-smaller"><i class="black">account_box</i> {{persona.RUOLO}}</div>
                        </div>
                        <div class="item-secondary">
                            <router-link to="/dashboard">
                                <i class="icons" @click="save(persona.IDPERSONA)">info_outline</i>
                            </router-link>
                            <p></p>
                            <router-link to="/feedback">
                                <i class="icons" @click="save(persona.IDPERSONA)">add</i>
                            </router-link>
                        </div>
                        <!-- 
                <div class="item-secondary">
                  <i slot="target">
                    more_vert
                    <q-popover ref="popover">
                      <div class="list">
                        <div class="item item-link" @click="$refs.popover.close()">
                          <div class="item-content">New</div>
                        </div>
                        <div class="item item-link" @click="$refs.popover.close()">
                          <div class="item-content">Edit</div>
                        </div>
                        <div class="item item-link" @click="$refs.popover.close()">
                          <div class="item-content">Share</div>
                        </div>
                        <div class="item item-link" @click="$refs.popover.close()">
                          <div class="item-content">Solicit</div>
                        </div>
                      </div>
                    </q-popover>
                  </i>
                  </div>
                 -->
                    </div>
                </transition-group>
                <div v-else>
                    <span class="label bg-red text-white norecord">No Record Found</span>
                </div>
            </div>
        </transition>
        <transition name="slide1">
            <div class="list window-width" v-if="active == 1" v-touch-swipe.horizontal="handler">
                <transition-group tag="div" name="fade" v-if="ready">
                    <div class="item multiple-lines" v-for="persona in peopleAll" :key="persona.IDPERSONA">
                        <img class="item-primary" :src="path+'/'+persona.IMMAGINE"  onerror="this.src = 'statics/profile-photo_small.png'">
                        <div class="item-content has-secondary">
                            <div>{{persona.COGNOME}} {{persona.NOME}}</div>
                            <hr>
                            <div class="item-label item-smaller"><i class="black">work</i> {{persona.UO}}</div>
                            <div class="item-label item-smaller"><i class="black">account_box</i> {{persona.RUOLO}}</div>
                        </div>
                        <div class="item-secondary">
                            <router-link to="/dashboard">
                                <i class="icons" @click="save(persona.IDPERSONA)">info_outline</i>
                            </router-link>
                            <p></p>
                            <router-link to="/feedback">
                                <i class="icons" @click="save(persona.IDPERSONA)">add</i>
                            </router-link>
                        </div>
                    </div>
                </transition-group>
            </div>
        </transition>
        <advanced @done="advancedFilter"></advanced>
    </q-layout>
</template>
<script>

import { Loading } from 'quasar'
import {
    eventBus
} from '../eventbus.js';

import advanced from './advancedSearch.vue'
/*
Loading.show({
  message: 'Some message',
  messageColor: '#00ff00',
  spinner: 'dots',
  spinnerSize: 250, // in pixels
  spinnerColor: '#f034a3'
})  */

export default {
    mounted: function() {
        this.init();
    },
    components: {
        advanced
    },
    data() {
        return {
            searchModel: '',
            path: localStorage.getItem("path"),
            people: [],
            peopleUo: [],
            peopleAll: [],
            active: 0,
            ready: false,
            overflow: false,
            adv: false,
            filterObj: {
                nome: '',
                cognome: '',
                iduo: '',
                idruolo: ''
            }
        }
    },
    watch: {
        searchModel: function() {
            this.filter();
        },
        active: function(){
            if(this.active == 1){
                this.loadAll();
            } else if(this.active == 0){
                this.init();
            }
        }
    },
    methods: {
        advopn: function(){
            eventBus.$emit("advopn")
        },
        switchActive: function($event, active){
            if($event == true){
                this.active = active;
            }
        },
        save: function(id) {
            localStorage.setItem("selected", id);
        },
        handler: function(object){
            if(this.active == 0){
                if(object.direction === "left"){
                   this.$refs.tabs.setActiveTab("tab-1");
                }
            } else {
                if(object.direction === "right"){
                   this.$refs.tabs.setActiveTab("tab-0");
                }
            }
        },
        init: function(){
            var p = localStorage.getItem("people");
            if(p != null){
                this.people = JSON.parse(p);
                this.peopleUo = this.people.slice();
                if(this.searchModel.trim()!=""){
                    this.filter();
                }
            } else {
                this.$http.get(localStorage.getItem("path")+"/APIPersone?IDUO="+localStorage.getItem("uo")).then((response) => {
                    var res = response.body;
                    try {
                        res = JSON.parse(response.body);
                    } catch (err) {};

                    if(res && res.APIPersone){
                        this.people = res.APIPersone;
                        this.peopleUo = this.people.slice();
                        localStorage.setItem("people", JSON.stringify(this.people));
                    }
                    if(this.searchModel.trim()!=""){
                        this.filter();
                    }
                }, (err) => {
                    console.log(err);
                });
            }
        },
        loadAll: function(){
            this.ready = false;
            Loading.show({delay: 0})

            this.overflow = false;
            var path = localStorage.getItem("path");
            var string = '/APIPersone?'
            var params = [];
            if(!this.adv){
                if (this.searchModel.trim() != "") {
                    params.push("COGNOME=" + this.searchModel.trim());
                }
            } else {
                if (this.filterObj.cognome.trim() != "") {
                    params.push("COGNOME=" + this.filterObj.cognome.trim());
                }
                if (this.filterObj.nome.trim() != "") {
                    params.push("NOME=" + this.filterObj.nome.trim());
                }
                //TODO iduo - idruolo
            }

            params = params.join("&");
            if (params.trim() == "") {
                params = "IDPERSONA=."
            }
            string = string + params;
            this.peopleAll = [];
            this.$http.get(localStorage.getItem("path") + string).then((response) => {
                var res = response.body;
                try {
                    res = JSON.parse(response.body);
                } catch (err) {};

                if (res && res.APIPersone) {
                    this.peopleAll = res.APIPersone;
                    if (this.peopleAll.length > 50) {
                        this.peopleAll = this.peopleAll.slice(0, 50);
                        this.overflow = true;
                    }
                }
                this.ready = true;
                Loading.hide();
            }, (err) => {
                this.ready = true;
                console.log(err);
                Loading.hide();
            })
        },
        filter: function(){
            if(this.active == 0){  
                if(this.adv){
                    var vm = this;
                    this.people = this.peopleUo.filter(function(p){
                        var n = vm.filterObj.nome.trim().toLowerCase();
                        var c = vm.filterObj.cognome.trim().toLowerCase();

                        if(n != ""){
                            if(!p.NOME.toLowerCase().includes(n)){
                                return false;
                            }
                        }
                        if(c != ""){
                            if(!p.COGNOME.toLowerCase().includes(c)){
                                return false;
                            }
                        }
                        if(vm.filterObj.iduo != -1){
                            if(p.IDUO != vm.filterObj.iduo){
                                return false;
                            }
                        }
                        if(vm.filterObj.idruolo != -1){
                            if(p.IDRUOLO != vm.filterObj.idruolo){
                                return false;
                            } 
                        }
                        return true;
                    })
                } else {
                    if (this.searchModel.length > 0) {
                        var tutti = this.peopleUo;

                        var filtro = this.searchModel.toLowerCase().trim();
                        this.people = [];

                        for (let i = 0; i < tutti.length; i++) {
                            var persona = tutti[i];
                            var c = persona.COGNOME.toLowerCase();

                            if (c.includes(filtro)) {
                                this.people.push(persona);
                            }
                        }
                    } else {
                        this.people = JSON.parse(localStorage.getItem("people"));
                    }
                }
            }
        },
        advancedFilter: function(obj){
            this.filterObj = obj;
            if(obj.nome.trim() != "" || obj.cognome.trim() != "" || obj.iduo != -1 || obj.idruolo != -1){
                this.adv = true;
            } else {
                this.adv = false;
            }
            if(this.active == 0){
                this.filter();
            } else if(this.active == 1){
                this.loadAll();
            }
        },
        deleteFilter: function(){
            this.filterObj = {
                nome: '',
                cognome: '',
                iduo: -1,
                idruolo: -1
            }
            this.searchModel = '';
            eventBus.$emit("advdel");
            this.adv = false;
        }
    }
}
</script>
<style scoped>
.list {
    overflow-y: auto;
}

.multiple-lines {
    border-bottom: 1px solid #dedede;
    margin-bottom: 4px;
    box-shadow: 0 4px 4px -2px #ddd;
    min-height: 112px;
}

.item > .item-primary ~ .item-content {
    margin-left: 110px;
}

.item > img.item-primary {
    height: 80px;
    width: 80px;
    top: 16px;
    left: 16px;
}

.item > img.item-primary:not(.thumbnail) {
    border-radius: 10%;
}

.black {
    color: black;
    padding-right: 5px;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}

.norecord {
    margin: 10px;
}

.icons {
    position: relative;
    font-size: 3rem;
    right: 15px;
    top: 10px;
    width: 26px;
    color: #ccc;
    margin-bottom: 10px;
}

.toolbar {
    margin-top: 5px;
}

.titolo {
    font-weight: 100;
    font-size: 1.8rem;
}

.slide0-enter-active {
    animation: slide-z-in 0.5s ease-in-out forwards;
}

.slide0-leave-active {
    animation: slide-z-out 0.5s ease-in-out forwards;
}

.slide1-enter-active {
    animation: slide-f-in 0.5s ease-in-out forwards;
}

.slide1-leave-active {
    animation: slide-f-out 0.5s ease-in-out forwards;
}

@keyframes slide-z-in {
    from {
        transform: translateX(-200px);
        width: 0%;
    }
    to {
        transform: translateX(0px);
        width: 100%;
    }
}

@keyframes slide-z-out {
    from {
        transform: translateX(0px);
        width: 100%;
    }
    to {
        transform: translateX(-200px);
        width: 0%;
    }
}

@keyframes slide-f-in {
    from {
        transform: translateX(200px);
        width: 0%;
    }
    to {
        transform: translateX(0px);
        width: 100%;
    }
}

@keyframes slide-f-out {
    from {
        transform: translateX(0px);
        width: 100%;
    }
    to {
        transform: translateX(200px);
        width: 0%;
    }
}

button {
    padding: 0px 10px;
    border-width: 3px;
}
button.ell {
    float: right;
    padding: 0px 5px;
}
</style>
<style>
    div.q-tab {
        min-height: 0px !important;
        height: 35px;
    }
    div.q-tabs {
        min-height: 0px !important;
    }
    .peoplebar .q-search {
        float: left;
        width: 88%;
    }
    .peoplebar1 .q-search {
        width: 75%;
    }
    .peoplebar1 .q-search-input {
        padding-left: 15px;
    }

    .noplace .q-search-input {
        padding-right: 15px;
    }
</style>
