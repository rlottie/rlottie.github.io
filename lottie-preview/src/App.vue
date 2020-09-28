<template>
  <div class="window">
      <div class="header bg-grey-lighter border-grey-light rounded border or">
        <span text-grey-darkest font-bold justify-center text-xs>  Drag and Drop your Lottie JSON file to the window </span>
        <span text-grey-darkest font-bold justify-center text-xs>  Or </span>
        <input class="cursor-pointer" type="file" id="fileSelector" accept=".json">
      </div>
      <div class="content " id="content">
        <canvas class="" id="myCanvas" width="100" height="100" style="border:1px solid #dae1e7;"></canvas>
      </div>
      <div class="footer">  
        <div class="slider bg-grey-lighter border-grey-light rounded border">
          <button class="playButton cursor-pointer" type="button" id="playButton" onclick="buttonClicked()">Pause</button>
          <input  class="margin-left-10px" type="range" id="slider" min="0" max="100" value="0" oninput="onSliderDrag(this.value)">
        </div>
        <div class="bg_color_container bg-grey-lighter border-grey-light rounded border">
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
        </div>
        <div class="speed bg-grey-lighter border-grey-light rounded border"> 
          <div class="margin-left-10px text-grey-darkest font-bold justify-center text-xs">Canvas Resize </div>
          <input  class="margin-left-10px" type="range" id="slider" min="0" max="100" value="100" oninput="onResizeSliderDrag(this.value)">
        </div>
    <!-- Horizontal Scroll frameList -->

      <div style="white-space:nowrap; overflow:auto;  width:500px; height:150px;" id="frameList">
      </div>


      </div>
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {
  },
  created() {
    let lottieScript = document.createElement('script')
    lottieScript.setAttribute('src', "main.js")
    lottieScript.setAttribute('type', "text/javascript")
    lottieScript.async = true
    lottieScript.defer = true
    console.log(lottieScript.src)
    document.head.appendChild(lottieScript)
  }
}
</script>

<style src="./assets/style.css">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
