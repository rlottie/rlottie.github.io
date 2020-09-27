<template>
  <div class="text-center mt-5">
    <h2 class="mt-4" style="color: white">Change Background Image</h2>
    <div class="uploadBTN" style="align-center">
      <v-tooltip right class="tooltip-btn">
        <template v-slot:activator="{ on, attrs }">
          <v-btn tile class="py-7" text color="white" v-bind="attrs" v-on="on">
            <label for="backgroundImg">
              <v-icon style="pointer: cursor">fas fa-file-upload</v-icon>
            </label>
            <input
              type="file"
              id="backgroundImg"
              accept="image/*"
              @change="setBackgroundImg"
            />
          </v-btn>
        </template>
        <span> Upload Background Image </span>
      </v-tooltip>
    </div>
    <input
      type="file"
      id="backgroundImg"
      accept="image/*"
      @change="setBackgroundImg"
    />
    <v-btn @click="backgroundReset">Reset Background</v-btn>
  </div>
</template>

<script>
module.exports = {
  name: "change-bg-color",
  data() {
    return {
      backgroundImg: false
    };
  },
  mounted () {
    var childImg = document.querySelector("#background");
    if (childImg) {
      this.backgroundImg = true
    } else {
      this.backgroundImg = false
    }
  },
  methods: {
    backgroundReset() {
      if (this.backgroundImg) {
        var parentDiv = document.querySelector("#img-background");
        var childImg = document.querySelector("#background");
        parentDiv.removeChild(childImg);
      }
      this.backgroundImg = false;
    },
    setBackgroundImg(event) {
      var file = event.target.files;
      if (file.length===0){
        return
      }
      if (this.backgroundImg) {
        var parentDiv = document.querySelector("#img-background");
        var childImg = document.querySelector("#background");
        parentDiv.removeChild(childImg);
      }
      
      var img = document.createElement("img");
      img.id = "background";
      img.style = "height:650px; max-width: 1400px;";
      var reader = new FileReader();
      reader.onload = (function (aImg) {
        return function (e) {
          aImg.src = e.target.result;
        };
      })(img);
      if (file) {
        reader.readAsDataURL(file[0]);
      }
      document.querySelector("#img-background").appendChild(img);
      this.backgroundImg = true;
    },
  },
  computed: {},
};
</script>

<style scoped>
#backgroundImg {
  display: none;
  cursor: pointer;
}
.uploadBTN {
  border-bottom: none;
}

</style>