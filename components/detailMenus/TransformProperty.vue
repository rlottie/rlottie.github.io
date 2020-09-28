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
                    Transform            
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
        <div class="text-center mt-4">   
            <v-row
                class="px-5">
                <v-col cols="12" class="justify-center mt-5">
                    <div class="text-left" style="color:white;">Anchor</div>
                    <v-row class="pd-0 pt-2"> 
                        <v-col cols="8" class="text-left py-0">
                            <div style="color:white;">x</div>
                        </v-col>
                        <v-col cols="4" class="py-0">
                            <v-text-field
                                v-model="anchor.x"
                                solo
                                dense
                                dark
                                hide-details
                                outlined
                            ></v-text-field>
                        </v-col>
                        <v-col cols="8" class="text-left py-0">
                            <div style="color:white;">y</div>
                        </v-col>
                        <v-col cols="4" class="py-0">
                            <v-text-field
                                v-model="anchor.y"
                                solo
                                dense
                                dark
                                hide-details
                                outlined
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <div class="text-left" style="color:white;">Position</div>
                    <v-row class="pd-0 pt-2"> 
                        <v-col cols="8" class="text-left py-0">
                            <div class="pr-2" style="color:white;">x</div>
                        </v-col>
                        <v-col cols="4" class="py-0">
                            <v-text-field
                                v-model="position.x"
                                solo
                                dense
                                dark
                                hide-details
                                outlined
                            ></v-text-field>
                        </v-col>
                        <v-col cols="8" class="text-left py-0">
                            <div style="color:white;">y</div>
                        </v-col>
                        <v-col cols="4" class="py-0">
                            <v-text-field
                                v-model="position.y"
                                solo
                                dense
                                dark
                                hide-details
                                outlined
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <div class="text-left" style="color:white;">Scale</div>
                    <v-row class="pd-0 pt-2"> 
                        <v-col cols="8" class="text-left py-0">
                            <div style="color:white;">w</div>
                        </v-col>
                        <v-col cols="4" class="py-0">
                            <v-text-field
                                v-model="scale.w"
                                solo
                                dense
                                dark
                                hide-details
                                outlined
                            ></v-text-field>
                        </v-col>
                        <v-col cols="8" class="text-left py-0">
                            <div style="color:white;">h</div>
                        </v-col>
                        <v-col cols="4" class="py-0">
                            <v-text-field
                                v-model="scale.h"
                                solo
                                dense
                                dark
                                hide-details
                                outlined
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row class="pt-5">
                        <v-col cols="8" class="py-0">
                            <div class="text-left" style="color:white;">Rotation</div>
                        </v-col>
                        <v-col cols="4" class="py-0">   
                            <v-text-field
                                v-model="degree"
                                class="mt-0 pt-0"
                                hide-details
                                type="number"
                                solo
                                outlined
                                dense
                                dark
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row class="mb-4" >
                        <v-col cols="12" class="py-0">
                            <v-slider
                                v-model="degree"
                                class="align-center"
                                max="360"
                                min="0"
                                hide-details
                            ></v-slider>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="8" class="py-0">
                            <div class="text-left" style="color:white;">Opacity</div>
                        </v-col>
                        <v-col cols="4" class="py-0">   
                            <v-text-field
                                v-model="opacity"
                                class="mt-0 pt-0"
                                hide-details
                                type="number"
                                solo
                                outlined
                                dense
                                dark
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" class="py-0">
                            <v-slider
                                v-model="opacity"
                                class="align-center"
                                max="100"
                                min="0"
                                hide-details
                            ></v-slider>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="8" class="py-0">
                            <div class="text-left" style="color:white;">Opacity</div>
                        </v-col>
                        <v-col cols="4" class="py-0">   
                            <v-text-field
                                v-model="opacity"
                                class="mt-0 pt-0"
                                hide-details
                                type="number"
                                solo
                                outlined
                                dense
                                dark
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" class="py-0">
                            <v-slider
                                v-model="opacity"
                                class="align-center"
                                max="100"
                                min="0"
                                hide-details
                            ></v-slider>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="8" class="py-0">
                            <div class="text-left" style="color:white;">Opacity</div>
                        </v-col>
                        <v-col cols="4" class="py-0">   
                            <v-text-field
                                v-model="opacity"
                                class="mt-0 pt-0"
                                hide-details
                                type="number"
                                solo
                                outlined
                                dense
                                dark
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" class="py-0">
                            <v-slider
                                v-model="opacity"
                                class="align-center"
                                max="100"
                                min="0"
                                hide-details
                            ></v-slider>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="8" class="py-0">
                            <div class="text-left" style="color:white;">Opacity</div>
                        </v-col>
                        <v-col cols="4" class="py-0">   
                            <v-text-field
                                v-model="opacity"
                                class="mt-0 pt-0"
                                hide-details
                                type="number"
                                solo
                                outlined
                                dense
                                dark
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" class="py-0">
                            <v-slider
                                v-model="opacity"
                                class="align-center"
                                max="100"
                                min="0"
                                hide-details
                            ></v-slider>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="8" class="py-0">
                            <div class="text-left" style="color:white;">Opacity</div>
                        </v-col>
                        <v-col cols="4" class="py-0">   
                            <v-text-field
                                v-model="opacity"
                                class="mt-0 pt-0"
                                hide-details
                                type="number"
                                solo
                                outlined
                                dense
                                dark
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" class="py-0">
                            <v-slider
                                v-model="opacity"
                                class="align-center"
                                max="100"
                                min="0"
                                hide-details
                            ></v-slider>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="8" class="py-0">
                            <div class="text-left" style="color:white;">Opacity</div>
                        </v-col>
                        <v-col cols="4" class="py-0">   
                            <v-text-field
                                v-model="opacity"
                                class="mt-0 pt-0"
                                hide-details
                                type="number"
                                solo
                                outlined
                                dense
                                dark
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" class="py-0">
                            <v-slider
                                v-model="opacity"
                                class="align-center"
                                max="100"
                                min="0"
                                hide-details
                            ></v-slider>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </div>
    </div>
