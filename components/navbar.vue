<template>
  <div class="navbar d-flex justify-content-between">
    <!-- logo -->
    <div class="d-flex align-items-center">
        <img class="logo" src="../static/logo.png" alt="logo">
        <h2 class="ml-3">PrettyView</h2>
    </div>

    <!-- button group -->
    <div class="d-flex">
      <!-- canvas shape -->
      <v-btn-toggle light v-model="toggle_one" class="mx-2" mandatory>
        <v-btn>
          <v-icon class="fas fa-square-full text-dark"></v-icon>
        </v-btn>
        <v-btn>
          <v-icon class="fas fa-circle text-dark"></v-icon>
        </v-btn>
      </v-btn-toggle>


      <!-- light/dark mode -->
      <button class="btn mx-2 mode" @click="changeMode" :class="{ 'text-white': !$vuetify.theme.dark }">{{ mode }}</button>
      <!-- <v-select
        dark
        color="white"
        :items="modes"
        outlined
      ></v-select> -->

      <!-- import/export -->
      <div class="filebox mx-2">
        <label for="fileSelector"><span class="d-inline-block pt-1">New Lottie</span></label>
        <input class="upload-hidden" @change="changeFile" type="file" id="fileSelector" accept=".json" placeholder="New Lottie">
      </div>
      <button class="btn accent mx-2" :class="{ 'text-white': $vuetify.theme.dark }" data-toggle="modal" data-target="#exportModal">Export <i class="fas fa-download ml-2"></i></button>


      <!-- Modal -->
      <div class="modal fade text-dark" id="exportModal" tabindex="-1" aria-labelledby="exportModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header border-bottom-0">
              <h5 class="modal-title" id="exportModalLabel">Modal title</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              modal modal
            </div>
            <div class="modal-footer border-top-0">
              <button type="button" class="btn btn-secondary text-white" data-dismiss="modal">Close</button>
              <button type="button" class="btn accent text-white" :class="{ 'text-white': $vuetify.theme.dark }">Export</button>

            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
module.exports = {
  name: 'navbar',

  data: function () {
    return {
      toggle_one: 0,
      mode: 'Light Mode',
    }
  },

  methods: {
    changeFile() {
      this.$emit('file-changed')
    },

    changeMode() {
      if (this.mode == 'Light Mode') {
        this.mode = 'Dark Mode'
        this.$vuetify.theme.dark = false
      } else {
        this.mode = 'Light Mode'
        this.$vuetify.theme.dark = true
      }
    },
  },
  watch: {
    toggle_one() {
      this.$emit('canvas-changed', this.toggle_one)
    },
  },
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
    background-color: #fdfdfd;
    cursor: pointer;
    border: 1px solid #fdfdfd;
    border-bottom-color: #fdfdfd;
    border-radius: .25em;
    margin-bottom: 0;
    height: 48px;
  }

  .bg-green {
    background-color: rgba(10, 142, 144, 0.74);
  }
</style>