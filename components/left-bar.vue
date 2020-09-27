<template>
  <div id="l-bar">
    <div class="uploadBTN" style="align-center">
      <v-tooltip right class="tooltip-btn">
        <template v-slot:activator="{ on, attrs }">
          <v-btn tile class="py-7" text color="white" v-bind="attrs" v-on="on">
              <label for="fileSelector">
                <v-icon style="pointer:cursor">fas fa-cloud-upload-alt</v-icon>
              </label>
              <input type="file" id="fileSelector" accept=".json">
          </v-btn>
        </template> 
        <span>
          upload New JSON File
        </span>
      </v-tooltip>
    </div>
    <div class="d-flex align-center" style="height: 93%;">
      <div class="text-center" style="width: 100%;">

        <v-tooltip right class="tooltip-btn">
          <template v-slot:activator="{ on, attrs }">
            <v-btn tile class="mt-5" text :color="activateBtn2(1)" v-bind:class="{ activateBtn: isActivate(1) }" @click="clickMenu(1)" v-bind="attrs" v-on="on">
              <v-icon class="Acitvate">fas fa-heart</v-icon>
            </v-btn>
          </template>

          <span>
            <v-card class="m-0" max-width="400">
              <v-img class="white--text align-end" height="200px" 
              src="https://cdn.vuetifyjs.com/images/cards/docks.jpg">
                <v-card-title>Top 10 Australian beaches</v-card-title>
              </v-img>
              <v-card-subtitle class="pb-0">Number 10</v-card-subtitle>
              <v-card-text class="text--primary">
                <div>Whitehaven Beach</div>
                <div>Whitsunday Island, Whitsunday Islands</div>
              </v-card-text>
            </v-card>
          </span>
        </v-tooltip>

        <v-tooltip right class="tooltip-btn">
          <template v-slot:activator="{ on, attrs }">
            <v-btn tile class="mt-5" text :color="activateBtn2(2)" v-bind:class="{ activateBtn: isActivate(2) }" @click="clickMenu(2)" v-bind="attrs" v-on="on">
              <v-icon>fas fa-cut</v-icon>
            </v-btn>
          </template>

          <span>
            <v-card class="m-0" max-width="400">
              <v-img class="white--text align-end" height="200px" 
              src="https://cdn.vuetifyjs.com/images/cards/docks.jpg">
                <v-card-title>Top 10 Australian beaches</v-card-title>
              </v-img>
              <v-card-subtitle class="pb-0">Number 10</v-card-subtitle>
              <v-card-text class="text--primary">
                <div>Whitehaven Beach</div>
                <div>Whitsunday Island, Whitsunday Islands</div>
              </v-card-text>
            </v-card>
          </span>
        </v-tooltip>

        <v-tooltip right class="tooltip-btn">
          <template v-slot:activator="{ on, attrs }">
            <v-btn tile class="mt-5" text :color="activateBtn2(3)" v-bind:class="{ activateBtn: isActivate(3) }" @click="clickMenu(3)" v-bind="attrs" v-on="on">
              <v-icon>fas fa-fast-backward</v-icon>
            </v-btn>
          </template>
          <span>
            <v-card class="m-0" max-width="400">
              <v-img class="white--text align-end" height="200px" 
              >
                <v-card-title>Top 10 Australian beaches</v-card-title>
              </v-img>
              <v-card-subtitle class="pb-0">Number 10</v-card-subtitle>
              <v-card-text class="text--primary">
                <div>Whitehaven Beach</div>
                <div>Whitsunday Island, Whitsunday Islands</div>
              </v-card-text>
            </v-card>
          </span>
        </v-tooltip>

        <v-tooltip right class="tooltip-btn">
          <template v-slot:activator="{ on, attrs }">
            <v-btn tile class="mt-5" text :color="activateBtn2(4)" v-bind:class="{ activateBtn: isActivate(4) }" @click="clickMenu(4)" v-bind="attrs" v-on="on">
              <v-icon>fas fa-image</v-icon>
            </v-btn>
          </template>
          <span>
            <v-card class="m-0" max-width="400">
              <v-img class="white--text align-end" height="200px" 
              src="https://cdn.vuetifyjs.com/images/cards/docks.jpg">
                <v-card-title>Top 10 Australian beaches</v-card-title>
              </v-img>
              <v-card-subtitle class="pb-0">Number 10</v-card-subtitle>
              <v-card-text class="text--primary">
                <div>Whitehaven Beach</div>
                <div>Whitsunday Island, Whitsunday Islands</div>
              </v-card-text>
            </v-card>
          </span>
        </v-tooltip>

        <v-tooltip right class="tooltip-btn">
          <template v-slot:activator="{ on, attrs }">
            <v-btn tile class="mt-5" text :color="activateBtn2(5)" v-bind:class="{ activateBtn: isActivate(5) }" @click="clickMenu(5)" v-bind="attrs" v-on="on">
              <v-icon>fas fa-arrows-alt</v-icon>
            </v-btn>
          </template>
          <span>
            <v-card class="m-0" max-width="400">
              <v-img class="white--text align-end" height="200px" 
              src="https://cdn.vuetifyjs.com/images/cards/docks.jpg">
                <v-card-title>Top 10 Australian beaches</v-card-title>
              </v-img>
              <v-card-subtitle class="pb-0">Number 10</v-card-subtitle>
              <v-card-text class="text--primary">
                <div>Whitehaven Beach</div>
                <div>Whitsunday Island, Whitsunday Islands</div>
              </v-card-text>
            </v-card>
          </span>
        </v-tooltip>

        <v-tooltip right class="tooltip-btn">
          <template v-slot:activator="{ on, attrs }">
            <v-btn tile class="mt-5" v-bind:class="{ activateBtn: isActivate(6) }" text :color="activateBtn2(6)" @click="clickMenu(6)" v-bind="attrs" v-on="on">
              <v-icon>fas fa-palette</v-icon>
            </v-btn>
          </template>
          <span>                  
            <v-card class="m-0 p-0" max-width="400">
              <v-img class="white--text align-end" height="200px" 
              src="https://cdn.vuetifyjs.com/images/cards/docks.jpg">
                <v-card-title>Top 10 Australian beaches</v-card-title>
              </v-img>
              <v-card-subtitle class="pb-0">Number 10</v-card-subtitle>
              <v-card-text class="text--primary">
                <div>Whitehaven Beach</div>
                <div>Whitsunday Island, Whitsunday Islands</div>
              </v-card-text>
            </v-card>
          </span>
        </v-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
module.exports = {
  name:"left-bar",
  props:{
    selectedmenu: Number
  },
  methods:{
    clickMenu(i){
      console.log(this.selectedmenu)
      this.$emit('menuclicked', i)
    },
    isActivate: function(i) {
      if (this.selectedmenu === i){
        return true
      }else{
        return false
      }
    }
  },
  computed:{
    activateBtn2(){
      return (i) => {
        if (this.selectedmenu == i){
          return 'white'
        }
        else{
          return 'grey'
        }
      }
    }
  }
}
</script>

<style>
  #l-bar{
    height: 100%;
    width: 4rem;
    background-color: #292c31;
    float:left
  }
  #fileSelector{
    display:none;
    cursor: pointer;
  }
  .uploadBTN{
    border-bottom: 2px solid grey;
  }
  .activateBtn{
    border-left: 4px solid blue;
  }
</style>