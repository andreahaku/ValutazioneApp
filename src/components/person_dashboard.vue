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
    <div class="list">
      <div class="card" v-for="fb in feedback">
        <div class="card-title bg-info text-black">
          <q-knob disable v-model="model" :min=0 :max=5 size="60px" lineWidth="6" class="donut donut-title" color="#000" trackColor="#fff"></q-knob>
          <span class="titolo tit">{{fb.nome}}</span>
        </div>
      <div class="card-content">
        <div class="item-content" v-for="n in fb.sub">
      <div class="row">
      <!-- 
        <q-rating
          disable
          v-model="ratingModel"
          :max="5"></q-rating>
       -->
          <q-knob disable v-model="model" :min=0 :max=5 size="50px" lineWidth="6" class="donut"></q-knob>
          <div class="item-content description">{{n}}</div>
      </div>
        </div>
  </div>

              </div>
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

localStorage.setItem("feedbacks", JSON.stringify(fb_init));

export default {
  mounted: function(){
  },
  data () {
    return {
      model: 3.4,
      persona: JSON.parse(people_init)[localStorage.getItem("selected")],
      feedback: fb_init.feedbacks
    }
  },
  methods: {
    vote: function(fb, icon){
      Dialog.create({
        title: 'Rating',
        form: {
          rating: {
            type: 'rating',
            label: 'Rate ' + this.persona.cognome + ' ' + this.persona.nome + ' in: <br><b>' + fb + '</b>',
            model: 0,
            max: 5,
            icon: icon
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
.donut{
  margin-right: 15px;
}
.description{
  font-size: 1.1rem;
}

.card{
  margin-bottom: 0px;
}
.card-content{
  padding-bottom: 0px;
}
.row{
  margin-top: 6px;
  border-bottom: 1px solid #ddd;
}
.donut-title{
  opacity: 1 !important;
}
.tit{
  position: absolute;
  top: 17px;
  font-size: 1.6rem;
  font-weight: 300;
}
</style>
