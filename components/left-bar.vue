<template>
  <div id="l-bar" ref="leftBar">
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
              <v-icon class="Acitvate">fas fa-shapes</v-icon>
            </v-btn>
          </template>

          <span>
            <v-card class="m-0" max-width="400">
              <v-img class="white--text align-end" height="200px" 
              src="./assets/ChangeTR.png">
                <v-card-title>Change Fill</v-card-title>
              </v-img>
              <v-card-subtitle class="pb-0">Change 2 properties</v-card-subtitle>
              <v-card-text class="text--primary">
                <div>Color, Opacity</div>
                <div></div>
              </v-card-text>
            </v-card>
          </span>
        </v-tooltip>

        <v-tooltip right class="tooltip-btn">
          <template v-slot:activator="{ on, attrs }">
            <v-btn tile class="mt-5" text :color="activateBtn2(2)" v-bind:class="{ activateBtn: isActivate(2) }" @click="clickMenu(2)" v-bind="attrs" v-on="on">
              <v-icon>mdi-triangle-wave</v-icon>
            </v-btn>
          </template>

          <span>
            <v-card class="m-0" max-width="400">
              <v-img class="white--text align-end" height="200px" 
              src="./assets/ChangeTR.png">
                <v-card-title>Change Stroke</v-card-title>
              </v-img>
              <v-card-subtitle class="pb-0">Change 3 properties</v-card-subtitle>
              <v-card-text class="text--primary">
                <div>Color, Opacity, Width</div>
                <div></div>
              </v-card-text>
            </v-card>
          </span>
        </v-tooltip>

        <v-tooltip right class="tooltip-btn">
          <template v-slot:activator="{ on, attrs }">
            <v-btn tile class="mt-5" text :color="activateBtn2(3)" v-bind:class="{ activateBtn: isActivate(3) }" @click="clickMenu(3)" v-bind="attrs" v-on="on">
              <v-icon>fas fa-crop</v-icon>
            </v-btn>
          </template>
          <span>
            <v-card class="m-0" max-width="400">
              <v-img class="white--text align-end" height="200px" 
                src="./assets/ChangeTR.png">
                <v-card-title>Change Transform</v-card-title>
              </v-img>
              <v-card-subtitle class="pb-0">Change 5 properties</v-card-subtitle>
              <v-card-text class="text--primary">
                <div>Anchor, Position,</div>
                <div>Scale, Rotation, Opacity</div>
              </v-card-text>
            </v-card>
          </span>
        </v-tooltip>

        <v-tooltip right class="tooltip-btn">
          <template v-slot:activator="{ on, attrs }">
            <v-btn tile class="mt-5" v-bind:class="{ activateBtn: isActivate(4) }" text :color="activateBtn2(4)" @click="clickMenu(4)" v-bind="attrs" v-on="on">
              <v-icon>fas fa-palette</v-icon>
            </v-btn>
          </template>
          <span>                  
            <v-card class="m-0 p-0" max-width="400">
              <v-img class="white--text align-end" height="200px" 
              src="./assets/ChangeBG.png">
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
    selectedmenu: Number,
  },
  methods:{
    clickMenu(i){
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
  },
  mounted() {
    var self = this;
    self.$emit('child-event', this.$refs.leftBar.clientHeight);
    window.addEventListener("resize", function(e) {
      self.$emit('child-event', e.target.innerHeight);
    });
  },
  beforeDestroy() {
    // window.removeEventListener("resize");
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
    border-left: 4px solid #0099cc;
  }
  .tooltip-btn{
    z-index: 100;
  }
</style>