<template>
  <div class="width-100-percent">
    <v-scroll-y-reverse-transition>
      <div v-show="isTransition">
        <v-row 
          class="pb-3 px-5"
          align="center"
        >
          <v-col
            cols="12"
            class="py-0 mt-4"
          >
            <div class="text-left font-white">Color</div>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="d-flex justify-center pa-0">
            <v-color-picker
              class="bg-transparent"
              flat
              dark
              width="285"
              v-model="bgColor"
            />
          </v-col>
        </v-row>
        <div class="text-center mt-0">
          <v-row 
            class="px-5"
            align="center"
          >
            <v-col
              cols="7"
              class="justify-center pt-0 pr-0"
            >
              <div class="text-left font-white">Background Image</div>
            </v-col>
          </v-row>
        </div>
        <div
          id="upload-wrapper"
          align="center"
        >
          <v-btn
            tile
            class="py-7"
            text
            color="white"
            id="bg-btn"
            @click="clickToBackgroundImage"
          >
            <v-icon id="bg-icon">mdi-image-plus</v-icon>
          </v-btn>
          <input
            ref="image"
            type="file"
            id="background-img"
            accept="image/*"
            @change="setBackgroundImg"
          />
        </div>
        <v-btn
          class="mx-4 mt-4"
          @click="backgroundReset"
          id="delete-btn"
        >
          Delete Background Image
        </v-btn>
      </div>
    </v-scroll-y-reverse-transition>
  </div>
</template>

<script>
module.exports = {
  name: 'change-bg-color',
  data() {
    return {
      backgroundImgFlag: false,
      isTransition: false,
    };
  },
  methods: {
    clickToBackgroundImage() {
      this.$refs.image.click();
    },
    backgroundReset() {
      this.$refs.image.value = null;
      this.checkBackgroundImg();
      this.backgroundImgFlag = false;
    },
    setBackgroundImg(event) {
      var file = event.target.files;
      if (file.length === 0) {
        return;
      }
      this.checkBackgroundImg();
      var img = document.createElement('img');
      img.id = 'background';
      img.style = 'max-height:650px; max-width: 90%; margin-left: auto; margin-right: auto; display: block;';
      var reader = new FileReader();
      reader.onload = (function (aImg) {
        return function (e) {
          aImg.src = e.target.result;
        };
      })(img);
      if (file) {
        reader.readAsDataURL(file[0]);
      }
      document.querySelector('#img-background').appendChild(img);
      this.backgroundImgFlag = true;
    },
    checkBackgroundImg(){
        if (this.backgroundImgFlag) {
          var parentDiv = document.querySelector('#img-background');
        if (parentDiv.childNodes.length != 0) {
          var childImg = document.querySelector('#background');
          parentDiv.removeChild(childImg);
        }
      }
    }
  },
  computed: {
    bgColor: {
      get() {
        return this.$store.getters.bgColor;
      },
      set(rgb){
        this.$store.commit('setBgColor',rgb);
        const {r,g,b} = rgb
        document.getElementById('content').style.backgroundColor = `rgb(${r},${g},${b})`;
      }
    },
  },
  mounted() {
    this.isTransition = true;
    var childImg = document.querySelector('#background');
    if (childImg) {
      this.backgroundImgFlag = true;
    } else {
      this.backgroundImgFlag = false;
    }
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

.v-text-field .v-input__control .v-input__slot {
  min-height: 20px !important;
  display: flex !important;
  align-items: center !important;
}

#background-img {
  display: none;
  cursor: pointer;
}

#upload-wrapper {
  align-content: center;
}

#bg-btn {
  width: 90%;
  height: 200px;
  border: 2px dashed;
  border-radius: 20px;
  background-color: rgba(100, 100, 100, 0.2);
}

#bg-icon {
  font-size: 30px;
}

#delete-btn {
  background-color: rgba(0, 153, 204, 1);
  width: 90%;
}
</style>
