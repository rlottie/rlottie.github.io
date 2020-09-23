<template>
  <div class="bg-navbar navbar d-flex justify-content-between">
    <!-- logo -->
    <div>
      <a href="/" class="d-flex align-items-center text-decoration-none">
        <img class="logo" src="../static/logo.png" alt="logo">
        <h2 class="ml-3 text-white">PrettyView</h2>
      </a>
    </div>

    <!-- button group -->
    <div class="d-flex">
      <!-- canvas shape -->
      <v-btn-toggle v-model="toggle_exclusive" class="mx-2">
        <v-btn>
          <v-icon class="fas fa-square-full text-dark"></v-icon>
        </v-btn>
        <v-btn>
          <v-icon class="fas fa-circle text-dark"></v-icon>
        </v-btn>
      </v-btn-toggle>
      <!-- light/dark mode -->
      <button class="btn btn-light mx-2">Light Mode</button>
      <!-- import/export -->
      <div class="filebox mx-2">
        <label for="fileSelector"><span class="d-inline-block pt-1">New Lottie</span></label>
        <input class="upload-hidden" type="file" id="fileSelector" accept=".json" placeholder="New Lottie">
      </div>
      <button class="btn bg-green text-white mx-2" data-toggle="modal" data-target="#exportModal">Export <i class="fas fa-download ml-2"></i></button>

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
              <button type="button" class="btn bg-green text-white">Export</button>
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
      toggle_exclusive: 2,
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