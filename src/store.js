var idbAdapter = new LokiIndexedAdapter();
var db = new loki("db.json", {
    adapter: idbAdapter
});

import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        db: db
    },
    getters: {
        getRuoli: (state) => {
            var ruoli = state.db.getCollection("ruoli");
            return ruoli;
        },
        getUo: (state) => {
            var uo = state.db.getCollection("uo");
            return uo;
        }
    },
    mutations: {
        insertUo: (state, arrayObj) => {
            state.db.addCollection("uo", {
                unique: ['id']
            });
            var uo = state.db.getCollection("uo");
            uo.insert(arrayObj);
        },
        insertRuoli: (state, arrayObj) => {
            state.db.addCollection("ruoli", {
                unique: ['id']
            });
            var ruolidb = state.db.getCollection("ruoli");
            ruolidb.insert(arrayObj);
        }
    }
});