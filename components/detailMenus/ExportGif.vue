<template>
  <div class="width-100-percent">
    <v-scroll-y-reverse-transition>
      <div v-show="isTransition">
        <div>
          <v-row
            class="pb-3 px-5"
            align="center"
          >
            <v-col
              cols="12"
              class="py-0 mt-4"
            >
              <div class="text-left font-white">Background Color</div>
            </v-col>
          </v-row>
          <v-row
            class="mb-4 pl-5"
            align="center"
            justify="center"
          >
            <v-btn
              class="ml-1"
              v-for="(color, idx) in colors"
              fab
              :color="color"
              x-small
              :key="`${idx}_color`"
              @click="selectColor(color, true)"
            >
            </v-btn>
            <div
              class="v-color-picker__dot ml-1 picker-dot"
              @click="selectColor('#000000', false)"
            ></div>
          </v-row>
          <v-row
            align="center"
            justify="center"
          >
            <v-color-picker
              class="bg-transparent"
              v-show="isColor"
              v-model="picker"
              flat
              hide-mode-switch
              dark
              width="280"
            />
          </v-row>
          <v-row
            align="center"
            justify="center"
            class="pa-0 ma-0 width-100-percent"
          >
            <img
              id="convert-gif"
              src=""
              class="width-90-percent"
            />
          </v-row>
          <v-row
            align="center"
            justify="center"
            class="pa-0 ma-0 mt-4 width-100-percent"
          >
            <v-btn
              @click="convertGIF"
              :loading="loading"
              id="convert-btn"
            >
              Convert to GIF
            </v-btn>
          </v-row>
        </div>
      </div>
    </v-scroll-y-reverse-transition>
  </div>
</template>

<script>
module.exports = {
  name: 'export-gif',
  data() {
    return {
      colors: [
        '#FFFFFF',
        '#EB7D46',
        '#B4EB46',
        '#46EB7D',
        '#46B4EB',
        '#7D46EB',
        '#EB46B4',
      ],
      hex: '#000000',
      isColor: false,
      loading: false,
      type: 'hex',
      isTransition: false,
    };
  },
  mounted() {
    this.isTransition = true;
  },
  computed: {
    picker: {
      get() {
        return this[this.type];
      },
      set(v) {
        this[this.type] = v;
      },
    },
  },
  methods: {
    closeSidebar() {
      this.$emit('call-close-menu-parent');
    },
    convertGIF() {
      var self = this;
      self.loading = true;
      var hex = parseInt(this.picker.slice(1), 16);
      var r = (hex >> 16) & 0xff;
      var g = (hex >> 8) & 0xff;
      var b = hex & 0xff;

      var gif = new GIF({
        workers: 8,
        quality: 1,
        background: '#fff',
        transparent: 'rgba(255,255,255,0)',
      });

      for (let i = 0; i <= RLottieModule.frameCount; i++) {
        var buffer = RLottieModule.lottieHandle.render(i, 300, 300);
        var result = Uint8ClampedArray.from(buffer);
        var imageData = new ImageData(result, 300, 300);

        for (let i = 0; i < imageData.data.length; i += 4) {
          if (!imageData.data[i + 3]) {
            imageData.data[i] = r;
            imageData.data[i + 1] = g;
            imageData.data[i + 2] = b;
            imageData.data[i + 3] = 0;
          }
        }
        gif.addFrame(imageData, { delay: 1000 / 60 });
      }

      gif.on('finished', function (blob) {
        var reader = new FileReader();
        reader.onload = function (e) {
          document.getElementById('convert-gif').src = reader.result;
        };
        document.getElementById('convert-gif').src = URL.createObjectURL(blob);
        var dataStr = URL.createObjectURL(blob);
        var downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute('href', dataStr);
        downloadAnchorNode.setAttribute(
          'download',
          Math.random().toString(36).substr(2, 8).toUpperCase() + '.gif',
        );
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        self.loading = false;
      });

      gif.render();
    },
    selectColor(color, flag) {
      this.picker = color;
      this.isColor = flag;
    },
  },
};
</script>

<style scoped>
span {
  color: white !important;
}

.picker-dot {
  background-color: hsla(0, 0%, 100%, 0.12);
  cursor: pointer;
}

#convert-btn {
  background-color: rgba(0, 153, 204, 1);
  width: 90%;
}
</style>
