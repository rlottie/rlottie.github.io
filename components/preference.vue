<template>
  <div class="sidebar">
    <p class="title">
      Preference
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
    
    <!-- background color controller -->
    <div class="preference" v-if="canvasstyle">
      <p class="preference-title mb-2">Background color</p>
      <div class="text-left">
        <v-menu 
          offset-y 
          :close-on-content-click="false"
          >
        <template v-slot:activator="{ on }">
          <v-btn
            :color="canvasstyle.backgroundColor.hex"
            dark
            v-on="on"
            class="mr-2"
          >
          </v-btn>
          <span>{{ canvasstyle.backgroundColor.hex }}</span>
        </template>
        <v-color-picker
          light
          v-model="canvasstyle.backgroundColor"
          show-swatches
          class="mx-auto"
        ></v-color-picker>
        </v-menu>
      </div>
    </div>


    <!-- Dimension controller -->
    <div class="preference" v-if="canvasstyle">
      <p class="preference-title mb-2">Canvas Resize</p>
      <div class="position d-flex">
        <v-text-field
          light
          solo
          prefix="W"
          suffix="px"
          v-model="canvasstyle.width"
          class="mr-3 bg-white"
          hide-details
          @change="changeXDimension"
        ></v-text-field>
        <v-text-field
          light
          solo
          prefix="H"
          suffix="px"
          v-model="canvasstyle.height"
          class="bg-white"
          hide-details
          @change="changeYDimension"
        ></v-text-field>
      </div>
    </div>

    <!-- canvas rotation controller -->
    <div class="preference" v-if="canvasstyle">
      <p class="preference-title mb-2">Canvas Rotation</p>
      <div class="row align-items-center no-gutters">
        <div class="col-12 col-md-4">
          <v-text-field 
            light 
            solo 
            suffix="°"
            hide-details
            @change="changeCanvasRotation(canvasstyle.degree)"
            v-model="canvasstyle.degree"
          ></v-text-field>
        </div>
        <v-spacer></v-spacer>
        <v-slider
          v-model="canvasstyle.degree"
          @change="changeCanvasRotation(canvasstyle.degree)"
          max="360"
          class="col-12 col-md-7"
          hide-details
          color="preview"
        ></v-slider>
      </div>
    </div>

    <!-- canvas shape -->
    <div class="preference" v-if="canvasstyle">
      <p class="preference-title mb-2">Canvas Shape</p>
      <v-btn-toggle light v-model="canvasstyle.borderShape" mandatory @change="changeBorderShape">
        <v-btn>
          <v-icon class="fas fa-square-full text-dark"></v-icon>
        </v-btn>
        <v-btn>
          <v-icon class="fas fa-circle text-dark"></v-icon>
        </v-btn>
      </v-btn-toggle>
    </div>

    <!-- border options -->
    <div class="preference" v-if="canvasstyle">
      <p class="preference-title mb-0">Border</p>
      <div class="row align-items-center no-gutters">
        <!-- border color -->
        <div class="col-12 col-md-8 mb-2 mb-md-0">
          <v-menu 
            offset-y 
            :close-on-content-click="false"
          >
            <template v-slot:activator="{ on }">
              <v-btn
                :color="canvasstyle.borderColor.hex"
                dark
                v-on="on"
                class="mr-2"
              >
              </v-btn>
              <span>{{ canvasstyle.borderColor.hex }}</span>
            </template>
            <v-color-picker
              light
              v-model="canvasstyle.borderColor"
              show-swatches
              class="mx-auto"
            ></v-color-picker>
          </v-menu>
        </div>
        <v-spacer></v-spacer>
        <!-- border width -->
        <div class="col-12 col-md-4">
          <v-text-field
            light
            solo
            suffix="px"
            v-model="canvasstyle.borderWidth"
            class="bg-white"
            hide-details
            @change="changeBorderWidth"
          ></v-text-field>
        </div>
      </div>
    </div>

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
  name: 'preference',
  props: {
    canvasid: Number,
    canvas: Object,
    canvasstyle: Object,
    multiview: Boolean,
    shortcutdialog: Boolean,
  },
  data: function () {
    return {
    }
  },
  watch: {
    canvasstyle: {
      deep: true,
      handler() {
        this.canvas.style.backgroundColor = this.canvasstyle.backgroundColor.hex
        this.canvas.style.borderColor = this.canvasstyle.borderColor.hex
      }
    }
  },
  methods: {
    changeXDimension() {
      this.canvas.style.width = this.canvasstyle.width + "px"
    },
    changeYDimension() {
      this.canvas.style.height = this.canvasstyle.height + "px"
    },
    changeBorderWidth() {
      this.canvas.style.borderWidth = this.canvasstyle.borderWidth + "px"
    },
    changeBorderShape() {
      if (this.canvasstyle.borderShape) {
        this.canvas.style.borderRadius = "50%"
      } else {
        this.canvas.style.borderRadius = 0
      }
    },
    changeCanvasRotation(degree) {
      this.canvas.style.transform = `rotate(${degree}deg)`;
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
  
  .shortcut-btn {
    position: absolute;
    bottom: 15px;
    right: 10px;
  }
</style>