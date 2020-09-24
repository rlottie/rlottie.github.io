<template>
  <v-card height="150">
    <v-footer absolute class="font-weight-medium">
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
  </v-card>
</template>

<script>
module.exports = {
  // props: ["user"],
  // data: function () {
  //   return {
  //     who: "world",      
  //   };
  // },
};
</script>

<style>
</style>