</template>

<script>
module.exports = {
  name: "TransformProperty",
  data() {
    return {
      anchor : {
        x: 0,
        y: 0
      },
      position : {
        x: 0,
        y: 0,
      },
      scale : {
        w: 0,
        h: 0,
      },
      degree: 0,
      opacity: 0
    };
  },
  watch: {
    anchor:{
        deep: true,
        handler(){
            RLottieModule.trAnchor(RLottieModule.keypath,Number(this.anchor.x),Number(this.anchor.y))
            RLottieModule.history.insert(RLottieModule.keypath, "TrAnchor", [Number(this.anchor.x),Number(this.anchor.y)])  
        }
    },
    position: {
        deep: true,
        handler(){
            RLottieModule.trPosition(RLottieModule.keypath,Number(this.position.x),Number(this.position.y))
            RLottieModule.history.insert(RLottieModule.keypath, "TrPosition", [Number(this.position.x),Number(this.position.y)])  
        }
    },
    scale: {
        deep: true,
        handler(){
            RLottieModule.trScale(RLottieModule.keypath,Number(this.scale.w),Number(this.scale.h))
            RLottieModule.history.insert(RLottieModule.keypath, "TrScale", [Number(this.scale.w),Number(this.scale.h)])  
        }
    },
    degree: function (val) {
        RLottieModule.trRotation(RLottieModule.keypath,Number(this.degree))
        RLottieModule.history.insert(RLottieModule.keypath, "TrRotation", [Number(this.degree)])  
    },
    opacity: function (val) {
        RLottieModule.trOpacity(RLottieModule.keypath,Number(this.opacity))
        RLottieModule.history.insert(RLottieModule.keypath, "TrOpacity", [Number(this.opacity)])
    },
  },
  computed: {
      
  },
  methods: {
      closeSidebar(){
        this.$emit("call-close-menu-parent");
      }
    },
}
</script>

<style scoped> 
 .v-text-field .v-input__control .v-input__slot {
    min-height: 20px !important;
    display: flex !important;
    align-items: center !important;
  }
</style>