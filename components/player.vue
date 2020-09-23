<template>
  <div class="player d-flex flex-column justify-content-between">
    <div class="screen my-auto d-flex flex-column justify-content-center align-items-center" id="content">
      <canvas v-show="isContent" id="myCanvas"></canvas>
      <div v-show="!isContent">
        <h5> Drag and Drop your Lottie JSON file to the window</h5>
      </div>
    </div>

    <div class="toolbox">
      <!-- 재생 설정 -->
      <!-- <div class="panel-group">
        <div class="panel panel-default">    
          <div id="collapse1" class="panel-collapse collapse">
              <div class="panel-body">Panel Body</div>
              <div class="panel-footer">Panel Footer</div>
          </div>

          <div class="panel-heading">
            <h4 class="panel-title">
                <a data-toggle="collapse" href="#collapse1">Collapsible panel</a>
            </h4>
          </div>
        </div>
      </div> -->
      <div class="collapse" id="collapseExtraTools">
        <div class="extra-tools d-flex justify-content-between align-items-center">
          <!-- <div class="slider bg-grey-lighter border-grey-light rounded border">
            <button class="playButton cursor-pointer" type="button" id="playButton" onclick="buttonClicked()">Pause</button>
            <input class="margin-left-10px" type="range" id="slider" min="0" max="100" value="0" id="slider"
              oninput="onSliderDrag(this.value)">
          </div> -->
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
          <div>

          </div>
          <div class="d-flex flex-column justify-content-center align-items-center">
            <label class="mb-0" for="slider2">Canvas Resize</label>
            <input class="margin-left-10px" type="range" id="slider2" min="0" max="100" value="100"
              oninput="onResizeSliderDrag(this.value)">
          </div>
          <div>
            
          </div>
        </div>
      </div>
      <div class="d-flex justify-content-around align-items-center toolbox-basic">
        <span class="play-button" type="button" id="playButton" onclick="buttonClicked()"><i class="fas fa-pause"></i></span>
        <input class="player-slider" type="range" id="slider" min="0" max="100" value="0" oninput="onSliderDrag(this.value)">
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
  data: function () {
    return {
      content: true
    }
  },
  computed: {
    isContent() {      
      if (this.content) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>

<style scoped>
.player {
  height: 92vh;
  padding: 0;
}

.screen {
  height: 75vh;
  background-color: none;
}

.toolbox {
  background-color:#1D3557;
  color: #fdfdfd
}

.toolbox-basic {
  height: 8vh;
  width: 100%;
}

.play-button {
  background-color: none;
}

.player-slider {
  min-width: 30vw;
}

.extra-tools {
  height: 10vh;
}

.screen-canvas {
  /* max-width: 50vw;
  max-height: 50vh; */
}
</style>