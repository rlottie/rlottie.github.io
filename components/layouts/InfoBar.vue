<template>
  <div class="pt-1 pb-2">
    <v-row class="pa-0">
      <div class="pt-3">
        <v-icon class="pl-5">mdi-file-outline</v-icon>
        <span 
          v-text="fileName"
          style="font-weight: 600"
        ></span>
      </div>
      <v-spacer></v-spacer>
      <div>
        <v-tooltip
          bottom
          open-on-hover
          close-delay="100"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="mr-1"
              dark
              v-bind="attrs"
              v-on="on"
              icon
              large
              :color="(hasPrev) ? 'white' : 'transparent'"
              :style="{cursor: (hasPrev) ? 'pointer' : 'default'}"
              @click="movePrev"
            >
              <v-icon :color="(hasPrev) ? '#54565A' : '#BFC0C2'">
                mdi-undo
              </v-icon>
            </v-btn>
          </template>
          <div>
            <span>Undo (Ctrl + Z)</span>
          </div>
        </v-tooltip>
        <v-tooltip
          bottom
          open-on-hover
          close-delay="100"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="mr-5"
              dark
              v-bind="attrs"
              v-on="on"
              icon
              large
              :color="(hasNext) ? 'white' : 'transparent'"
              :style="{cursor: (hasNext) ? 'pointer' : 'default'}"
              @click="moveNext"
            >
              <v-icon :color="(hasNext) ? '#54565A' : '#BFC0C2'">
                mdi-redo
              </v-icon>
            </v-btn>
          </template>
          <span>Redo (Ctrl + Shift + Z)</span>
        </v-tooltip>
      </div>
    </v-row>
  </div>
</template>

<script>
module.exports = {
  name: 'info-bar',
  data() {
    return {
    };
  },
  computed: {
    ...Vuex.mapGetters(['fileName', 'hasPrev', 'hasNext']),
  },
  mounted() {
    var self = this;
    var setHistoryState = this.setHistoryState;

    // Shortcut key function binding
    document.addEventListener('keydown', function (e) {
      if (e.ctrlKey && e.shiftKey && e.which == 90) {
        // Forward frame : Ctrl + Shift + Z
        e.preventDefault();
        self.moveNext();
      } else if (e.ctrlKey && e.which == 90) {
        // Backward frame : Ctrl + Z
        e.preventDefault();
        self.movePrev();
      }
    });
  },
  methods: {
    ...Vuex.mapActions(['movePrev','moveNext']),
  },
};
</script>

<style></style>
