<template>
  <div class="bg-sidebar sidebar">
    <p class="title">Property</p>
    <p>{{ selectedLayer }}</p>
    <!-- color controller -->
    <div class="property">
      <p class="property-title">color</p>
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
    
    <!-- position controller -->
    <div class="property">
      <p class="property-title">position</p>
      <div class="position d-flex">
        <v-text-field
          solo
          prefix="x"
          v-model="xPos"
          class="mr-3"
          hide-details
        ></v-text-field>
        <v-text-field
          solo
          prefix="y"
          v-model="yPos"
          hide-details
        ></v-text-field>
      </div>
    </div>

    <!-- scale controller -->
    <div class="property">
      <p class="property-title">scale</p>
      <div class="scale">
         <v-text-field
          solo
          suffix="%"
          v-model="scale"
        ></v-text-field>
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
      xPos: 250,
      yPos: 250,
      scale: 100,
    }
  },
  props: {
    selectedLayer: Object,
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
.sidebar {
  padding: 1.2rem;
}

p {
  margin: 0;
}

.title {
  font-size: 1.5rem;
}

.property {
  margin: 20px 0 0 0;
}

.property-title {
  margin-bottom: 10px;
}

.v-text-field__prefix, .v-text-field__suffix {
  color: rgba(15, 128, 170, 0.77);
}

</style>