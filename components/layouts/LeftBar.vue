<template>
  <div 
    id="l-bar" 
    ref="leftBar"
  >
    <div
      id="tool-wrapper"
      class="d-flex"
    >
      <div
        id="tool-nav"
        class="text-center"
      >
        <v-tooltip 
          v-for="(item, index) in navList" :key="index"
          right
          class="tooltip-btn"
          color="transparent"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              tile
              text
              height="60"
              class="ma-0 px-0 width-100-percent"
              :color="activateColor(index)"
              v-bind:class="{ 'activate-btn': isActivate(index) }"
              @click="clickMenu(index)"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>{{ item.icon }}</v-icon>
              <div style="padding-top: 6px">{{ item.name }}</div>
            </v-btn>
          </template>

          <span v-if="index != 4">
            <v-card
              class="ma-0"
              max-width="290"
            >
              <v-img
                class="white--text align-end"
                height="145px"
                :src="item.src"
              >
                <v-card-title class="card-title"> {{ item.title }} </v-card-title>
              </v-img>
              <v-card-subtitle class="pb-0"> {{ item.subTitle }} </v-card-subtitle>
              <v-card-text class="text--primary">
                <div>{{ item.text }}</div>
              </v-card-text>
            </v-card>
          </span>
          <span v-else>
            <v-card
              class="ma-0"
              max-width="290"
            >
              <img
                class="white--text align-end"
                height="145px"
                width="290px"
                :src="item.src"
              />
              <v-card-subtitle class="pb-4"> {{ item.subTitle }} </v-card-subtitle>
              <v-card-title class="card-title card-gif"> {{ item.title }} </v-card-title>
            </v-card>
          </span>
        </v-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
module.exports = {
  name: 'left-bar',
  props: {
    selectedmenu: Number,
  },
  data() {
    return {
      navList: [
        { icon:'fas fa-fill-drip', name:'Shape', title:'Change Fill and Stroke', subTitle:'Change 3 properties', text:'Color, Opacity, Width', src:'./assets/change_shape.jpg' },
        { icon:'fas fa-crop', name:'Transform', title:'Change Transform', subTitle:'Change 5 properties', text:'Anchor, Position, Scale, Rotation, Opacity', src:'./assets/change_transform.jpg'},
        { icon:'fas fa-image', name:'Bkground', title:'Change Background', subTitle:'Change states of Background', text:'Color, Image', src:'./assets/change_bg.jpg' },
        { icon:'fas fa-palette', name:'Canvas', title:'Change Canvas', subTitle:'Change states of canvas', text:'resize, rotation, flip', src:'./assets/change_canvas.jpg' },
        { icon:'fas fa-photo-video', name:'Gif', title:'Download GIF', subTitle:'Download .gif file', text:'', src:'./assets/change_gif.gif' } 
      ]
    }
  },
  methods: {
    clickMenu(idx) {
      this.$emit('menuclicked', idx);
    },
    isActivate: function (idx) {
      if (this.selectedmenu === idx) {
        return true;
      } else {
        return false;
      }
    },
  },
  computed: {
    activateColor() {
      return (i) => {
        if (this.selectedmenu == i) {
          return 'white';
        } else {
          return 'grey';
        }
      };
    },
  },
  mounted() {
    var self = this;

    //gif pre-loading
    let img = new Image();
    img.src = './assets/change_gif.gif';
  },
};
</script>

<style scoped>
#l-bar {
  height: 100%;
  width: 4.5rem;
  background-color: #0e1318;
  float: left;
}

#tool-wrapper {
  height: 93%;
}

#tool-nav {
  width: 100%;
}

.v-btn__content {
  display: block;
}

.v-btn.v-size--default {
  font-size: 10px;
  text-transform: none;
}
</style>
