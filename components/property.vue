<template>
  <div class="sidebar scroll-sect" :class="{ 'scroll-sect-dark': $vuetify.theme.dark, 'scroll-sect-light': !$vuetify.theme.dark }">
    <p class="title">
      Property
      <!-- canvas info -->
      <v-chip
        v-if="multiview"
        class="ml-1 mb-1 text-caption"
        color="canvas"
        small
      >
        {{canvasid + 1}}
      </v-chip>
    </p>

    <!-- keypath info -->
    <div class="mt-5">
      <p class="font-weight-medium">
        Keypath
      </p>
      <p class="ml-1 mt-2">
        {{selectedLayer.keypath}} 
      </p>
      <hr v-if="$vuetify.theme.dark" color="white">
      <hr v-else color="gray">
    </div>

    <!-- color controller -->
    <div class="property mt-7">
      <p class="property-title mb-2">Color</p>
      <div class="text-left d-flex align-items-center" v-if="selectedLayer.child.length !== 0" @click="clickColorError">
        <v-menu
          disabled
          offset-y
          :close-on-content-click="false"
          >
          <template v-slot:activator="{ on }">
            <v-btn
              :color="selectedLayer.color.hex"
              dark
              v-on="on"
              class="mr-2"
            >
            </v-btn>
            <span>{{ selectedLayer.color.hex }}</span>
          </template>
          <v-color-picker
            light
            v-model="selectedLayer.color"
            show-swatches
            class="mx-auto"
        ></v-color-picker>
        </v-menu>
        <small v-if="isColorError" class="error-text">Access deeper layer to change color property.</small>
        <small v-else class="">This layer does not have color property.</small>
      </div>

      <div class="text-left" v-else>
        <v-menu
          offset-y
          :close-on-content-click="false"
        >
          <template v-slot:activator="{ on }">
            <v-btn
              :color="selectedLayer.color.hex"
              dark
              v-on="on"
              class="mr-2"
            >
            </v-btn>
            <span>{{ selectedLayer.color.hex }}</span>
          </template>
          <v-color-picker
            light
            v-model="selectedLayer.color"
            show-swatches
            class="mx-auto"
        ></v-color-picker>
        </v-menu>
      </div>
    </div>

    <!-- opacity controller -->
    <div class="property mt-8">
      <div class="d-flex align-items-center mb-2">
        <p class="property-title m-0">Opacity</p>
        <v-tooltip bottom nudge-right="65" nudge-bottom="60">
          <template v-slot:activator="{ on, attrs }">
            <em
              class="far fa-question-circle fa-sm ml-2"
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
          light
          solo
          v-model="selectedLayer.opacity"
          placeholder="Opacity"
          class="mr-3 col-12 col-md-6"
          @change="changeOpacity(selectedLayer.opacity)"
          suffix="%"
        ></v-text-field>
      </div>
    </div>

    <!-- stroke width controller -->
    <div class="property" v-show="selectedLayer.child.length == 0 && selectedLayer.type == 'Stroke'">
      <div class="d-flex align-items-center mb-2">
        <p class="property-title m-0">Stroke Width</p>
        <v-tooltip bottom nudge-right="50" nudge-bottom="60">
          <template v-slot:activator="{ on, attrs }">
            <em class="far fa-question-circle fa-sm ml-2" v-bind="attrs" v-on="on"></em>
          </template>
          <span>Number should be greater than or equal to 0</span>
        </v-tooltip>
      </div>
        <div class="position row no-gutters">
          <v-text-field
            light 
            solo 
            v-model="selectedLayer.strokeWidth" 
            placeholder="width" 
            class="mr-3 col-12" 
            @change="changeStrokeWidth"
            suffix="px"
          ></v-text-field>
        </div>
    </div>

    <!-- position controller -->
    <div class="property" v-show="selectedLayer.child.length > 0">
      <div class="d-flex align-items-center mb-2">
        <p class="property-title m-0">Position</p>
        <v-tooltip bottom nudge-right="100" nudge-bottom="60" max-width="350">
          <template v-slot:activator="{ on, attrs }">
            <em
              class="far fa-question-circle fa-sm ml-2"
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
          light
          solo
          prefix="X"
          suffix="px"
          v-model="selectedLayer.xPos"
          placeholder="0"
          @change="changeXPos(selectedLayer.xPos)"
          class="mr-3"
        ></v-text-field>
        <v-text-field
          light
          solo
          prefix="Y"
          suffix="px"
          v-model="selectedLayer.yPos"
          placeholder="0"
          @change="changeYPos(selectedLayer.yPos)"
        ></v-text-field>
      </div>
    </div>

    <!-- rotation controller -->
    <!-- <div class="property">
      <div class="d-flex align-items-center mb-2">
        <p class="property-title m-0">Rotation</p>
        <v-tooltip bottom nudge-right="60" nudge-bottom="60">
          <template v-slot:activator="{ on, attrs }">
            <i
              class="far fa-question-circle fa-sm ml-2"
              v-bind="attrs"
              v-on="on"
            >
            </i>
          </template>
          <span>Number should be between 0 and 360</span>
        </v-tooltip>
      </div>
      <div class="rotation m-0">
         <v-text-field
          light
          solo
          suffix="°"
          @change="changeRotation(selectedLayer.rotation)"
          v-model="selectedLayer.rotation"
          :placeholder="selectedLayer.rotation"
        ></v-text-field>
      </div>
    </div> -->

    <!-- shortcut dialog -->
    <v-dialog
      v-model="shortcutdialog"
      max-width="500"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          icon
          class="shortcut-btn btn mx-2 d-none d-sm-block" 
          :class="{ 'text-white': $vuetify.theme.dark }" 
          depressed 
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>mdi-information-outline</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title class="headline">
          Shortcuts
        </v-card-title>
        <v-card-text>
          <div class="d-flex align-items-center icon--text text-body-1 ml-3">
            <ul>
              <li class="my-2">shift <v-icon small color="icon">mdi-apple-keyboard-shift</v-icon> + space <v-icon small color="icon" class="mb-1">mdi-keyboard-space</v-icon> : Play / Pause</li>
              <li class="my-2">shift <v-icon small color="icon">mdi-apple-keyboard-shift</v-icon> + m : Dark Mode / Light Mode</li>
              <li class="my-2">shift <v-icon small color="icon">mdi-apple-keyboard-shift</v-icon> + v : Multiview / Singleview</li>
              <li class="my-2">shift <v-icon small color="icon">mdi-apple-keyboard-shift</v-icon> + 1/2/3/4 : Select Canvas</li>
              <li class="my-2">shift <v-icon small color="icon">mdi-apple-keyboard-shift</v-icon> + p : Snapshot</li>
              <li class="my-2">shift <v-icon small color="icon">mdi-apple-keyboard-shift</v-icon> + s : Export File to GIF</li>
              <li class="my-2">shift <v-icon small color="icon">mdi-apple-keyboard-shift</v-icon> + c : Shortcut</li>
            </ul>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="text"
            text
            @click="clickShortcutClose"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
