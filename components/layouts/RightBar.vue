<template>
  <div
    id="right-bar"
    ref="right"
    :style="{'height' : height+'px'}"
  >
    <v-navigation-drawer
      v-model="isNavigation"
      right
      hide-overlay
      permanent
      color="#293039"
      :width="'350px'"
    >
      <v-switch
        class="ml-4"
        v-model="isSelectAll"
        inset
        label="Select all sub keypath"
        color="rgba(0, 153, 204, 1)"
        dark
      ></v-switch>
      <v-text-field
        class="pa-2"
        v-model="search"
        placeholder="input keypath ..."
        dark
        dense
        hide-details
        outlined
        @keydown.stop="inputKeypath"
      ></v-text-field>
      <v-treeview
        :items="layerTree"
        dark
        activatable
        hoverable
        item-key="keypath"
        item-text="keypath"
        color="rgba(0, 153, 204, 1)"
        @update:active="changeFocus"
        open-all
        ref="treeview"
        :search="search"
      >
        <template v-slot:prepend="{ item, open }">
          <v-icon v-if="item.type == 'root'">
            {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
          </v-icon>
          <v-icon v-else-if="item.type == '4'"> mdi-layers </v-icon>
          <v-icon v-else-if="item.type == 'gr'"> mdi-crop </v-icon>
          <v-icon v-else-if="item.type == 'st'"> mdi-pencil </v-icon>
          <v-icon v-else-if="item.type == 'fl'"> mdi-format-color-fill </v-icon>
          <v-icon v-else> mdi-cancel </v-icon>
        </template>
        <template v-slot:label="{ item }">
          {{ item.name }}
        </template>
      </v-treeview>
    </v-navigation-drawer>
  </div>
</template>

<script>
module.exports = {
  name: 'right-bar',
  data() {
    return {
      isNavigation: true,
      search: '',
      openFolder: ['root'],
      height: 100
    };
  },
  computed: {
    ...Vuex.mapGetters(['layerTree', 'keypath', 'selectedAllKeypath']),
    isSelectAll: {
      get() {
        return this.$store.getters.isSelectAll;
      },
      set() {
        this.$store.commit('setIsSelectAll');
      },
    },
  },
  mounted() {
    this.height = window.innerHeight * 0.94;
    var self = this;
    window.addEventListener('resize', function (e) {
      self.height = window.innerHeight * 0.94;
    });
  },
  methods: {
    ...Vuex.mapActions(['reloadCanvas', 'highlightingLayer']),
    changeFocus(keypath) {
      if (keypath[0] == null) keypath[0] = '';
      this.$store.commit('setKeypath', keypath[0]);
      if (!keypath[0]) {
        this.reloadCanvas();
        return;
      }
      this.highlightingLayer();
    },
    inputKeypath(e) {
      this.$refs.treeview.updateAll(this.search !== '');
    },
  },
};
</script>

<style scoped>
.v-navigation-drawer__content {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.v-navigation-drawer__content::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera*/
}

#right-bar {
  z-index: 99;
  float: right;
  background-color: #293039;
  overflow-y: hidden !important;
}

.comp-r-0 {
  right: 0;
}
</style>
