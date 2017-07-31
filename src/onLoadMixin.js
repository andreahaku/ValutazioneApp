import { eventBus } from './eventbus.js';

export const onLoadMixin = {
    mounted: function() {
        this.$nextTick(function() {
            this.init();
        })
    },
    data: function() {
        return {
            path: localStorage.getItem("path"),
            promises: [],
            errorDetected: false,
            once: true,
            //conto le promises risolte, segna loaded solo quando coincidono con promises.length
            count: 0,
            loading: true
        }
    },
    methods: {
        init: function() {
            var vm = this;
            this.promises = [];
            this.errorDetected = false;
            this.count = 0;

            this.promises.push(function tryGet() {
                return vm.$http.get(vm.path + "/APIPersone?ID=.").then((response) => {
                    var submitCompetenze = [];
                    try {
                        var res = response.body
                        try {
                            var res = JSON.parse(response.body);
                        } catch (err) {}

                        if (res && res.APICompetenze) {
                            for (var i = 0; i < res.APICompetenze.length; i++) {
                                if (res.APICompetenze[i].COMPETENZA.trim() != "") {
                                    submitCompetenze.push({
                                        id: res.APICompetenze[i].ID,
                                        nome: res.APICompetenze[i].COMPETENZA
                                    })
                                }
                            }
                        }
                        vm.$store.commit("insertCompetenze", submitCompetenze);
                        console.log("resolved competenze")
                        vm.resolved()
                    } catch (err) {
                        throw { nome: "Competenze", err: tryGet };
                    }
                }, (err) => {
                    console.log(err);
                    this.internalError()
                })
            }());

            if (this.promises.length > 0) {
                Promise.all(this.promises).then(() => {
                    vm.load()
                }, (err) => {
                    if (err.nome != null) {
                        this.errorDetected = true;
                        console.log("!ERROR LOADING: " + err.nome);
                        err.err()
                    } else {
                        console.log("ERRORE PROMISE ALL")
                        console.log(err);
                        this.internalError();
                    }
                })
            } else {
                this.loading = false;
            }
        },
        resolved: function() {
            this.count++;
            if (this.errorDetected) {
                if (this.count == this.promises.length) {
                    this.load();
                }
            }
        },
        load: function() {
            console.log("resolved all");
            this.$store.commit("loaded");
            this.loading = false;
            eventBus.$emit("feedsGreen");
        },
        internalError: function() {
            if (this.once) {
                this.once = false;
                this.init()
            }
        }
    }
}
