<template>
    <div id="left-detail-bar" class="d-flex ml-1 align-start justify-center">
        <resize-canvas v-show="selectedmenu==5"></resize-canvas>
        <change-bg-color v-show="selectedmenu==6"></change-bg-color>
    </div>
</template>

<script>
module.exports = {
    name: "left-bar-detail",
    components:{
        'change-bg-color': 'url:./detailMenus/ChangeBgcolor.vue',
        'resize-canvas': 'url:./detailMenus/ResizeCanvas.vue'
    },
    props:{
        selectedmenu: Number,
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