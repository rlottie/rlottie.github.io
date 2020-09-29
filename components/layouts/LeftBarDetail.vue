<template>
  <div id="left-detail-bar" class="d-flex align-start justify-center">
    <shape-property
      v-if="selectedmenu == 0"
      @call-close-menu-parent="closeSideBarFromChild"
    ></shape-property>
    <transform-property
      v-if="selectedmenu == 1"
      @call-close-menu-parent="closeSideBarFromChild"
    ></transform-property>
    <change-bg-color
      v-if="selectedmenu == 2"
      @call-close-menu-parent="closeSideBarFromChild"
    ></change-bg-color>
    <change-canvas
      v-if="selectedmenu == 3"
      :canvas-size="canvasSize"
      @call-close-menu-parent="closeSideBarFromChild"
    ></change-canvas>
    <export-gif
      v-if="selectedmenu == 4"
      @call-close-menu-parent="closeSideBarFromChild"
    ></export-gif>
  </div>
</template>

<script>
module.exports = {
  name: 'left-bar-detail',
  components: {
    'change-bg-color': 'url:../detailMenus/ChangeBgColor.vue',
    'change-canvas': 'url:../detailMenus/ChangeCanvas.vue',
    'export-gif': 'url:../detailMenus/ExportGif.vue',
    'shape-property': 'url:../detailMenus/ShapeProperty.vue',
    'transform-property': 'url:../detailMenus/TransformProperty.vue',
  },
  props: {
    selectedmenu: Number,
    height: Number,
    canvasSize: Object,
  },
  data() {
    return {};
  },
  methods: {
    closeSideBarFromChild() {
      this.$emit('close-sidebar');
    },
  },
};
</script>

<style scoped>
#left-detail-bar {
  height: 100%;
  background-color: #293039;
  width: 20rem;
  z-index: 99;
  left: 4rem;
  float: left;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
