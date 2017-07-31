<template>
  <q-layout>
    <div slot="header" class="toolbar">
      <img class="avatar" :src="persona.avatar">
      <q-toolbar-title>
        <span class="titolo">{{persona.cognome}} {{persona.nome}}</span>
      </q-toolbar-title>
      <router-link class="back" to="/">
        <span class="icon">BACK</span>
      </router-link>
    </div>

    <div class="list window-width">
      <q-collapsible v-for="(fb, index) in feedback" :icon="fb.icon" :label="fb.nome" class="collapse" :key="index">
        <div class="item" v-for="n in fb.sub">
            <i class="item-primary icon">star_rate</i>
          <div class="item-content" @click="vote(n)">
                 {{n}}
          </div>
        </div>
      </q-collapsible>
    </div>
        
  </q-layout>
</template>

<script>

var people_init = localStorage.getItem("people");

var fb_init = {
  "feedbacks": [
    {
      nome : "Consulting Process",
      icon: "business_center",
      sub : [
      "Data evaluation",
      "Problem solving",
      "Autonomous deliverable production, storyboard definition",
      "Methodologies application",
      "Design and prepare client meeting/workshops",
      "Conduct interviews",
      "Trustful relationships with relevant client members"
      ]
    },
    {
      nome : "Competency Knowledge",
      icon: "school",
      sub : [
        "Growing Industry know how",
        "Competency specialization",
        "Good methodology knowledge",
        "Know How organization"
      ]
    },
    {
      nome : "Engagement Management",
      icon: "mood",
      sub : [
        "Effective collaboration with other work streams & teams"
      ]
    },
    {
      nome : "Business Development",
      icon: "domain",
      sub : [
        "Contribution to writing proposals",
        "Awareness of client problems and improvement areas"
      ]
    },
    {
      nome : "People management & Practice development",
      icon: "group",
      sub : [
        "Support to internal projects and initiatives"
      ]
    }
  ]
}

import { Dialog } from 'quasar'
import { Toast } from 'quasar'

localStorage.setItem("feedbacks", JSON.stringify(fb_init));


export default {
  mounted: function(){
  },
  data () {
    return {
      persona: JSON.parse(people_init)[localStorage.getItem("selected")],
      feedback: fb_init.feedbacks
    }
  },
  methods: {
    vote: function(fb){
      Dialog.create({
        title: 'Feedback',
        form: {
          rating: {
            type: 'rating',
            label: 'Rate ' + this.persona.cognome + ' ' + this.persona.nome + ' in: <br><b>' + fb + '</b>',
            model: 0,
            max: 5
          },
          comment: {
            type: 'textbox',
            label: 'Add Comment (optional)',
            model: ''
          }
        },
        buttons: [
          'Cancel',
          {
            label: 'Ok',
            handler (data) {
              var message = 'Sent Rating of "' + data.rating + '"';
              if (data.comment) message = message + ' with comment: "' + data.comment +'"'
              Toast.create( message )
            }
          }
        ]
      })
    }
  }
}
</script>

<style scoped>
.list{
  overflow-y: auto;
}
.collapse{
  font-weight: 500;
  border-bottom: 1px solid #ddd;  
  box-shadow: 0 4px 4px -2px #ddd;
}
.item{
  font-weight: 300;
  display: inline;
  vertical-align: middle;
}
.toolbar{
  margin: 5px;
}
.avatar{
  border-radius: 10%;
}
.titolo{
  font-weight: 100;
  font-size: 2rem;
}
.icon{
  margin-right: 10px;
  margin-left: 0px;
}
.back{
  color: white;
}
.menu_item{
  border-bottom: 1px solid #ddd;
}
</style>
