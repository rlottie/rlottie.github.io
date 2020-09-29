<template>
    <div id="left-detail-bar" class="d-flex ml-1 align-start justify-center" :style="{'left': '4rem', 'position':'absolute', 'overflow-x': 'hidden','overflow-y': 'auto', 'height': height+'px'}">
        <shape-property v-if="selectedmenu==1" @call-close-menu-parent="closeSideBarFromChild"></shape-property>
        <stroke-property v-if="selectedmenu==2" @call-close-menu-parent="closeSideBarFromChild"></stroke-property>
        <transform-property v-if="selectedmenu==3" @call-close-menu-parent="closeSideBarFromChild"></transform-property>
        <change-bg-img v-if="selectedmenu==4"></change-bg-img>
        <resize-canvas v-if="selectedmenu==5"></resize-canvas>
        <change-bg-color v-if="selectedmenu==6" :canvas-size="canvasSize" @call-close-menu-parent="closeSideBarFromChild"></change-bg-color>
    </div>
</template>

<script>
module.exports = {
    name: "left-bar-detail",
    components:{
        'shape-property': 'url:./detailMenus/ShapeProperty.vue',
        'stroke-property': 'url:./detailMenus/StrokeProperty.vue',
        'transform-property': 'url:./detailMenus/TransformProperty.vue',
        'resize-canvas': 'url:./detailMenus/ResizeCanvas.vue',
        'change-bg-color': 'url:./detailMenus/ChangeBgColor.vue',
        'resize-canvas': 'url:./detailMenus/ResizeCanvas.vue',
        'change-bg-img': 'url:./detailMenus/ChangeBgImg.vue',
    },
    props:{
        selectedmenu: Number,
        height: Number,
        canvasSize: Object
    },
    data() {
        return {
        }
    },
    methods: {
        closeSideBarFromChild(){
            this.$emit('close-sidebar');
        }
    },
    mounted(){
    }
}
</script>

<style>
#left-detail-bar{
    height: 100%;
    background-color:#292c31;
    width: 20rem;
    z-index: 99;
    /* float:left */
}
</style>