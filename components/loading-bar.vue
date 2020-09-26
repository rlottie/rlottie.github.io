<template>
  <v-footer
    absolute
    color="#292c31"
    class="font-weight-medium"
    style="margin-="
  >
    <v-col class="text-center" cols="12">
      <button class="mx-3" id="playButton" onclick="buttonClicked()">
        Pause
      </button>
      <input
        id="slider"
        type="range"
        min="0"
        max="100"
        value="0"
        oninput="onSliderDrag(this.value)"
      />
    </v-col>
  </v-footer>
</template>

<script>
module.exports = {
  name: "loading-bar",
  // props: ["user"],
  data() {
    return {};
  },
};
</script>

<style scoped>
button {
  border-radius: 2px;
  background-color: #9e9e9e;
  color: black;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
}
input[type="range"] {
  -webkit-appearance: none;
  overflow: hidden;
  width: 450px;
  height: 10px;
  background: transparent;
  cursor: pointer;
  background: #92140C;
  border-radius: 5px; /* iOS */
}
input[type="range"]:focus {
  outline: none;
}
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 10px;
  height: 10px;
  background: #edb230;
  box-shadow: -100vw 0 0 100vw #edb230;
  cursor: pointer;
}
</style>