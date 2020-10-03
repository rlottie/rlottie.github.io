<template>
  <div class="navbar d-flex justify-content-between">
    <!-- logo -->
    <div class="d-flex align-items-center">
        <img class="logo" src="../static/logo.png" alt="logo">
    </div>

    <!-- button group -->
    <div class="d-flex">
      <div class="d-none d-sm-block">
        <!-- single/multi view -->
        <button class="multiview-btn btn mx-2 view-count preview text-white" @click="changeViewCount">{{ viewCount }}</button>
        <!-- light/dark mode -->
        <button v-if="$vuetify.theme.dark" class="btn mx-2 mode" @click="changeMode"><v-icon class="text-dark">mdi-white-balance-sunny</v-icon></button>
        <button v-else class="btn mx-2 mode" @click="changeMode"><em class="fas fa-moon text-white"></em></button>
      </div>
      <!-- import file -->
      <div class="filebox mx-2">
        <label for="fileSelector"><span class="d-inline-block pt-1">New Lottie</span></label>
        <input class="upload-hidden" type="file" id="fileSelector" accept=".json" placeholder="New Lottie">
      </div>
      <!-- export to gif -->
      <v-dialog
        v-model="exportdialog"
        max-width="500"
      >
        <template v-slot:activator="{ on, attrs }">
          <button
            class="btn accent mx-2" 
            :class="{ 'text-white': $vuetify.theme.dark }" 
            depressed 
            v-bind="attrs"
            v-on="on"
          >
            Export
            <em class="fas fa-download ml-2"></em>
          </button>
        </template>
        <v-card>
          <v-card-title class="headline mb-2">
            Export file to GIF
          </v-card-title>
          <v-card-subtitle>
            Size: {{canvasWidth}}px x {{canvasHeight}}px
          </v-card-subtitle>
          <v-card-text>
            <div class="d-flex align-items-center">
              <v-text-field
                solo-reverse
                color="text"
                placeholder="File name"
                v-model="gifname"
              ></v-text-field>
              <v-btn class="ml-4" color="accent" @click="downloadGIF" :disabled="downloadDisabled">Download</v-btn>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="text"
              text
              @click="clickExportDialogClose"
              :disabled="closeDisabled"
            >
              Close
            </v-btn>
          </v-card-actions>
          <v-overlay :value="exportOverlay" opacity="0.6">
            <div class="d-flex flex-column justify-content-center align-items-center">
              <h4 class="mb-5">Creating GIF file...</h4>
              <v-progress-circular
                indeterminate
                size="50"
              ></v-progress-circular>
            </div>
          </v-overlay>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
module.exports = {
  name: 'navbar',
  props: {
    exportdialog: Boolean,
  },
  data: function () {
    return {
      viewCount: 'Multi View',
      gifname: "",
      canvasWidth: 0,
      canvasHeight: 0,
      exportOverlay: false,
      downloadDisabled: false,
      closeDisabled: false,
    }
  },
  watch: {
    exportdialog(val) {
      if(val) {
        this.canvasWidth = getRModule(rlottieHandler.mainCanvasId).canvas.width;
        this.canvasHeight = getRModule(rlottieHandler.mainCanvasId).canvas.height;
        pause();
      } else {
        document.getElementById("playButton").innerHTML = "<i class='fas fa-pause'></i>";
        rlottieHandler.play();
      }
    }
  },
  methods: {
    changeMode() {
        this.$vuetify.theme.dark = !this.$vuetify.theme.dark
    },
    changeViewCount() {
      if (this.viewCount === 'Multi View') {
        this.viewCount = 'Single View'
        this.$emit('viewcount-changed', true)
      } else {
        this.viewCount = 'Multi View'
        this.$emit('viewcount-changed', false);
      }
      windowResize();
    },
    clickExportDialogClose() {
      this.exportdialog = false
      this.$emit('exportdialog-changed')
    },
    downloadGIF() {
      this.closeDisabled = true
      this.downloadDisabled = true
      this.exportOverlay = true
      if (this.gifname == "") this.gifname = "download";
      rlottieHandler.rlotties[rlottieHandler.mainCanvasId].makeGifFile(this.gifname, _ => {
        this.gifname = "";
        this.closeDisabled = false
        this.downloadDisabled = false
        this.exportOverlay = false;
        this.clickExportDialogClose();
      });
    }
  }
}
</script>

<style scoped>
  .navbar {
    height: 8vh;
    padding-left: 1vw;
    padding-right: 1vw;
  }

  .logo {
    height: 5vh; 
  }

  .lottie-input {
    background-color: #fdfdfd;
    color: #1D3557;
  }

  .filebox input[type="file"] {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip:rect(0,0,0,0);
    border: 0;
  }

  .filebox label {
    display: inline-block;
    padding: .5em .75em;
    color: #1D3557;
    font-size: inherit;
    line-height: normal;
    vertical-align: middle;
    background-color: #ECEFF1;
    cursor: pointer;
    border: 1px solid #ECEFF1;
    border-bottom-color: #ECEFF1;
    border-radius: .25em;
    margin-bottom: 0;
    height: 48px;
  }

  .mode {
    width: 50px;
    height: 48px;
  }

  .multiview-btn {
    height: 48px;
  }

  .view-count {
    background-color: #fdfdfd;
    color: #1D3557
  }
</style>