<template>
  <div id="l-bar" class="d-flex align-center">
    <div class="justify-center text-center" style="width: 100%;">
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
            <v-icon>fas fa-palette</v-icon>
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
            <v-icon>fas fa-paint-brush</v-icon>
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
    </div>
  </div>
</template>

<script>
module.exports = {
  name:"left-bar",
}
</script>

<style>
#l-bar{
  height: 100%;
  width: 4rem;
  background-color: #292c31;
  position: absolute;
}
</style>