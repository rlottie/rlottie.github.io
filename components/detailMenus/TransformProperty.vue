<template>
  <div class="width-100-percent">
    <v-scroll-y-reverse-transition>
      <div v-show="isTransition">
        <div class="text-center">
          <v-row class="px-5">
            <v-col
              cols="12"
              class="justify-center pt-4"
            >
              <div class="text-left font-white">Anchor</div>
              <v-row class="pd-0 pt-2">
                <v-col
                  cols="8"
                  class="text-left py-0"
                >
                  <div class="pl-3 font-white">x</div>
                </v-col>
                <v-col
                  cols="4"
                  class="py-0"
                >
                  <v-text-field
                    type="number"
                    v-model="anchorX"
                    solo
                    dense
                    dark
                    hide-details
                    outlined
                  ></v-text-field>
                </v-col>
                <v-col
                  cols="8"
                  class="text-left py-0"
                >
                  <div class="pl-3 font-white">y</div>
                </v-col>
                <v-col
                  cols="4"
                  class="py-0"
                >
                  <v-text-field
                    type="number"
                    v-model="anchorY"
                    solo
                    dense
                    dark
                    hide-details
                    outlined
                  ></v-text-field>
                </v-col>
              </v-row>
              <div class="text-left pt-3 font-white">Position</div>
              <v-row class="pd-0 pt-2">
                <v-col
                  cols="8"
                  class="text-left py-0"
                >
                  <div class="pl-3 font-white">x</div>
                </v-col>
                <v-col 
                  cols="4"
                  class="py-0"
                >
                  <v-text-field
                    type="number" 
                    v-model="positionX"
                    solo
                    dense
                    dark
                    hide-details
                    outlined
                  ></v-text-field>
                </v-col>
                <v-col
                  cols="8"
                  class="text-left py-0"
                >
                  <div class="pl-3 font-white">y</div>
                </v-col>
                <v-col
                  cols="4"
                  class="py-0"
                >
                  <v-text-field
                    type="number"
                    v-model="positionY"
                    solo
                    dense
                    dark
                    hide-details
                    outlined
                  ></v-text-field>
                </v-col>
              </v-row>
              <div class="text-left pt-3 font-white">Scale</div>
              <v-row class="pd-0 pt-2">
                <v-col
                  cols="8"
                  class="text-left py-0"
                >
                  <div class="pl-3 font-white">width</div>
                </v-col>
                <v-col
                  cols="4"
                  class="py-0"
                >
                  <v-text-field
                    type="number"
                    v-model="scaleWidth"
                    solo
                    dense
                    dark
                    hide-details
                    outlined
                  ></v-text-field>
                </v-col>
                <v-col
                  cols="8"
                  class="text-left py-0"
                >
                  <div class="pl-3 font-white">height</div>
                </v-col>
                <v-col
                  cols="4"
                  class="py-0"
                >
                  <v-text-field
                    type="number"
                    v-model="scaleHeight"
                    solo
                    dense
                    dark
                    hide-details
                    outlined
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row class="pt-5">
                <v-col
                  cols="8"
                  class="py-0"
                >
                  <div class="text-left font-white">Rotation</div>
                </v-col>
                <v-col
                  cols="4"
                  class="py-0"
                >
                  <v-text-field
                    v-model="rotation"
                    class="mt-0 pt-0"
                    hide-details
                    type="number"
                    solo
                    outlined
                    dense
                    dark
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row class="mb-4">
                <v-col
                  cols="12"
                  class="py-0"
                >
                  <v-slider
                    v-model="rotation"
                    class="align-center"
                    max="360"
                    min="0"
                    hide-details
                    track-color="#f0f0f0"
                    color="grey"
                  ></v-slider>
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  cols="8"
                  class="py-0"
                >
                  <div class="text-left font-white">Opacity</div>
                </v-col>
                <v-col
                  cols="4"
                  class="py-0"
                >
                  <v-text-field
                    v-model="opacity"
                    class="mt-0 pt-0"
                    hide-details
                    type="number"
                    solo
                    outlined
                    dense
                    dark
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  cols="12"
                  class="py-0"
                >
                  <v-slider
                    v-model="opacity"
                    class="align-center"
                    max="100"
                    min="0"
                    hide-details
                    track-color="#f0f0f0"
                    color="grey"
                  ></v-slider>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </div>
      </div>
    </v-scroll-y-reverse-transition>
  </div>
</template>

