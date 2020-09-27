<template>
    <div id="left-detail-bar" class="d-flex ml-1 align-start justify-center">
        <shape-property v-show="selectedmenu==1" @call-close-menu-parent="closeSideBarFromChild"></shape-property>
        <stroke-property v-show="selectedmenu==2" @call-close-menu-parent="closeSideBarFromChild"></stroke-property>
        <transform-property v-show="selectedmenu==3" @call-close-menu-parent="closeSideBarFromChild"></transform-property>
        <change-bg-img v-show="selectedmenu==4"></change-bg-img>
        <resize-canvas v-show="selectedmenu==5"></resize-canvas>
        <change-bg-color v-show="selectedmenu==6"></change-bg-color>
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
}
</script>

<style>
#left-detail-bar{
    height: 100%;
    background-color:#292c31;
    width: 20rem;
    float:left
}
</style>