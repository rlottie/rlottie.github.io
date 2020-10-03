
class ThumbnailHandler {
    constructor(layers) {
        this.rlotties = [];
        this.fullKeypaths = [];
        this.makeFullLayers();
        layers.forEach(l => {
            var rm = new RLottieModule(l.id);
            this.makeThumbnail(rm, l.idx);
            this.rlotties.push(rm);
        });
    }

    render() {
        this.rlotties.forEach(rm => {
            rm.render(1);
            if(rm.curFrame >= rm.frameCount) rm.curFrame = 0;
        })
    }

    reload(layers, jsString) {
        setTimeout(() => {
            this.rlotties = [];
            layers.forEach(l => {
                var rm = new RLottieModule(l.id);
                rm.lottieHandle.load(jsString);
                this.makeFullLayers();
                this.makeThumbnail(rm, l.idx);
                this.rlotties.push(rm);
            });
        }, 500)
    }

    setModuleCanvas(layers) {
        for(let i = 0; i < layers.length; i++) {
            this.rlotties[i].canvasId = layers[i].id;
            this.rlotties[i].canvas = document.getElementById(layers[i].id);
            this.rlotties[i].context = this.rlotties[i].canvas.getContext("2d");
        }
    }

    makeFullLayers() {
        var layer_vector = rlottieHandler.rlotties[0].lottieHandle.allLayerTypeList();
        for(let i = 0; i < layer_vector.size(); i++) {
            var layer = layer_vector.get(i).split("::");
            var fullKeypath = "";
            for(let j = 2; j < layer.length; j++) {
                fullKeypath += layer[j] + ".";
            }
            if(typeof (this.fullKeypaths[layer[1]]) == "undefined") this.fullKeypaths[layer[1]] = [];
            this.fullKeypaths[layer[1]].push(fullKeypath + "**");
        }
    }

    makeThumbnail(module, layerIdx) {
        module.lottieHandle.setFillOpacity("**", 0);
        module.lottieHandle.setStrokeOpacity("**", 0);
        this.fullKeypaths[layerIdx].forEach(fullKeypath => {
            module.lottieHandle.setFillOpacity(fullKeypath, 100);
            module.lottieHandle.setStrokeOpacity(fullKeypath, 100);
        })
    }
}