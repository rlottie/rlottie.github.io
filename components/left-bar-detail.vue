<template>
    <div id="left-detail-bar" class="d-flex ml-1 align-start justify-center">
        <change-bg-color></change-bg-color>
    </div>
</template>

<script>
module.exports = {
    name: "left-bar-detail",
    components:{
        'change-bg-color': 'url:./detailMenus/ChangeBgcolor.vue',
    },
    props:{
        selectedMenu: Number,
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