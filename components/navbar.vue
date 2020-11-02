<template>
  <div class="navbar d-flex justify-content-between">
    <!-- logo -->
    <div class="d-flex align-items-center">
      <img
        class="logo"
        src="https://github.com/rlottie/rlottie.github.io/blob/master/.res/rlottie_player.png"
        alt="logo"
      >
    </div>
    <!-- button group -->
    <div class="d-flex">
      <!-- import dialog -->
      <v-dialog
        v-model="importDialog"
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
            Import
            <em class="fas fa-file-import ml-2"></em>
          </button>
        </template>
        <v-card>
          <v-card-title class="headline mb-4">
            Import New Lottie File
          </v-card-title>
          <v-card-text class="pt-3">
            <div class="filebox d-flex justify-center">
              <input
                class="upload-hidden"
                id="fileSelector"
                type="file"
                accept=".json"
                placeholder="New Lottie"
                hidden
                @click="clickFileUpload"
                @change="clickImportDialogClose"
              >
              <v-btn
                class="py-7"
                outlined
                color="upload"
                width="100%"
                @click="clickNewLottie"
              >
                <v-icon class="mr-2">mdi-paperclip</v-icon>
                Upload Lottie File
              </v-btn>
            </div>
            <h5 class="my-3 text-center">or</h5>
            <div class="d-flex align-items-center">
              <v-text-field
                v-model="lottieURL"
                outlined
                placeholder="Lottie File URL"
                hide-details
                color="icon"
              ></v-text-field>
              <v-btn
                class="ml-4"
                large
                color="accent"
                @click="enterLottieURL"
              >
                Import
              </v-btn>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              text
              @click="clickImportDialogClose"
            >
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
module.exports = {
  name: 'navbar',
  data() {
    return {
      importDialog: false,
      lottieURL: ""
    }
  },
  methods: {
    clickImportDialogClose() {
      this.importDialog = false
    },
    clickFileUpload() {
      addImportListener()
    },
    clickNewLottie() {
      var fileInput = document.getElementById('fileSelector')
      fileInput.click()
    },
    enterLottieURL() {
      getLottieFromUrl(this.lottieURL)
      this.clickImportDialogClose()
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
</style>
