<template>
  <div class="player d-flex flex-column justify-content-between">
    <p>{{ canvasStyling[canvasShape] }}</p>
    <div class="screen my-auto d-flex flex-column justify-content-center align-items-center" id="content">
      <canvas
       v-show="isContent" 
       id="myCanvas" 
       :style="canvasStyling" 
      ></canvas>
      <div v-show="!isContent">
        <h5> Drag and Drop your Lottie JSON file to the window</h5>
      </div>
    </div>

    <div class="toolbox">
      <div class="collapse" id="collapseExtraTools">
        <div class="extra-tools d-flex justify-content-around align-items-center">
          <div class="d-flex flex-column justify-content-center align-items-center mx-3">
            <v-row align="center">
              <v-col cols="12">
                <v-select
                  dark
                  color="grey lighten-5"
                  v-model="defaultSpeed"
                  :items="speed"
                  :menu-props="{ top: true, offsetY: true }"
                  label="Play Speed"
                ></v-select>
              </v-col>
            </v-row>
          </div>
          <div class="d-flex flex-column justify-content-center align-items-center mx-3">
            <v-row align="center">
              <v-col cols="12">
                <v-select
                  dark
                  color="grey lighten-5"
                  v-model="defaultType"
                  :items="types"
                  :menu-props="{ top: true, offsetY: true }"
                  label="Play Type"
                ></v-select>
              </v-col>
            </v-row>
          </div>
          <div class="d-flex flex-column justify-content-center align-items-center mx-3">
            <v-row align="center">
              <v-col cols="12">
                <v-select
                  dark
                  color="grey lighten-5"
                  v-model="defaultDirection"
                  :items="directions"
                  :menu-props="{ top: true, offsetY: true }"
                  label="Play Direction"
                ></v-select>
              </v-col>
            </v-row>
          </div>
          <!-- <div class="d-flex flex-column justify-content-center align-items-center">
            <label class="mb-0" for="slider2">Canvas Resize</label>
            <input class="margin-left-10px" type="range" id="slider2" min="0" max="100" value="100"
              oninput="onResizeSliderDrag(this.value)">
          </div> -->
        </div>
      </div>
      <div class="d-flex justify-content-around align-items-center toolbox-basic">
        <span class="play-button" type="button" id="playButton" onclick="buttonClicked()"><i class="fas fa-pause"></i></span>
        <div class="d-flex flex-column align-items-between">
          <input class="player-slider mb-1" type="range" id="slider" min="0" max="100" value="0" oninput="onSliderDrag(this.value)">
          <div class="d-flex justify-content-between">
            <span class="badge badge-light" id="currentFrame"></span>
            <span class="badge badge-light" id="frameCount"></span>
          </div>
        </div>
        <span class="" data-toggle="collapse" href="#collapseExtraTools" role="button" aria-expanded="false" aria-controls="collapseExtraTools">
          <i class="fas fa-bars"></i>
        </span>
        <!-- <div class="bg_color_container bg-grey-lighter border-grey-light rounded border">
          <div class="text-grey-darkest font-bold justify-center text-xs"> Background Color</div>
          <div class="margin-left-10px color_button_group">
            <button class="color_button btn_white cursor-pointer"
              onclick="document.getElementById('content').style.backgroundColor = 'white'"> </button>
            <button class="color_button btn_black cursor-pointer"
              onclick="document.getElementById('content').style.backgroundColor = 'black'"> </button>
            <button class="color_button btn_red cursor-pointer"
              onclick="document.getElementById('content').style.backgroundColor = 'red'"> </button>
            <button class="color_button btn_green cursor-pointer"
              onclick="document.getElementById('content').style.backgroundColor = 'green'"> </button>
            <button class="color_button btn_blue cursor-pointer"
              onclick="document.getElementById('content').style.backgroundColor = 'blue'"> </button>
          </div>
        </div> -->
        <!-- <div class="speed bg-grey-lighter border-grey-light rounded border">
          <div class="margin-left-10px text-grey-darkest font-bold justify-center text-xs">Canvas Resize </div>
          <input class="margin-left-10px" type="range" id="slider" min="0" max="100" value="100" id="slider"
            oninput="onResizeSliderDrag(this.value)">
        </div> -->
      </div>
    </div>
  
  </div>
</template>

<script>
module.exports = {
  name: 'player',

  props: {
    backgroundColor: String,
    canvasShape: Number,
  },

  data: function () {
    return {
      content: true,
      defaultSpeed: '1.0',
      defaultType: 'Autoplay',
      defaultDirection: 'Forward',
      speed: ['0.5', '1.0', '1.5', '2.0'],
      types: ['Autoplay', 'Hover', 'Click', 'Bounce'],
      directions: ['Forward', 'Backward'],
    }
  },

  computed: {
    isContent() {    
      // var temp = document.getElementById("myCanvas")
      if (true) {
        return true
      } else {
        return false
      }
    },

    canvasStyling() {
      if (this.canvasShape == 0) {
        return {
          'background-color': this.backgroundColor,
          'border-radius': 0
        }
      } else {
        return {
          'background-color': this.backgroundColor,
          'border-radius': '50%'
        }
      }
    }
  },

  methods: {
  }
}
</script>

<style scoped>
.player {
  height: 92vh;
  padding: 0;
  background-color: none;
}

.screen {
  height: 70vh;
  background-color: none
}

#myCanvas {
  /* border-radius: 50%; */
}

.toolbox {
  background-color:#1D3557;
  color: #fdfdfd
}

.toolbox-basic {
  height: 10vh;
  width: 100%;
}

.play-button {
  background-color: none;
}

.player-slider {
  min-width: 30vw;
}

.extra-tools {
  height: 12vh;
}

.screen-canvas {
  /* max-width: 50vw;
  max-height: 50vh; */
}
</style>