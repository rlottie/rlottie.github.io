<template>
  <div class="text-center mt-5">   
    <h2 class="mt-4" style="color: white">Change Background Color</h2>
      <v-row>
        <v-col class="d-flex justify-center mt-5">
            <v-color-picker hide-mode-switch v-model="color">
            </v-color-picker>
        </v-col>
      </v-row>
    <v-btn @click="changeBgColor">Change</v-btn>
  </div>
</template>

<script>
module.exports = {
  name: "change-bg-color",
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
  }
}
</script>

<style>

</style>