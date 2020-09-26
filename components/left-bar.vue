<template>
  <div id="l-bar">
    <div class="uploadBTN" style="align-center">
      <v-tooltip right class="tooltip-btn">
        <template v-slot:activator="{ on, attrs }">
          <v-btn class="py-7" text color="white" v-bind="attrs" v-on="on">
              <label for="fileSelector">
                <v-icon style="pointer:cursor">fas fa-cloud-upload-alt</v-icon>
              </label>
              <input type="file" id="fileSelector" accept=".json">
          </v-btn>
        </template> 
        <span>
          upload New Json File
        </span>
      </v-tooltip>
    </div>
    <div class="d-flex align-center" style="height: 93%;">
      <div class="text-center" style="width: 100%;">
        <v-tooltip right class="tooltip-btn">
          <template v-slot:activator="{ on, attrs }">
            <v-btn class="mt-5" text color="grey" v-bind="attrs" v-on="on">
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
            <v-btn class="mt-5" text color="grey" v-bind="attrs" v-on="on">
              <v-icon>fas fa-fast-backward</v-icon>
            </v-btn>
          </template>
          <span>
            <v-card class="m-0" max-width="400">
              <v-img class="white--text align-end" height="200px" 
              src="">
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
            <v-btn class="mt-5" text color="grey" v-bind="attrs" v-on="on">
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
            <v-btn class="mt-5" text color="grey" @click="clickMenu(5)" v-bind="attrs" v-on="on">
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
            <v-btn class="mt-5" text color="white" @click="clickMenu(6)" v-bind="attrs" v-on="on">
              <v-icon>fas fa-palette</v-icon>
            </v-btn>
          </template>
          <span>                  
            <v-card class="m-0 p-0" max-width="400">
              <v-img class="white--text align-end" height="200px" 
              src="./../assets/ChangeBG.png">
                <v-card-title :color="black">Change Background Color or Resize</v-card-title>
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
  methods:{
    clickMenu(i){
      this.$emit('menuclicked', i)
    }
  },
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
</style>