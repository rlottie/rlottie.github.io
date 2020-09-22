<template>
  <div class="player d-flex flex-column justify-content-between">
    <div class="screen d-flex flex-column justify-content-center align-items-center">
      <!-- 가운데 canvas -->
      <div v-show="isContent">
        <span> Drag and Drop your Lottie JSON file to the window
        </span>
        <span> Or </span>
        <input class="" type="file" id="fileSelector" accept=".json">
      </div>
      <div class="" id="content">
        <canvas class="screen-canvas" id="myCanvas"></canvas>
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
      <div class="collapse" id="collapseExample">
        <div class="extra-tools">
          <p>이곳에</p>
          <p>다른 tool들이 들어갈 것이다아</p>
        </div>
      </div>
      <div class="d-flex justify-content-around align-items-center toolbox-basic">
        <span class="play-button" type="button" id="playButton" onclick="buttonClicked()"><i class="fas fa-pause"></i></span>
        <input class="player-slider" type="range" id="slider" min="0" max="100" value="0" oninput="onSliderDrag(this.value)">
        <span class="extra-tools" data-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">
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
// var temp = document.getElementById("myCanvas");
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
  height: 90vh;
  padding: 0;
}

.screen {
  background-color: none;
}

.toolbox {
  min-height: 70px;
  background-color:#1D3557;
}

.toolbox-basic {
  height: 70px;
  width: 100%;
}

.play-button {
  background-color: none;
  color: white;
}

.player-slider {
  min-width: 300px;
}

.extra-tools {
  color: white;
}

.screen-canvas {
  min-width: 50vh;
}
</style>