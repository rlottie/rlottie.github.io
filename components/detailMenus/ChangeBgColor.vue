<template>
  <div class="text-center mt-5">
    <h2 class="mt-4" style="color: white">Change Background Color</h2>
    <v-row>
      <v-col class="d-flex justify-center mt-5">
        <v-color-picker hide-mode-switch v-model="color"> </v-color-picker>
      </v-col>
    </v-row>
    <v-btn @click="changeCanvasColor">Canvas</v-btn>
    <v-btn @click="changeBgColor">Background</v-btn>
    <div
      class="d-flex flex-column justify-content-center align-items-start mt-5 mb-3"
    >
      <h2 class="mt-9" style="color: white">Resize Canvas</h2>
      <input
        type="range"
        min="0"
        max="100"
        value="100"
        oninput="onResizeSliderDrag(this.value)"
      />
    </div>
    <div>
      <h2 class="mt-4" style="color: white">Insert Image</h2>
      <input
        type="file"
        id="backgroundImg"
        accept="image/*"
        @change="setBackgroundImg"
      />
      <v-btn @click="backgroundReset">Background Reset</v-btn>
    </div>
  </div>
</template>

<script>
module.exports = {
  name: "change-bg-color",
  data() {
    return {
      type: "hex",
      hex: "#FF00FF",
      hexa: "#FF00FFFF",
      rgba: { r: 255, g: 0, b: 255, a: 1 },
      hsla: { h: 300, s: 1, l: 0.5, a: 1 },
      hsva: { h: 300, s: 1, v: 1, a: 1 },
      backgroundImg: false,
    };
  },
  methods: {
    changeCanvasColor() {
      document.getElementById("myCanvas").style.backgroundColor = this.color;
    },
    changeBgColor() {
      document.getElementById("content").style.backgroundColor = this.color;
    },
    backgroundReset() {
      if (this.backgroundImg){
        var parentDiv = document.querySelector("#img-background")        
        var childImg = document.querySelector("#background")
        parentDiv.removeChild(childImg)
      }
      this.backgroundImg = false
    },
    setBackgroundImg(event) {
      if (this.backgroundImg) {
        var parentDiv = document.querySelector("#img-background")        
        var childImg = document.querySelector("#background")
        parentDiv.removeChild(childImg)
      }
      var file = event.target.files;
      var img = document.createElement("img");
      img.id = "background"
      var reader = new FileReader();
      reader.onload = (function (aImg) {
        return function (e) {
          aImg.src = e.target.result;
        };
      })(img);
      if (file) {
        reader.readAsDataURL(file[0]);
      }
      document.querySelector("#img-background").appendChild(img);
      this.backgroundImg = true
    },
  },
  computed: {
    color: {
      get() {
        return this[this.type];
      },
      set(v) {
        this[this.type] = v;
      },
    },
    showColor() {
      if (typeof this.color === "string") return this.color;
      return JSON.stringify(
        Object.keys(this.color).reduce((color, key) => {
          color[key] = Number(this.color[key].toFixed(2));
          return color;
        }, {}),
        null,
        2
      );
    },
  },
};
</script>

<style>
input[type="range"] {
  -webkit-appearance: none;
  overflow: hidden;
  height: 10px;
  background: transparent;
  cursor: pointer;
  background: #92140c;
  border-radius: 3px; /* iOS */
}
input[type="range"]:focus {
  outline: none;
}
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 10px;
  height: 10px;
  background: #92140c;
  box-shadow: -100vw 0 0 100vw #edb230;
  cursor: pointer;
  border-radius: 1px; /* iOS */
}
</style>