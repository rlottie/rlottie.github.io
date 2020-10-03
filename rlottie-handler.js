class RLottieHandler {
    constructor(size) {
        this.rafId = 0;
        this.resizeId = {};
        this.mainCanvasId = 0;
        this.rlotties = [];
        this.curFrame = 0;
        this.playing = true;
        this.wasPlaying = false;
        this.playSpeed = 1;
        this.playDir = true;;
        this.isBounce = false;
        this.isHover = false;
        for (let i = 1; i <= size; i++) {
            this.rlotties.push(new RLottieModule("myCanvas" + i));
        }

        this.relayoutCanvas();
        this.slider = document.getElementById("slider");
        this.frameCount = document.getElementById("frameCount");
        this.currentFrame = document.getElementById("currentFrame");
        this.jsString = this.rlotties[0].lottieHandle.getDefaultLottie();

        frameCount.innerText = String(this.rlotties[0].frameCount);
        this.slider.max = this.rlotties[0].frameCount;

        app.$root.layers = this.rlotties[0].layerTree.child;
        app.$root.selectedCanvas = this.rlotties[0].canvas;
        app.$root.selectedCanvasStyle = this.rlotties[0].canvasStyle;
    }

    render() {
        var nextSpeed = this.playSpeed;
        var nextDir = this.playDir;
        var isMultiView = app.$root.isMultiView;
        for(let i = 0; i < this.rlotties.length; i++) {
            if(!isMultiView && i != this.mainCanvasId) continue;

            var rm = this.rlotties[i];
            rm.render(this.playSpeed);
            
            if(this.playDir && rm.curFrame > rm.frameCount) {
                if(this.isBounce) {
                    nextSpeed = -this.playSpeed;
                    nextDir = !this.playDir;
                }
                else rm.curFrame = 0;
            }
            if(!this.playDir && rm.curFrame <= 0) {
                if(this.isBounce) {
                    nextSpeed = -this.playSpeed;
                    nextDir = !this.playDir;
                }
                else rm.curFrame = rm.frameCount;
            }
        }
        this.playSpeed = nextSpeed;
        this.playDir = nextDir;
        this.curFrame = this.rlotties[this.mainCanvasId].curFrame;
        currentFrame.innerText = String(Math.round(this.curFrame - 1));
        slider.value = this.curFrame;
    }

    reload(jsString) {
        rlottieHandler.mainCanvasId = 0;
        this.rlotties.forEach(rm => {
            rm.lottieHandle.load(jsString);
            rm.frameCount = rm.lottieHandle.frames();
            rm.curFrame = 0;
            rm.makeLayerTree();
            rm.makeCanvasStyle();
        });
        this.relayoutCanvas();

        this.jsString = jsString;
        this.slider.max = this.rlotties[0].frameCount;
        this.slider.value = 0;
        this.frameCount.innerText = String(this.rlotties[0].frameCount);
        
        app.$root.layers = this.rlotties[0].layerTree.child;
        app.$root.selectedCanvas = this.rlotties[0].canvas;
        app.$root.selectedCanvasStyle = this.rlotties[0].canvasStyle;
        app.$root.selectedCanvasId = 0;
        
        app.$root.selectedLayerTrigger = !app.$root.selectedLayerTrigger;
        app.$root.selectedLayer = null;
        thumbnailHandler.reload(this.rlotties[0].layerTree.child, this.jsString);

        if(this.playing) return;
        
        document.getElementById("playButton").innerHTML = "<i class='fas fa-pause'></i>";
        this.play();
    }

    reset(canvasId) {
        var rm = this.rlotties[canvasId];
        rm.lottieHandle.load(this.jsString);
        rm.curFrame = this.curFrame;
        rm.makeLayerTree();
        rm.makeCanvasStyle();
        this.relayoutCanvas();

        app.$root.selectedCanvasStyle = rm.canvasStyle
        app.$root.layers = rm.layerTree.child;

        setTimeout(_ => thumbnailHandler.setModuleCanvas(rm.layerTree.child), 100);
        if(!this.playing) this.play();
    }

    pause() {
        window.cancelAnimationFrame(this.rafId);
        this.playing = false;
    }

    update() {
        var curFrame = this.rlotties[this.mainCanvasId].curFrame;
        this.rlotties.forEach(rm => rm.curFrame = curFrame);
        this.render();
    }

    play() {
        if(this.playing) return;
        this.playing = true;
        var curFrame = this.rlotties[this.mainCanvasId].curFrame;
        this.rlotties.forEach(rm => rm.curFrame = curFrame)
        this.rafId = window.requestAnimationFrame(updater);
    }

    seek(value) {
        this.rlotties.forEach(rm => {
            rm.curFrame = value;
            rm.render(this.playSpeed);
        });
        this.curFrame = this.rlotties[this.mainCanvasId].curFrame;
        currentFrame.innerText = String(Math.round(this.curFrame - 1));
    }

    setSnapshotURL() {
        var canvas = this.rlotties[this.mainCanvasId].canvas;
        if (canvas.width == 0 || canvas.height == 0) return;
        app.$root.snapshotURL = canvas.toDataURL()
    }

    relayoutCanvas() {
        var width = document.getElementById("player").clientWidth;
        var height = document.getElementById("player").clientHeight;
        var playbarHeight = document.getElementById("playbar").clientHeight;
        var extrtoolbarHeight = document.getElementById("collapseExtraTools").clientHeight
        
        height = height - playbarHeight - extrtoolbarHeight;
        width = width / 4 * 3;
        height = height / 4 * 3;

        var maxSize = width < height ? width : height;
        var size = width < height ? width : height;
        if(typeof (app.$root.isMultiView) != "undefined") {
            maxSize = app.$root.isMultiView ?  width : height;
            if(app.$root.isMultiView) size /= 2;
        }
        size = size < maxSize ? size : maxSize;
        this.rlotties.forEach(rm => {
            rm.canvas.width = size;
            rm.canvas.height = size;
            rm.canvas.style.width = size + "px";
            rm.canvas.style.height = size + "px";
        });
    }
}