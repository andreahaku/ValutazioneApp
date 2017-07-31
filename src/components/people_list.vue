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
        <div class="list window-width" v-if="people.length > 0">
            <transition-group tag="div" name="fade">
                <div class="item multiple-lines" v-for="persona in people" :key="persona.id">
                    <img class="item-primary" :src="persona.avatar">
                    <div class="item-content has-secondary">
                        <div>{{persona.cognome}} {{persona.nome}}</div>
                        <hr>
                        <div class="item-label item-smaller"><strong class="black">@</strong> {{persona.email}}</div>
                        <div class="item-label item-smaller"><i class="black">call</i> {{persona.telefono}}</div>
                        <div class="item-label item-smaller"><i class="black">euro_symbol</i> {{persona.salario}}</div>
                    </div>
                    <div class="item-secondary">
                        <router-link to="/dashboard">
                            <i class="icons" @click="save(persona.id)">info_outline</i>
                        </router-link>
                        <p></p>
                        <router-link to="/feedback">
                            <i class="icons" @click="save(persona.id)">add</i>
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
        </div>
        <div v-else>
            <span class="label bg-red text-white norecord">No Record Found</span>
        </div>
    </q-layout>
</template>
<script>
var people_init = [];
var numero_elementi = 10;

export default {
    mounted: function() {

        if (this.people.length < numero_elementi) {

            for (let i = 0; i < numero_elementi; i++) {

                var gender = chance.gender();
                var g_short = (gender == 'Male') ? 'men' : 'women';

                people_init.push({
                    id: i,
                    nome: chance.first({
                        gender: gender,
                        nationality: "it"
                    }),
                    cognome: chance.last({
                        nationality: "it"
                    }),
                    sesso: g_short,
                    email: chance.email(),
                    telefono: chance.phone({
                        country: 'uk'
                    }),
                    salario: chance.euro({
                        min: 10000,
                        max: 50000
                    }),
                    avatar: 'https://randomuser.me/api/portraits/' + g_short + '/' + chance.integer({
                        min: 1,
                        max: 90
                    }) + '.jpg'
                });
            }

            localStorage.setItem("people", JSON.stringify(people_init));
        }
    },
    data() {
        return {
            searchModel: '',
            people: people_init
        }
    },
    watch: {
        searchModel: function(stringaFiltro) {

            if (stringaFiltro.length > 0) {

                var tutti = []

                if (people_init.length < numero_elementi) {
                    tutti = JSON.parse(localStorage.getItem("people"));
                } else {
                    tutti = people_init;
                }

                var filtro = stringaFiltro.toLowerCase().trim();
                this.people = [];

                for (let i = 0; i < tutti.length; i++) {
                    var persona = tutti[i];
                    var n = persona.nome.toLowerCase();
                    var c = persona.cognome.toLowerCase();

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
            localStorage.setItem("people", JSON.stringify(people_init));
            localStorage.setItem("selected", id);
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
