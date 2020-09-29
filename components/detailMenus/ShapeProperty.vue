<template>
  <div class="width-100-percent">
    <v-scroll-y-reverse-transition>
      <div v-show="isTransition">
        <div>
          <v-row
            class="px-5"
            align="center"
          >
            <v-col
              cols="12"
              class="pt-4"
            >
              <div class="text-left font-white">Color</div>
            </v-col>
          </v-row>
          <v-row
            align="center"
            justify="center"
          >
            <v-color-picker
              class="bg-transparent"
              v-model="color"
              flat
              dark
              width="285"
            />
          </v-row>
          <v-row
            class="pt-5 px-5"
            align="center"
          >
            <v-col 
              cols="8"
              class="py-0"
            >
              <div class="text-left font-white">StrokeWidth</div>
            </v-col>
            <v-col
              cols="4"
              class="py-0"
            >
              <v-text-field
                v-model="strokeWidth"
                class="input mt-0 pt-0"
                hide-details
                type="number"
                solo
                outlined
                dense
                dark
              />
            </v-col>
          </v-row>
          <v-row class="mb-4 px-5">
            <v-col
              cols="12"
              class="py-0"
            >
              <v-slider
                v-model="strokeWidth"
                class="align-center"
                max="100"
                min="0"
                track-color="#f0f0f0"
                color="grey"
                hide-details
              />
            </v-col>
          </v-row>
        </div>
      </div>
    </v-scroll-y-reverse-transition>
  </div>
</template>

<script>
module.exports = {
  name: 'shape-property',
  data() {
    return {
      interval: '',
      history: [],
      isTransition: false,
    };
  },
  computed: {
    ...Vuex.mapGetters(['layerList', 'keypath']),
    selectedLayer: {
      get() {
        return this.layerList[this.keypath];
      },
    },
    color: {
      get() {
        if (this.selectedLayer) {
          return this.selectedLayer.color;
        }
      },
      set(color) {
        if (this.selectedLayer) {
          this.selectedLayer.color = color;
          color = {
            r: color.rgba.r / 255,
            g: color.rgba.g / 255,
            b: color.rgba.b / 255,
            a: color.rgba.a * 100,
          };

          this.setShapeColor(color);
          this.history.push({
            property: 'ShapeColor',
            args: color,
          });
        }
      },
    },

    strokeWidth: {
      get() {
        if (this.selectedLayer) {
          return this.selectedLayer.strokeWidth;
        }
      },
      set(width) {
        if (this.selectedLayer) {
          this.selectedLayer.strokeWidth = width;
          this.setStrokeWidth(width);
          this.$forceUpdate();
          this.history.push({
            property: 'StrokeWidth',
            args: { strokeWidth: parseInt(width) },
          });
        }
      },
    },
  },
  mounted() {
    this.isTransition = true;
    var self = this;
    this.interval = setInterval(() => {
      self.clearHistory();
    }, 500);
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  methods: {
    ...Vuex.mapActions(['setShapeColor', 'setStrokeWidth', 'pushHistory']),
    clearHistory() {
      let len = this.history.length;
      if (!len) return;

      let top = this.history.pop();
      this.pushHistory(top);
      this.history = [];
    },
    closeSidebar() {
      this.$emit('call-close-menu-parent');
    },
  },
};
</script>

<style scoped>
span {
  color: white !important;
}

input {
  color: white !important;
}
</style>
