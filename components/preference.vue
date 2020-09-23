<template>
  <div class="bg-sidebar sidebar">
    <p class="title">Preference</p>
    
    <!-- Background color controller -->
    <div class="preference">
      <p class="preference-title">Background color</p>
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

    <!-- Canvas Resize -->
    <div class="d-flex flex-column justify-content-center align-items-start mt-5 mb-3">
      <label class="mb-0" for="slider2">Canvas Resize</label>
      <input class="canvasSlider" type="range" id="slider2" min="0" max="100" value="100"
        oninput="onResizeSliderDrag(this.value)">
    </div>
    
    <!-- Dimension controller -->
    <div class="preference">
      <p class="preference-title">Dimension</p>
      <div class="position d-flex">
        <v-text-field
          solo
          prefix="W"
          v-model="width"
          class="mr-3"
          hide-details
        ></v-text-field>
        <v-text-field
          solo
          prefix="H"
          v-model="height"
          hide-details
        ></v-text-field>
      </div>
    </div>
  </div>
</template>

<script>
module.exports = {
  name: 'preference',
  data: function () {
    return {
      color: '#FFFFFF',
      width: 250,
      height: 250,
    }
  },
  watch: {
    color() {
      this.$emit('bg-color-changed', this.color)
    },
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

.preference {
  margin: 20px 0 0 0;
}

.preference-title {
  margin-bottom: 10px;
}

.v-text-field__prefix, .v-text-field__suffix {
  color: rgba(15, 128, 170, 0.77);
}

.canvasSlider {
  width: 100%;
}

</style>