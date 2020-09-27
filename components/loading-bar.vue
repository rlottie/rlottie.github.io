<template>
  <v-footer absolute color="#292c31" class="font-weight-medium" style="min-width:745px;" ref="footer">
    <div 
      class="content-width-100 px-16">
      <v-row
        class="ma-0 pa-0"
        style="width:100%">
        <v-slider
          class="v-slider--active v-slider--focused"
          v-model="curFrame"
          min="0"
          ref="slider"
          :max="allFrame"
          :thumb-size="24"
          @Click="gotoFrame"
          hide-details="false"
        />
      </v-row>
    </div>
    <div
      class="content-width-100 px-14">
      <v-row
        class="ma-0 pa-0"
        align="center">
        <v-col
          class="py-0 px-2"
          cols="1"
        >
          <v-btn
            color="rgba(0, 153, 204, 1)"
            :outlined="false"
            :depressed="true"
            fab x-small
            @click="playAndPause"
          >
            <v-icon
              color="#ffffff"
              v-if="playing"
            >
              mdi-pause
            </v-icon>
            <v-icon
              color="#ffffff"
              v-else>
              mdi-play
            </v-icon>
          </v-btn>
        </v-col>
        <v-col
          class="pa-0"
          cols="2"
          style="min-width:100px;">
          <v-row
            class="ma-0 pa-0"
            align="center"
            justify="end">
            <v-col
              class="pa-0">
              <v-switch
                color="rgba(255, 255, 255, 1)"
                v-model="frameRateFlag"
                :label="frameRateFlag ? `Reverse` : `Play`"
                >
              </v-switch>
            </v-col>
          </v-row>
        </v-col>
        <v-col
          class="pa-0"
          offset="7"
          cols="2">
          <v-row
            class="px-5">
            <v-col
              align="end"
              class="pa-0">
              <v-menu top :offset-y="true" :offset-x="true" :left="true">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="rgba(0, 153, 204, 1)"
                    :outlined="false"
                    :depressed="true"
                    fab x-small
                    v-bind="attrs"
                    v-on="on"
                  >
                  <v-icon
                    color="#ffffff"
                  >
                  mdi-cog
                  </v-icon>
                </template>

                <v-list
                style="width:200px; background-color:rgba(33, 33, 33, 0.9)">
                  <v-list-item
                    v-for="(item, index) in rates"
                    :key="index"
                    @click="rateSelected = index; setFrameRate(item.rate);"
                  >
                    <v-list-item-title>
                      <v-icon
                        v-if="index === rateSelected"
                        color="rgba(255,255,255,1)">
                          mdi-check
                      </v-icon>
                      <v-icon v-else color="rgba(33, 33, 33, 0)">
                          mdi-check
                      </v-icon>
                      <span
                        style="color:rgba(255,255,255,1);">
                        &nbsp;&nbsp;{{item.rate}}
                      </span>
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
              <!-- <v-tooltip v-model="show" top style="z-index: 1000;">
                <template v-slot:activator="{ }">
                  <v-btn
                    color="rgba(0, 0, 0, 0)"
                    :outlined="false"
                    :depressed="true"
                    fab x-small
                    @click="show = !show"
                  >
                  <v-icon
                    color="#ffffff"
                  >
                  mdi-cog
                  </v-icon>
                </template>
                <v-list-item
                  v-for="(item, index) in rates"
                  :key="index"
                >
                <v-btn/>
                  {{item}} {{index}}
                </v-list-item>
              </v-tooltip> -->
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </div>
  </v-footer>
</template>

<script>
module.exports = {
  name: "loading-bar",
  // props: ["user"],
  data() {
    return {
      allFrame: 0,
      curFrame: 0,
      playing: true,
      frameRateFlag: false,
      frameRate: 1,
      show: false,
      rateSelected: 3,
      rates:[
        {
          rate: 0.25
        },
        {
          rate: 0.5
        },
        {
          rate: 0.75
        },
        {
          rate: 1
        },
        {
          rate: 1.25
        },
        {
          rate: 1.50
        },
        {
          rate: 1.75
        },
        {
          rate: 2
        }
      ]
    };
  },
  watch: {
    frameRateFlag: function(frame){
      RLottieModule.frameRate = this.frameRateFlag ? -this.frameRate : this.frameRate
    }
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

    console.dir();
    console.dir(window.innerHeight-this.$refs.footer.$el.clientHeight)
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
    },
    playAndPause(){
      buttonClicked();
      this.playing = RLottieModule.playing;
    },
    setFrameRate(value){
      this.frameRate = value;
      setFrameRate(value);
    }
  },
};
</script>

<style scoped>

.v-slider__thumb-container, .v-slider__track-background, .v-slider__track-fill {
  transition: none;
}

.content-width-100{
  width:100%;
}

.play-puase-icon{
  color: #ffffff;
}

.v-label.theme--light{
  color:#ffffff;
}
</style>