module.exports = {
  name: 'property',
  data: function () {
    return {
      isColorError: false
    }
  },
  props: {
    selectedLayer: Object,
    canvasid: Number,
    multiview: Boolean,
    shortcutdialog: Boolean
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
    },
  },
  watch: {
    selectedLayer: {
      deep: true,
      handler() {
        if (this.selectedLayer.color.hex !== String()) {
          var currentLayerColor = this.selectedLayer.color
          let r = currentLayerColor.rgba.r / 255;
          let g = currentLayerColor.rgba.g / 255;
          let b = currentLayerColor.rgba.b / 255;
          setLayerColor(this.selectedLayer, r, g, b, this.canvasid);
        }
        this.isColorError = false
      }
    }
  },
  methods: {
    changeOpacity(opacity) {
      if (opacity && opacity <= 100 && opacity >= 0) {
        if (this.selectedLayer.visible) {
          setLayerOpacity(this.selectedLayer, Number(opacity), this.canvasid);
        }
      }
    },
    changeStrokeWidth(width) {
      setStrokeWidth(this.selectedLayer, Number(width), this.canvasid);
    },
    changeScaleWidth(scaleWidth) {
      if (scaleWidth >= 0) {
        if (this.selectedLayer.scaleHeight) {
          if (this.selectedLayer.scaleHeight >= 0) {
            setScale(this.selectedLayer, Number(scaleWidth), Number(this.selectedLayer.scaleHeight), this.canvasid)
          }
        } else {
          setScale(this.selectedLayer, Number(scaleWidth), 100, this.canvasid)
        }
      }
    },
    changeScaleHeight(scaleHeight) {
      if (scaleHeight >= 0) {
        if (this.selectedLayer.scaleWidth) {
          if (this.selectedLayer.scaleWidth >= 0) {
            setScale(this.selectedLayer, Number(this.selectedLayer.scaleWidth), Number(scaleHeight), this.canvasid)
          }
        } else {
          setScale(this.selectedLayer, 100, Number(scaleHeight), this.canvasid)
        }
      }
    },
    changeXPos(xPos) {
      if (this.selectedLayer.yPos) {
        setPosition(this.selectedLayer, Number(xPos), Number(this.selectedLayer.yPos), this.canvasid)
      } else {
        setPosition(this.selectedLayer, Number(xPos), 0, this.canvasid)
      }
    },
    changeYPos(yPos) {
      if (this.selectedLayer.xPos) {
        setPosition(this.selectedLayer, Number(this.selectedLayer.xPos), Number(yPos), this.canvasid)
      } else {
        setPosition(this.selectedLayer, 0, Number(yPos), this.canvasid)
      }
    },
    changeRotation(rotationDegree) {
      if (rotationDegree >= 0 && rotationDegree <= 360) {
        setRotation(this.selectedLayer, Number(rotationDegree), this.canvasid)
      }
    },
    clickColorError() {
      this.isColorError = true
    },
    clickShortcutClose() {
      this.shortcutdialog = false
      this.$emit('shortcutdialog-changed')
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

/* scroll */
.scroll-sect {
  overflow-y: scroll; 
  height: 92vh;
}

.error-text {
  color: rgb(255, 94, 94);
}

.shortcut-btn {
  position: fixed;
  bottom: 15px;
  right: 10px;
}
</style>