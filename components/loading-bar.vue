<template>
  <v-footer absolute color="#292c31" class="font-weight-medium">
    <v-col class="text-center" cols="12">
      <button id="playButton" onclick="buttonClicked()">Pause</button>
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
</style>