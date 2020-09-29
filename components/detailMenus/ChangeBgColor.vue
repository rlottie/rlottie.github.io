<template>
  <div class="text-center">
    <div class="uploadBTN py-3" style="align-center">
      <v-row align="center" justify="center">
        <v-col class="pa-0" offset="2" cols="8">
          <h3 style="color: white">Change Background</h3>
        </v-col>
        <v-col class="pa-0 pr-4" cols="2">
          <v-btn
            color="rgba(0, 153, 204, 0)"
            :outlined="false"
            :depressed="true"
            fab
            x-small
            @click="closeSidebar()"
          >
            <v-icon color="#ffffff">mdi-close </v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </div>
    <v-row class="mt-4">>
      <v-col class="d-flex justify-center pa-0">
        <v-color-picker
          flat
          style="background-color: transparent"
          v-model="color"
        >
        </v-color-picker>
      </v-col>
    </v-row>

    <div class="text-center mt-0">
      <v-row class="px-5">
        <v-col cols="12" class="justify-center mt-5">
          <div class="text-left" style="color: white">Canvas Size</div>
          <v-row class="pd-0 pt-2">
            <v-col cols="8" class="text-left py-0">
              <div style="color: white">x</div>
            </v-col>
            <v-col cols="4" class="py-0">
              <v-text-field
                v-model="canvasSizeInput.width"
                solo
                dense
                dark
                hide-details
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="8" class="text-left py-0">
              <div style="color: white">y</div>
            </v-col>
            <v-col cols="4" class="py-0">
              <v-text-field
                v-model="canvasSizeInput.height"
                solo
                dense
                dark
                hide-details
                outlined
              ></v-text-field>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </div>
    <div class="text-center mt-0">
      <v-row class="px-5"
        align="center">
        <v-col cols="7" class="justify-center pt-0 pr-0">
          <div class="text-left" style="color: white">Background Image</div>
        </v-col>
      </v-row>
    </div>
    <div class="uploadBTN" style="align-left; border-bottom: none;">
        <!-- <label for="backgroundImg"> -->
      <v-btn
        tile
        class="py-7"
        text color="white"
        style="width:90%; height: 200px; border: 2px dashed; border-radius: 20px; background-color:rgba(100,100,100,0.2);"
        @click="clickToBackgroundImage">
          <v-icon style="pointer: cursor; font-size:30px;">mdi-image-plus</v-icon>
      </v-btn>
        <!-- </label> -->
        <input
          ref="image"
          type="file"
          id="backgroundImg"
          accept="image/*"
          @change="setBackgroundImg"
        >
    </div>
    <v-btn
      class="mx-4 mt-4"
      @click="backgroundReset"
      style="background-color:rgba(0, 153, 204, 1); width:90%;"
      >
        Delete Background Image
    </v-btn>
  </div>
</template>

<script>
module.exports = {
  name: "change-bg-color",
  data() {
    return {
      type: "rgba",
      rgba: { r: 255, g: 255, b: 255 },
      canvasSizeInput: this.canvasSize,
      backgroundImg: false
    };
  },
  props:{
    canvasSize: Object
  },
  methods: {
    clickToBackgroundImage(){
      this.$refs.image.click();
    },
    closeSidebar() {
      this.$emit("call-close-menu-parent");
    },
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
      img.style = "max-height:650px; max-width: 90%; margin-left: auto; margin-right: auto; display: block;"
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
  computed: {
    color: {
      get() {
        return this[this.type];
      },
      set(v) {
        this[this.type] = v;
      },
    },
    showColor() {
      if (typeof this.color === "string") return this.color;
      return JSON.stringify(
        Object.keys(this.color).reduce((color, key) => {
          color[key] = Number(this.color[key].toFixed(2));
          return color;
        }, {}),
        null,
        2
      );
    },
  },
  watch: {
    rgba() {
      const r = this.rgba.r;
      const g = this.rgba.g;
      const b = this.rgba.b;
      document.getElementById(
        "content"
      ).style.backgroundColor = `rgba(${r},${g},${b})`;
    },
    canvasSizeInput: {
      deep: true,
      handler() {
        document.getElementById("canvasBox").style.height = `${this.canvasSize.height}px`
        document.getElementById("canvasBox").style.width = `${this.canvasSize.width}px`
      }

    }
  },
  mounted() {
    var childImg = document.querySelector("#background");
    if (childImg) {
      this.backgroundImg = true
    } else {
      this.backgroundImg = false
    }
  }
};
</script>

<style scoped>
.v-color-picker__input > input {
  border: 1px solid white !important;
  color: white;
}
span {
  color: white !important;
}
.v-text-field .v-input__control .v-input__slot {
  min-height: 20px !important;
  display: flex !important;
  align-items: center !important;
}
#backgroundImg {
  display: none;
  cursor: pointer;
}
</style>