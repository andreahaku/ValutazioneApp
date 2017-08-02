import { eventBus } from './eventbus.js';
import { Loading } from 'quasar'

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
            Loading.show({delay: 0})
            var vm = this;
            this.promises = [];
            this.errorDetected = false;
            this.count = 0;

            this.promises.push(function tryGet() {
                    return vm.$http.get(vm.path + "/APIUO?ID=.").then((response) => {
                        var submitUo = [];
                        try {
                            var res = response.body
                            try {
                                var res = JSON.parse(response.body);
                            } catch (err) {}

                            if (res && res.APIUO) {
                                for (var i = 0; i < res.APIUO.length; i++) {
                                    submitUo.push({
                                        id: res.APIUO[i].ID,
                                        nome: res.APIUO[i].UO
                                    })
                                }
                            }
                            vm.$store.commit("insertUo", submitUo);
                            console.log("resolved uo")
                            vm.resolved()
                        } catch (err) {
                            throw { nome: "Uo", err: tryGet };
                        }
                    }, (err) => {
                        console.log(err);
                        this.internalError()
                    })
                }());
                this.promises.push(function tryGet() {
                    return vm.$http.get(vm.path + "/APIRuoli?ID=.").then((response) => {
                        var submitRuoli = [];
                        try {
                            var res = response.body
                            try {
                                var res = JSON.parse(response.body);
                            } catch (err) {}

                            if (res && res.APIRuoli) {
                                for (var i = 0; i < res.APIRuoli.length; i++) {
                                    submitRuoli.push({
                                        id: res.APIRuoli[i].ID,
                                        nome: res.APIRuoli[i].RUOLO
                                    })
                                }
                            }
                            vm.$store.commit("insertRuoli", submitRuoli);
                            console.log("resolved ruoli")
                            vm.resolved()
                        } catch (err) {
                            throw { nome: "Ruoli", err: tryGet };
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

                Loading.hide();
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
            this.loading = false;

            Loading.hide()
            //eventBus.$emit("feedsGreen");
        },
        internalError: function() {
            if (this.once) {
                this.once = false;
                this.init()
            }
        }
    }
}
