<template>
    <q-layout>
        <div slot="header" class="toolbar">
            <q-toolbar-title>
                <span class="titolo">Continuous Feedback</span>
                <p></p>
                <q-search v-model="searchModel" placeholder="search people"></q-search>
                <p></p>
            </q-toolbar-title>
        </div>
        <q-tabs slot="navigation" :refs="$refs" default-tab="tab-1">
              <q-tab name="tab-1">
                Il tuo Team
              </q-tab>
              <q-tab name="tab-2">
                Tutti
              </q-tab>
        </q-tabs>
        <div class="list window-width" v-if="active == 0" v-touch-swipe="handler">
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
        <div class="list window-width" v-else v-touch-swipe="handler">
        <!-- TODO PERSON ALL TAB -->
        </div>
    </q-layout>
</template>
<script>

export default {
    mounted: function() {
        var p = localStorage.getItem("people");
        if(p != null){
            this.people = JSON.parse(p);
            this.peopleUo = this.people.slice();
        } else {
            this.$http.get(localStorage.getItem("path")+"/APIPersone?IDUO="+localStorage.getItem("uo")).then((response) => {
                var res = response.body;
                try {
                    res = JSON.parse(response.body);
                } catch (err) {};

                if(res && res.APIPersone){
                    this.people = res.APIPersone;
                    this.peopleUo = this.people.slice();
                    console.log(res.APIPersone.length)
                    localStorage.setItem("people", JSON.stringify(this.people));
                }
            }, (err) => {
                console.log(err);
            });
        }
    },
    data() {
        return {
            searchModel: '',
            path: localStorage.getItem("path"),
            people: [],
            peopleUo: [],
            active: 0
        }
    },
    watch: {
        searchModel: function(stringaFiltro) {

            if (stringaFiltro.length > 0) {

                var tutti = this.peopleUo;

                var filtro = stringaFiltro.toLowerCase().trim();
                this.people = [];

                for (let i = 0; i < tutti.length; i++) {
                    var persona = tutti[i];
                    var n = persona.NOME.toLowerCase();
                    var c = persona.COGNOME.toLowerCase();

                    if (n.includes(filtro) || c.includes(filtro)) {
                        this.people.push(persona);
                    }
                }
            } else {
                this.people = JSON.parse(localStorage.getItem("people"));
            }
        }
    },
    methods: {
        save: function(id) {
            localStorage.setItem("selected", id);
        },
        handler: function(object){
            console.log(object.direction);
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
    font-size: 2rem;
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
</style>
