<template>
  <v-app-bar
    dense
    dark
    class="header"
  >
    <div style="width:23rem">
    <!-- Logo -->
    <v-row
      class="pl-3"
      align="center"
    >
      <v-img
        class="cursor-pointer"
        src="./assets/logo.png"
        max-height="25"
        max-width="25"
        @click="reloadWindow"
      ></v-img>
      <v-toolbar-title
        class="pl-1 cursor-pointer"
        @click="reloadWindow"
      >
        Prettie
      </v-toolbar-title>
    </v-row>
    </div>
    <!-- Mockup -->
    <v-spacer align="center">
      <v-btn 
        v-for="(item, index) in mockUpList" :key="index"
        text 
        class="white--text height-100-percent"
        @click="(index==0) ? buttonRemove() : buttonMockup(index);">
        <v-icon dark> {{ item }} </v-icon>
      </v-btn>
    </v-spacer>
    <!-- New file, Export -->
    <div
      style="width: 245px"
      align="left"
    >
      <v-tooltip
        bottom
        class="tooltip-btn"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="rgba(255, 255, 255, 1)"
            style="text-transform: none; font-weight: 400"
            depressed
            outlined
            v-bind="attrs"
            v-on="on"
            @click="clickToUploadJson"
          >
            New File
          </v-btn>
          <input
            type="file"
            id="file-selector"
            accept=".json"
            ref="json" 
          />
        </template>
        <span> open New JSON File (Ctrl + O) </span>
      </v-tooltip>
      <v-tooltip
        bottom
        class="tooltip-btn"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            class="mx-3"
            color="rgba(255, 255, 255, 1)"
            style="text-transform: none; font-weight: 400"
            depressed
            outlined
            v-bind="attrs"
            v-on="on"
            @click="exportJson"
          >
            Export
          </v-btn>
        </template>
        <span> export Json File (Ctrl + S) </span>
      </v-tooltip>
    </div>
    <!-- Shortcut -->
    <v-dialog
      v-model="dialog"
      max-width="360"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-tooltip
          bottom
          class="tooltip-btn"
          v-bind="attrs"
          v-on="on"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              fab
              dark
              height="25"
              width="25"
              outlined
              v-bind="attrs"
              v-on="on"
              @click="dialog=true"
            >
              <span style="font-size:16px;">?</span>
            </v-btn>
          </template>
          <span>guide for Shortcut key</span>
        </v-tooltip>
      </template>
      <v-card color="rgb(240,240,240)">
        <v-card-title class="headline">
          Shortcut Keys
        </v-card-title>
        <v-card-text class="py-0">
          <ol>
            <li v-for="(shorCut, index) in shortCutList" :key="index">
              <v-row>
                <v-col
                  class="ma-0 pa-0 px-3"
                  style="min-width:170px;"
                >
                  {{shorCut.function}}
                </v-col>
                <v-col
                  class="ma-0 pa-0 px-3"
                  style="min-width:100px;"
                >
                  : {{shorCut.key}}
                </v-col>
              </v-row>
            </li>
          </ol>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="rgb(111,60,229)"
            text
            @click="dialog = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app-bar>
</template>

<script>
module.exports = {
  name: 'upper-bar',
  props: ['left'],
  data() {
    return {
      mockUpList: ['mdi-square-off-outline', 'mdi-cellphone-android', 'mdi-watch'],
      dialog: false,
      shortCutList: [
        { function: 'Pause and Play', key: 'Space' },
        { function: 'Open new Json file', key: 'Ctrl + O' },
        { function: 'Save to Json file', key: ' Ctrl + S' },
        { function: 'Reverse and Play', key: 'Ctrl + R' },
        { function: 'Undo', key: 'Ctrl + Z' },
        { function: 'Redo', key: 'Ctrl + Shift + Z' },
        { function: 'Canvas Border', key: 'Ctrl + B' },
      ]
    };
  },
  methods: {
    buttonRemove() {
      var parentDiv = document.querySelector('#img-background');
      if (parentDiv.childNodes.length != 0) {
        var childImg = document.querySelector('#background');
        parentDiv.removeChild(childImg);
      }
    },
    buttonMockup(buttonNo) {
      var parentDiv = document.querySelector('#img-background');
      if (parentDiv.childNodes.length != 0) {
        var childImg = document.querySelector('#background');
        parentDiv.removeChild(childImg);
      }

      var img = document.createElement('img');
      img.id = 'background';
      img.style = 'max-height:650px; max-width: 90%; margin-left: auto; margin-right: auto; display: block;';
      img.src = (buttonNo == 1) ? './assets/mock_up_phone.png' : './assets/mock_up_watch.png';
      document.querySelector('#img-background').appendChild(img);
    },
    clickToUploadJson() {
      this.$refs.json.click();
    },
    exportJson() {
      RLottieModule.layers.exportLayers();
    },
    reloadWindow() {
      location.reload();
    },
  },
  mounted() {
    var self = this;
    document.addEventListener(
      'keydown',
      function (e) {
        if (e.ctrlKey && e.which == 83) {
          e.preventDefault();
        } else if (e.ctrlKey && e.which == 79) {
          e.preventDefault();
        }
      },
      false,
    );
    // Shortcut key function binding
    document.addEventListener('keyup', function (e) {
      if (e.ctrlKey && e.which == 83) {
        // Save to Json file
        self.exportJson();
      } else if (e.ctrlKey && e.which == 79) {
        // Open Json file
        self.clickToUploadJson();
      }
    });
  },
};
</script>

<style soped>
.pretap {
  background: #dedede;
  color: #fff;
  border: none;
  position: relative;
  font-size: 1.6em;
  padding: 0 2em;
  transition: 800ms ease all;
  outline: none;
  border-radius: 0px 0px 20px 20px;
}

.pretap:hover {
  background: #fff;
  color: #dedede;
}

.pretap:before, .pretap:after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  height: 2px;
  width: 0;
  background: #dedede;
  transition: 400ms ease all;
}

.pretap:after {
  right: inherit;
  top: inherit;
  left: 0;
  bottom: 0;
}

.pretap:hover:before, .pretap:hover:after {
  width: 100%;
  transition: 800ms ease all;
}

#upper-wrapper {
  position: absolute;
}

#upper-nav {
  width: 100%;
  background-color: rgba(41, 44, 49, 1);
  border-radius: 0px 0px 15px 15px;
  height: 50px;
  vertical-align: middle;
}

.v-toolbar__content {
  height: 100% !important;
}

.v-card__text {
  font-weight: 500;
  font-size: 16px;
}
</style>
