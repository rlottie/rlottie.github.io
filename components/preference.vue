<template>
  <div class="sidebar">
    <p class="title">Preference</p>
    
    <!-- Background color controller -->
    <div class="preference">
      <p class="preference-title mb-2">Background color</p>
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
          light
          value="#7417BE"
          v-model="color"
          show-swatches
          class="mx-auto"
        ></v-color-picker>
        </v-menu>
      </div>
    </div>

    <!-- Canvas Resize -->
    <!-- <div class="d-flex flex-column justify-content-center align-items-start preference">
      <label class="mb-2" for="slider2">Canvas Resize</label>
      <input class="canvasSlider" type="range" id="slider2" min="0" max="100" value="100"
        oninput="onResizeSliderDrag(this.value)">
    </div> -->

    <!-- Border Options -->
    <div class="preference">
      <p class="preference-title mb-0">Border</p>
      <div class="row d-flex align-items-center no-gutters">
        <div class="text-left col-6 pr-0">
          <v-menu 
            offset-y 
            :close-on-content-click="false"
            >
          <template v-slot:activator="{ on }">
            <v-btn
              :color="borderColor"
              dark
              v-on="on"
              class="mr-2"
            >
            </v-btn>
            <span>{{borderColor.slice(0, 7)}}</span>
          </template>
          <v-color-picker
            light
            value="#7417BE"
            v-model="borderColor"
            show-swatches
            class="mx-auto"
          ></v-color-picker>
          </v-menu>
        </div>
        <div class="col-6 pl-1">
          <v-text-field
            light
            solo
            prefix="px"
            v-model="borderWidth"
            @change="changeBorderWidth"
            class="bg-white"
            hide-details
          ></v-text-field>
        </div>
      </div>
    </div>


    <!-- Dimension controller -->
    <div class="preference">
      <p class="preference-title mb-2">Canvas Resize</p>
      <div class="position d-flex">
        <v-text-field
          light
          solo
          prefix="W"
          v-model="width"
          class="mr-3 bg-white"
          @change="changeXDimension()"
          hide-details
        ></v-text-field>
        <v-text-field
          light
          solo
          prefix="H"
          v-model="height"
          class="bg-white"
          @change="changeYDimension()"
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
      width: null,
      height: null,
      borderColor: '#000000',
      borderWidth: 1,
    }
  },
  watch: {
    color() {
      this.$emit('bg-color-changed', this.color)
    },
    borderColor() {
      var canvas = document.getElementById("myCanvas")
      canvas.style.borderColor = this.borderColor
    }
  },
  methods: {
    changeXDimension() {
      var canvas = document.getElementById("myCanvas")
      canvas.style.width = this.width + "px"
    },
    changeYDimension() {
      var canvas = document.getElementById("myCanvas")
      canvas.style.height = this.height + "px"
    },
    changeBorderWidth() {
      var canvas = document.getElementById("myCanvas")
      console.log(canvas.style)
      canvas.style.borderWidth = this.borderWidth + "px"
    }
  },
  mounted() {
    var canvas = document.getElementById("myCanvas")
    this.width = canvas.style.width.slice(0, -2)
    this.height = canvas.style.height.slice(0, -2)
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