<template>
    <div>
        <v-btn 
            fixed
            fab
            icon            
            style="right:0"
            color="transparent"
            @click="navigation=!navigation"
        >
            <v-icon 
                :color="navigation ? 'white':'grey'"
            >
                mdi-key-variant mdi-flip-h
            </v-icon>        
        </v-btn>
        <v-navigation-drawer 
            v-model="navigation"
            right
            absolute
            color="#292c31"
            width="350"
            height="859"
        >
            <v-switch          
                v-model="isSelectAll"      
                inset
                label="Select all sub keypath"
                color="rgba(0, 153, 204, 1)"
                style="margin-left:15px;"
                dark
            ></v-switch>
            <v-treeview
                :items="layers"
                dark     
                activatable
                hoverable
                item-key="keypath"
                color="rgba(0, 153, 204, 1)"
                @update:active="changeFocus"
            >
                <template v-slot:prepend="{ item, open }">
                    <v-icon v-if="item.type == 'root'">
                        {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
                    </v-icon>
                    
                    <v-icon v-else-if="item.type == '4'">
                        mdi-layers
                    </v-icon>
                    <v-icon v-else-if="item.type == 'gr'">
                        mdi-crop
                    </v-icon>
                    <v-icon v-else-if="item.type == 'st'">
                        mdi-pencil
                    </v-icon>
                    <v-icon v-else-if="item.type == 'fl'">
                        mdi-format-color-fill
                    </v-icon>
                    <v-icon v-else>
                        mdi-cancel
                    </v-icon>

                </template>
            </v-treeview>
        </v-navigation-drawer>
    </div>
</template>

<script>
module.exports = {
    name:"right-bar",
    data() {
        return {
            isSelectAll: false,
            navigation: false,
            layers: [],
            keypath: '',
        }
    },
    watch: {
        isSelectAll() {            
            RLottieModule.keypath = this.isSelectAll ? (this.keypath ? this.keypath + '.**' : '**') : this.keypath;
        }
    },
    mounted() {
        var setLayers = this.setLayers;
        window.addEventListener('initLayers', function(e) {            
            setLayers(e.detail.layers)
        })
    },
    methods: {
        setLayers(layers) {
            this.layers = [layers];
        },

        changeFocus(e){
            this.keypath = e[0]
            RLottieModule.keypath = this.isSelectAll ? (this.keypath ? this.keypath + '.**' : '**') : this.keypath
        }
    }
}
</script>

<style scoped>
.v-navigation-drawer__content {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
}

.v-navigation-drawer__content::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
}
</style>