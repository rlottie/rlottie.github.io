<template>
  <div class="bg-navbar navbar d-flex justify-content-between">
    <a href="/"><img class="logo" src="../static/logo.png" alt="logo"></a>
    <div class="filebox">
      <label for="fileSelector">New Lottie</label>
      <input class="upload-hidden" type="file" id="fileSelector" accept=".json" placeholder="New Lottie">
    </div>
  </div>
</template>

<script>
module.exports = {
  name: 'navbar',

  data: function () {
    return {
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
  }
</style>