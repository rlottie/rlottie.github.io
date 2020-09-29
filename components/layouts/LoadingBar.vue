<template>
  <v-footer
    color="#293039"
    class="font-weight-medium py-0 border-left-1"
    ref="footer"
  >
    <div class="content-width-100">
      <v-row class="ma-0 pa-0">
        <v-col 
          cols="12"
          class="py-0"
        >
          <v-row class="ma-0 pa-0">
            <v-col cols="1"></v-col>
            <v-col
              cols="1"
              class="ma-0 pa-0"
              align="right"
            >
              <v-btn
                dark
                depressed
                icon
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
                  v-else
                >
                  mdi-play
                </v-icon>
              </v-btn>
            </v-col>
            <v-col
              cols="8"
              id="snapShot"
              class="ma-0 pa-0"
              @mousemove="snapShotFrame($event, true)"
              @mouseleave="snapShotFrame($event, false)"
              style="padding-top: 2px !important"
            >
              <v-slider
                class="v-slider--active v-slider--focused"
                :value="curFrame"
                :min="0"
                :max="frameCount"
                @change="gotoFrame"
                track-color="#f0f0f0"
                color="grey"
                hide-details
              />
            </v-col>
            <v-col
              cols="2"
              class="ma-0 pa-0"
              align="center"
            >
              <v-tooltip
                top
                open-on-hover
                close-delay="100"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    dark
                    v-bind="attrs"
                    v-on="on"
                    icon
                    @click="isReverse = !isReverse"
                  >
                    <v-icon 
                      :color="'white'"
                      dark
                      size="30"
                    > 
                      mdi-swap-horizontal
                    </v-icon>
                  </v-btn>
                </template>
                <span>Reverse(Ctrl + R)</span>
              </v-tooltip>
              <v-menu top :offset-y="true">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    dark
                    :outlined="false"
                    :depressed="true"
                    icon
                    size="30"
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon dark> mdi-cog </v-icon>
                  </v-btn>
                </template>

                <v-list class="comb-list">
                  <v-list-item
                    v-for="(item, index) in speedRates"
                    :key="index"
                    @click="rateSelected = index; calcFrameRate(item);"
                  >
                    <v-list-item-title>
                      <v-icon
                        v-if="index === rateSelected"
                        color="rgba(255,255,255,1)"
                      >
                        mdi-check
                      </v-icon>
                      <v-icon
                        v-else
                        color="rgba(33, 33, 33, 0)"
                      >
                        mdi-check
                      </v-icon>
                      <span style="color: rgba(255, 255, 255, 1)"> &nbsp;&nbsp;{{ item }} </span>
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
              <v-tooltip
                top
                open-on-hover
                close-delay="100"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    dark
                    v-bind="attrs"
                    v-on="on"
                    icon
                    @click="isBorder = !isBorder"
                  >
                    <v-icon
                      :color="'white'"
                      dark
                      size="30"
                    > 
                      mdi-crop-square
                    </v-icon>
                  </v-btn>
                </template>
                <span>Border(Ctrl + B)</span>
              </v-tooltip>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </div>
  </v-footer>
</template>
<script>
module.exports = {
  name: 'loading-bar',
  data() {
    return {
      playing: true,
      isReverse: false,
      show: false,
      rateSelected: 3,
      speedRates: [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0],
      isPrev: false,
      isNext: false,
      isBorder: false,
    };
  },
  watch: {
    isReverse: function () {
      this.calcFrameRate(-this.frameRate);
    },
    isBorder: function () {
      this.changeCanvasBorderColor();
    },
  },
  computed: {
    ...Vuex.mapGetters(['curFrame', 'frameCount', 'frameRate']),
  },
  mounted() {
    var self = this;

    document.addEventListener(
      'keydown',
      function (e) {
        if (e.ctrlKey && e.which == 82) {
          e.preventDefault();
        } else if (e.ctrlKey && e.which == 79) {
          e.preventDefault();
        } else if (e.ctrlKey && e.which == 76) {
          e.preventDefault();
        }
      },
      false,
    );

    // Shortcut key function binding
    document.addEventListener('keydown', function (e) {
      if (e.which == 32) {
        // Pause and Play : Space
        self.playAndPause();
      } else if (e.ctrlKey && e.which == 82) {
        // Reverse and Play : Ctrl + R
        self.isReverse = !self.isReverse;
      } else if (e.ctrlKey && e.which == 66) {
        // canvas border line : Ctrl + B
        self.isBorder = !self.isBorder;
        self.changeCanvasBorderColor();
      }
    });
  },
  methods: {
    ...Vuex.mapMutations(['setCurFrame', 'setFrameRate', 'setSnapShotFrame']),
    ...Vuex.mapActions(['renderSnapShot']),
    gotoFrame(frame) {
      this.setCurFrame(frame);
      onSliderDrag(frame);
    },
    snapShotFrame(evt, flag) {
      const x = evt.pageX - $('#snapShot').offset().left;
      const len = $('#snapShot').width();
      let frame = (x / len) * this.frameCount;
      if (frame < 0) {
        frame = 0;
      } else if (frame > this.frameCount) {
        frame = this.frameCount;
      }

      this.setSnapShotFrame(frame);
      this.renderSnapShot();

      this.$emit('pointer', {
        x: evt.pageX,
        y: $('#snapShot').offset().top,
        isThumbnail: flag,
      });
    },
    playAndPause() {
      buttonClicked();
      this.playing = RLottieModule.playing;
    },
    calcFrameRate(value) {
      let curFrameRate = value;
      if (this.isReverse) {
        curFrameRate = curFrameRate > 0 ? -curFrameRate : curFrameRate;
      } else {
        curFrameRate = curFrameRate > 0 ? curFrameRate : -curFrameRate;
      }
      this.setFrameRate(curFrameRate);
    },
    changeCanvasBorderColor() {
      if (!this.isBorder) {
        document.getElementById('canvas-box').style.borderStyle = 'none';
      } else {
        document.getElementById('canvas-box').style.border = '1px solid black';
      }
    },
  },
};
</script>

<style scoped>
.v-slider__thumb-container, .v-slider__track-background, .v-slider__track-fill {
  transition: none;
}

.content-width-100 {
  width: 100%;
}

.play-puase-icon {
  color: #ffffff;
}

.v-label.theme--light {
  color: #ffffff;
}

.v-slider--horizontal {
  cursor: pointer;
}

.v-footer {
  min-width: 755px;
  z-index: 100;
}

.v-row {
  width: 100%;
}
</style>
