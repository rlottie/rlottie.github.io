<template>
    <div id="left-detail-bar" class="d-flex ml-1 align-start justify-center">
        <div class="text-center">   
        <h1 class="mt-4" style="color: white">Palette</h1>
            <v-row>
            <v-col class="d-flex justify-center">
                <v-color-picker hide-mode-switch v-model="color">
                </v-color-picker>
            </v-col>
            </v-row>
            <v-btn @click="changeBgColor">Change</v-btn>
        </div>
    </div>
</template>

<script>
module.exports = {
    name: "left-bar-detail",
    props:{
        selectedMenu: Number,
    },
    data(){
        return {
            type: 'hex',
            hex: '#FF00FF',
            hexa: '#FF00FFFF',
            rgba: { r: 255, g: 0, b: 255, a: 1 },
            hsla: { h: 300, s: 1, l: 0.5, a: 1 },
            hsva: { h: 300, s: 1, v: 1, a: 1 },
        }
    },
    methods:{
        changeBgColor(){
            document.getElementById('myCanvas').style.backgroundColor = this.color;
        },
    },
    computed: {
      color: {
        get () {
          return this[this.type]
        },
        set (v) {
          this[this.type] = v
        },
      },
      showColor () {
        if (typeof this.color === 'string') return this.color
        return JSON.stringify(Object.keys(this.color).reduce((color, key) => {
          color[key] = Number(this.color[key].toFixed(2))
          return color
        }, {}), null, 2)
      },
    },
    watch:{
        selectedMenu(){
            console.log('hello', this.selectedMenu);
        }
    }

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