<script>
module.exports = {
  name: 'TransformProperty',
  data() {
    return {
      history: [],
      layer: {},
      isTransition: false,
    };
  },
  mounted() {
    var self = this;
    this.isTransition = true;
    this.interval = setInterval(() => {
      self.clearHistory();
    }, 500);
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  computed: {
    ...Vuex.mapGetters(['layerList', 'keypath']),
    selectedLayer: {
      get() {
        return this.layerList[this.keypath];
      },
    },
    anchorX: {
      get() {
        if (this.selectedLayer) {
          return this.selectedLayer.anchorX;
        }
      },
      set(anchorX) {
        if (this.selectedLayer) {
          this.selectedLayer.anchorX = anchorX;
          this.setTrAnchor({
            x: this.selectedLayer.anchorX,
            y: this.selectedLayer.anchorY,
          });

          this.history.push({
            property: 'TrAnchor',
            args: {
              anchorX: parseInt(this.selectedLayer.anchorX),
              anchorY: parseInt(this.selectedLayer.anchorY),
            },
          });
        }
      },
    },

    anchorY: {
      get() {
        if (this.selectedLayer) {
          return this.selectedLayer.anchorY;
        }
      },
      set(anchorY) {
        if (this.selectedLayer) {
          this.selectedLayer.anchorY = anchorY;
          this.setTrAnchor({
            x: this.selectedLayer.anchorX,
            y: this.selectedLayer.anchorY,
          });

          this.history.push({
            property: 'TrAnchor',
            args: {
              anchorX: parseInt(this.selectedLayer.anchorX),
              anchorY: parseInt(this.selectedLayer.anchorY),
            },
          });
        }
      },
    },

    positionX: {
      get() {
        if (this.selectedLayer) {
          return this.selectedLayer.positionX;
        }
      },
      set(positionX) {
        if (this.selectedLayer) {
          this.selectedLayer.positionX = positionX;
          this.setTrPosition({
            x: this.selectedLayer.positionX,
            y: this.selectedLayer.positionY,
          });

          this.history.push({
            property: 'TrPosition',
            args: {
              positionX: parseInt(this.selectedLayer.positionX),
              positionY: parseInt(this.selectedLayer.positionY),
            },
          });
        }
      },
    },

    positionY: {
      get() {
        if (this.selectedLayer) {
          return this.selectedLayer.positionY;
        }
      },
      set(positionY) {
        if (this.selectedLayer) {
          this.selectedLayer.positionY = positionY;
          this.setTrPosition({
            x: this.selectedLayer.positionX,
            y: this.selectedLayer.positionY,
          });

          this.history.push({
            property: 'TrPosition',
            args: {
              positionX: parseInt(this.selectedLayer.positionX),
              positionY: parseInt(this.selectedLayer.positionY),
            },
          });
        }
      },
    },

    scaleWidth: {
      get() {
        if (this.selectedLayer) {
          return this.selectedLayer.scaleWidth;
        }
      },
      set(scaleWidth) {
        if (this.selectedLayer) {
          if (!scaleWidth) scaleWidth = 0;
          this.selectedLayer.scaleWidth = scaleWidth;
          this.setTrScale({
            w: this.selectedLayer.scaleWidth,
            h: this.selectedLayer.scaleHeight,
          });

          this.history.push({
            property: 'TrScale',
            args: {
              scaleWidth: parseInt(this.selectedLayer.scaleWidth),
              scaleHeight: parseInt(this.selectedLayer.scaleHeight),
            },
          });
        }
      },
    },

    scaleHeight: {
      get() {
        if (this.selectedLayer) {
          return this.selectedLayer.scaleHeight;
        }
      },
      set(scaleHeight) {
        if (!scaleHeight) scaleHeight = 0;
        if (this.selectedLayer) {
          this.selectedLayer.scaleHeight = scaleHeight;
          this.setTrScale({
            w: this.selectedLayer.scaleWidth,
            h: this.selectedLayer.scaleHeight,
          });

          this.history.push({
            property: 'TrScale',
            args: {
              scaleWidth: parseInt(this.selectedLayer.scaleWidth),
              scaleHeight: parseInt(this.selectedLayer.scaleHeight),
            },
          });
        }
      },
    },

    rotation: {
      get() {
        if (this.selectedLayer) {
          return this.selectedLayer.rotation;
        }
      },
      set(rotation) {
        if (this.selectedLayer) {
          this.selectedLayer.rotation = rotation;
          this.setTrRotation(this.selectedLayer.rotation);

          this.history.push({
            property: 'TrRotation',
            args: {
              rotation: parseInt(this.selectedLayer.rotation),
            },
          });
        }
      },
    },

    opacity: {
      get() {
        if (this.selectedLayer) {
          return this.selectedLayer.opacity;
        }
      },
      set(opacity) {
        if (this.selectedLayer) {
          this.selectedLayer.opacity = opacity;
          this.setTrOpacity(this.selectedLayer.opacity);

          this.history.push({
            property: 'TrOpacity',
            args: {
              opacity: parseInt(this.selectedLayer.opacity),
            },
          });
        }
      },
    },
  },
  methods: {
    ...Vuex.mapActions(['setTrAnchor', 'setTrPosition', 'setTrScale', 'setTrRotation', 'setTrOpacity', 'pushHistory']),
    closeSidebar() {
      this.$emit('call-close-menu-parent');
    },
    clearHistory() {
      let len = this.history.length;
      if (!len) return;

      let top = this.history.pop();
      this.pushHistory(top);
      this.history = [];
    },
  },
};
</script>

<style scoped>
.v-text-field .v-input__control .v-input__slot {
  min-height: 20px !important;
  display: flex !important;
  align-items: center !important;
}
</style>
