<template>
  <div
    class="text-center"
    style="width:100%;"> 
    <div class="uploadBTN py-3" style="align-center">
      <v-row
        align="center"
        justify="center">
        <v-col 
          class="pa-0"
          offset="2" cols="8">
          <h3 style="color:white;">
            Shape            
          </h3>
        </v-col>
        <v-col 
          class="pa-0 pr-4"
          cols="2">
          <v-btn
            color="rgba(0, 153, 204, 0)"
            :outlined="false"
            :depressed="true"
            fab x-small
            @click="closeSidebar()"
          >
            <v-icon
              color="#ffffff"
            >
              mdi-close
            </v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </div>
    <div class="mt-4">
      <v-row
        align="center"
        justify="center">
        <v-color-picker
          v-model="picker"
          flat
          style="background-color:transparent;"
        ></v-color-picker>
      </v-row>
    </div>
  </div>
</template>

<script>
module.exports = {
    name: "shape-property",
    data() {
      return {
        picker: null,
        setFlag: false,

        stack: [],
        interval: '',        
      }
    },
    mounted(){   
      var self = this
      this.interval = setInterval(() => {
          self.clearStack()
      }, 500);      
    },
    beforeDestroy(){
      clearInterval(this.interval);
    },
    watch: {
      picker(){
        if(this.setFlag){
          const r = this.picker.rgba.r / 255;
          const g = this.picker.rgba.g / 255;
          const b = this.picker.rgba.b / 255;
          const a = this.picker.rgba.a * 100;          
          RLottieModule.fillColors(RLottieModule.keypath, r, g, b, a);         
          this.stack.push({
            'property': 'FillColor',
            'args': [r,g,b,a]
          })
        }else{
          this.setFlag = true;
        }
      }
    },
    methods: {
      closeSidebar(){
        this.$emit("call-close-menu-parent");
      },
      clearStack() {
        let len = this.stack.length;
        if(!len)
          return

        let top = this.stack.pop()
        RLottieModule.history.insert(RLottieModule.keypath, top.property, top.args)
        this.stack = []
      }
    },
}
</script>

<style scoped>

input{
  border: 1px solid white !important;
  color: white;
}
span{
  color:white !important;
}
</style>