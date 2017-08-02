<template>
	<q-modal class="maximized" ref="advModal" position="top"
	:content-css="{minWidth: '80vw', minHeight: '90vh'}">
		<q-layout>
			<div slot="header" class="toolbar">
		      <q-toolbar-title :padding="1">
		        Ricerca Avanzata
		      </q-toolbar-title>
		    </div>
		    <div slot="footer" class="toolbar">
			    <button @click="$refs.advModal.close()">Chiudi</button>
			    <button @click="dispatchFilter()">Cerca</button>
    		</div>
			
			 <div class="layout-view">
      			<div class="layout-padding advform">
      				<div class="stacked-label">
					  <input v-model="nome" style="width: 100%; margin-bottom: 13px; padding: 13px 0px 4px 0px; text-align: right;">
					  <label>Cerca per nome</label>
					</div>
					<div class="stacked-label">
					  <input v-model="cognome" style="width: 100%; margin-bottom: 13px; padding: 13px 0px 4px 0px; text-align: right;">
					  <label>Cerca per cognome</label>
					</div>
					
					<q-autocomplete v-if="uoSD.field != null" v-model="nomeuo" :delay="0" :max-results="20" :static-data="uoSD" @selected="pickUo">
					  <q-search v-model="nomeuo" placeholder="Cerca per unità organizzativa"></q-search>
					</q-autocomplete>

					<q-autocomplete v-if="ruoliSD.field != null" v-model="nomeruolo" :delay="0" :max-results="6" :static-data="ruoliSD" @selected="pickRole">
					  <q-search v-model="nomeruolo" placeholder="Cerca per ruolo"></q-search>
					</q-autocomplete>
      			</div>
      		</div>
			
	    </q-layout>
    </q-modal>
</template>

<script>

import {
    eventBus
} from '../eventbus.js';

export default {
	mounted: function(){
		this.mountStaticData();
	},
	created: function(){
		var vm = this;
		eventBus.$on('advopn', function(mess) {
            vm.open();
        });
        eventBus.$on('advdel', function(mess) {
            vm.delete();
        });
	},
	data: function(){
		return {
			nome: '',
			cognome: '',
			iduo: -1,
			idruolo: -1,
			nomeuo: '',
			nomeruolo: '',
			uoSD: {},
			ruoliSD: {}
		}
	},
	methods: {
		open: function(){
			this.$refs.advModal.open()
		},
		delete: function(){
			this.nome = '';
			this.cognome = '';
			this.iduo = -1;
			this.idruolo = -1;
			this.nomeuo = "";
			this.nomeruolo = "";
		},
		pickUo: function(item){
			this.iduo = item.id;
		},
		pickRole: function(item){
			this.idruolo = item.id;
		},
		dispatchFilter: function(){
			this.$refs.advModal.close()
			this.$emit("done", {
				nome: this.nome,
				cognome: this.cognome,
				iduo: this.nomeuo.trim() != "" ? this.iduo : -1,
				idruolo: this.nomeruolo.trim() != "" ? this.idruolo : -1
			})
		},
		mountStaticData: function(){
			var uo = this.$store.getters.getUo;
			uo = uo.data;
			var u_list = [];
			for(var i = 0; i < uo.length; i++){
				u_list.push({
					value: uo[i].nome,
					label: uo[i].nome,
					id: uo[i].id
				})
			}
			this.uoSD = {
				field: 'value',
				list: u_list
			}

			var ruoli = this.$store.getters.getRuoli;
			ruoli = ruoli.data;
			var r_list = [];
			for(var i = 0; i < ruoli.length; i++){
				r_list.push({
					value: ruoli[i].nome,
					label: ruoli[i].nome,
					id: ruoli[i].id
				})
			}

			this.ruoliSD = {
				field: 'value',
				list: r_list
			}
		}
	}
}

</script>

<style>
	.advform .q-search {
		margin-bottom: 10px;
	} 
</style>