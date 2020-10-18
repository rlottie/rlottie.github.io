<template>
  <div class="sidebar scroll-sect scroll-sect-light">
    <p class="title">Property</p>

    <!-- keypath info -->
    <div class="mt-5">
      <p class="font-weight-medium">
        Keypath
      </p>
      <p class="ml-1 mt-2">
        {{ keypath }} 
      </p>
      <hr v-if="$vuetify.theme.dark" color="white">
      <hr v-else color="gray">
    </div>

    <!-- color controller -->
    <div class="property mt-7">
      <p class="property-title mb-2">Color</p>
      <div class="text-left d-flex align-items-center">
        <v-menu
          offset-y
          :close-on-content-click="false"
        >
          <template v-slot:activator="{ on }">
            <v-btn
              class="mr-2"
              :color="color.hex"
              dark
              v-on="on"
            >
            </v-btn>
            <span>{{ color.hex }}</span>
          </template>
          <v-color-picker
            class="mx-auto"
            v-model="color"
            light
            show-swatches
        ></v-color-picker>
        </v-menu>
      </div>
    </div>

    <!-- opacity controller -->
    <div class="property mt-8">
      <div class="d-flex align-items-center mb-2">
        <p class="property-title">Opacity</p>
        <v-tooltip 
          bottom 
          nudge-right="65" 
          nudge-bottom="65"
        >
          <template v-slot:activator="{ on, attrs }">
            <em
              class="far fa-question-circle fa-sm ml-2 mb-2"
              v-bind="attrs"
              v-on="on"
            >
            </em>
          </template>
          <span>Number should be between 0 and 100</span>
        </v-tooltip>
      </div>
      <div class="position row no-gutters">
        <v-text-field
          class="mr-3 col-12 col-md-6"
          light
          solo
          placeholder="Opacity"
          suffix="%"
          v-model="opacity"
          @change="changeOpacity(opacity)"
        ></v-text-field>
      </div>
    </div>

    <!-- stroke width controller -->
    <div
      class="property"
    >
      <div class="d-flex align-items-center mb-2">
        <p class="property-title">Stroke Width</p>
        <v-tooltip
          bottom 
          nudge-right="50"
          nudge-bottom="65"
        >
          <template v-slot:activator="{ on, attrs }">
            <em
              class="far fa-question-circle fa-sm ml-2 mb-2"
              v-bind="attrs"
              v-on="on">
            </em>
          </template>
          <span>Number should be greater than or equal to 0</span>
        </v-tooltip>
      </div>
      <div class="position row no-gutters">
        <v-text-field
          class="mr-3 col-12" 
          light 
          solo 
          placeholder="Width" 
          suffix="px"
          v-model="strokeWidth" 
          @change="changeStrokeWidth(strokeWidth)"
        ></v-text-field>
      </div>
    </div>

    <!-- position controller -->
    <div class="property">
      <div class="d-flex align-items-center mb-2">
        <p class="property-title">Position</p>
        <v-tooltip
          bottom
          nudge-right="100"
          nudge-bottom="65"
          max-width="350"
        >
          <template v-slot:activator="{ on, attrs }">
            <em
              class="far fa-question-circle fa-sm ml-2 mb-2"
              v-bind="attrs"
              v-on="on"
            >
            </em>
          </template>
          <span>X axis and Y axis directions are relative concepts that can differ depending on the file</span>
        </v-tooltip>
      </div>
      <div class="position d-flex">
        <v-text-field
          class="mr-3"
          light
          solo
          prefix="X"
          suffix="px"
          placeholder="0"
          v-model="xPos"
          @change="changeXPos(xPos)"
        ></v-text-field>
        <v-text-field
          light
          solo
          prefix="Y"
          suffix="px"
          placeholder="0"
          v-model="yPos"
          @change="changeYPos(yPos)"
        ></v-text-field>
      </div>
    </div>
  </div>
</template>

<script>
module.exports = {
  name: 'property',
  data() {
    return {
      color: {
        alpha: Number(),
        hex: String(),
        hexa: String(),
        hsla: {
            h: Number(),
            s: Number(),
            l: Number(),
            a: Number(),
        },
        hsva: {
            h: Number(),
            s: Number(),
            v: Number(),
            a: Number(),
        },
        hue: Number(),
        rgba: {
            r: Number(),
            g: Number(),
            b: Number(),
            a: Number()
        }
      },
      opacity: null,
      strokeWidth: null,
      xPos: null,
      yPos: null
    }
  },
  props: {
    keypath: String
  },
  watch: {
    keypath() {
      this.color = {
        alpha: Number(),
        hex: String(),
        hexa: String(),
        hsla: {
            h: Number(),
            s: Number(),
            l: Number(),
            a: Number(),
        },
        hsva: {
            h: Number(),
            s: Number(),
            v: Number(),
            a: Number(),
        },
        hue: Number(),
        rgba: {
            r: Number(),
            g: Number(),
            b: Number(),
            a: Number()
        }
      },
      this.opacity = null,
      this.strokeWidth = null,
      this.xPos = null,
      this.yPos = null
    },
    color() {
      if (this.color.hex) {
        setLayerColor(this.keypath, this.color.rgba.r/255, this.color.rgba.g/255, this.color.rgba.b/255)
      }
    }
  },
  methods: {
    changeOpacity(opacity) {
      if (opacity && opacity <= 100 && opacity >= 0) {
        setLayerOpacity(this.keypath, Number(opacity));
      }
    },
    changeStrokeWidth(width) {
      setStrokeWidth(this.keypath, Number(width));
    },
    changeXPos(xPos) {
      if (this.yPos) {
        setPosition(this.keypath, Number(xPos), Number(this.yPos))
      } else {
        setPosition(this.keypath, Number(xPos), 0)
      }
    },
    changeYPos(yPos) {
      if (this.xPos) {
        setPosition(this.keypath, Number(this.xPos), Number(yPos))
      } else {
        setPosition(this.keypath, 0, Number(yPos))
      }
    }
  }
}
</script>

<style scoped>
.sidebar {
  padding: 1.2rem;
}

.scroll-sect {
  overflow-y: scroll; 
  height: 92vh;
  height: 92vh;
}

p {
  margin: 0;
}

.title {
  font-size: 1.5rem;
}

.property {
  margin: 10px 0 0 0;
}

.property-title {
  margin-bottom: 10px;
}

.v-text-field__prefix, .v-text-field__suffix {
  color: rgba(15, 128, 170, 0.77);
}

.v-messages.theme--light {
  color: white !important;
}

.v-input {
  width: 50% !important;
}

.v-tooltip__content {
  font-size: 10px !important;
}

</style>