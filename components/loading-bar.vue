<template>
  <v-footer absolute color="#292c31" class="font-weight-medium" style="margin-=">
    <v-row>
      <v-col cols="4">
        <button id="playButton" onclick="buttonClicked()">Pause</button>
      </v-col>
      <v-col cols="4" class="text-center">
        <v-slider
          class="v-slider--active v-slider--focused"
          v-model="curFrame"
          min="0"
          ref="slider"
          :max="allFrame"
          :thumb-size="24"
          thumb-label="always"
          @Click="gotoFrame"
        ></v-slider>
      </v-col>
      <v-col cols="4">
        test
      </v-col>
    </v-row>
  </v-footer>
</template>

<script>
module.exports = {
  name: "loading-bar",
  // props: ["user"],
  data() {
    return {
      allFrame: 137,
      curFrame: 0,
    };
  },
  mounted() {
    var setFrame = this.setFrame;
    var setCurFrame = this.setCurFrame;
    window.addEventListener("AllFrameEvent", function(e){
      setFrame(e.detail.frame);
    })
    window.addEventListener("CurrentFrameEvent", function(e){
      setCurFrame(e.detail.frame);
    })
  },
  methods: {
    setFrame(value){
      this.allFrame = value;
    },
    setCurFrame(value){
      this.curFrame = value;
    },
    gotoFrame(value){
      onSliderDrag(this.curFrame);
    }
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

.v-slider__thumb-container, .v-slider__track-background, .v-slider__track-fill {
  transition: none;
}
</style>