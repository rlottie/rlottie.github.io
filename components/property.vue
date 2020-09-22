<template>
  <div class="bg-sidebar sidebar">
    <p class="title">Property</p>
    <!-- color controller -->
    <div class="property">
      <p class="property-title">color</p>
      <!-- <div class="d-flex">
        <div class="color mr-3"></div>

        <div class="color-code">#FFB6EE</div>
      </div> -->
      <div class="text-left">
        <v-menu 
          offset-y 
          :close-on-content-click="false"
          >
          <template v-slot:activator="{ on }">
            <v-btn
              :color="color"
              dark
              v-on="on"
              class="mr-2"
            >
            </v-btn>
            <span>{{color.slice(0, 7)}}</span>
          </template>
          <v-color-picker
            value="#7417BE"
            v-model="color"
            show-swatches
            class="mx-auto"
        ></v-color-picker>
        </v-menu>
      </div>

    </div>
    
    
     <!-- <v-color-picker class="ma-2" show-swatches></v-color-picker> -->
    <!-- position controller -->
    <div class="property">
      <p class="property-title">position</p>
      <div class="position d-flex">
        <div class="white-box mr-3">
          <p>x <span>250</span></p>
        </div>
        <div class="white-box">
          <p>y <span>20</span></p>
        </div>
      </div>
    </div>

    <!-- scale controller -->
    <div class="property">
      <p class="property-title">scale</p>
      <div class="white d-flex">
        <div class="white-box mr-3">
          <p>x <span>%</span></p>
        </div>
      </div>
    </div>
  </div>
  
</template>

<script>
module.exports = {
  name: 'property',
  data: function () {
    return {
      color: 'pink',
    }
  },
  computed: {
    swatchStyle() {
      const { color, menu } = this
      return {
        backgroundColor: color,
        cursor: 'pointer',
        height: '30px',
        width: '30px',
        borderRadius: menu ? '50%' : '4px',
        transition: 'border-radius 200ms ease-in-out'
      }
    }
  }
}
</script>

<style scoped>
p {
  margin: 0;
}

.title {
  font-size: 1.5rem;
}

.property {
  margin: 20px 0 20px 0;
}

.property-title {
  margin-bottom: 10px;
}

.sidebar {
  padding: 1.2rem;
}

.color {
  height: 30px;
  width: 30px;
  border-radius: 50%;
  background-color: #FFB6EE;
  cursor: pointer;
}

.white-box {
  background-color: white;
  border-radius: 20px;
  color: black;
  width: 60px;
  text-align: center;
}

.white-box p {
  padding: 5px 10px;
}
</style>