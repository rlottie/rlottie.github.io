class RLottieModule {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.makeCanvasStyle();

        this.context = this.canvas.getContext("2d");
        this.lottieHandle = new Module.RlottieWasm();
        this.frameCount = this.lottieHandle.frames();
        this.makeLayerTree();
        this.curFrame = 0;
    }

    render(speed) {
        if (this.canvas.width == 0 || this.canvas.height == 0) return;
        this.curFrame = Number(this.curFrame) + speed;
        var buffer = this.lottieHandle.render(this.curFrame, this.canvas.width, this.canvas.height);
        var result = Uint8ClampedArray.from(buffer);
        var imageData = new ImageData(result, this.canvas.width, this.canvas.height);
        this.context.putImageData(imageData, 0, 0);
    }

    makeLayerTree() {
        this.layerTree = new LayerNode("**", "root", "", layerNodeSize++, 0);
        var fullLayers = [];
        var layer_vector = this.lottieHandle.allLayerTypeList();
        for(let i = 0; i < layer_vector.size(); i++) {
            fullLayers.push(layer_vector.get(i));
        }
        var commonId = 1;
        fullLayers.forEach(element => {
            var layer = element.split("::");
            var type = "Stroke";
            if(layer[0] == "Fill") type = "Fill";
            var curr = this.layerTree;
            var keypath = layer[2];
            this.layerTree.child.forEach(l => {
                if(l.idx == layer[1] && l.name == layer[2]) curr = l;
            })
            if(curr.name == "root") {
                let node = new LayerNode(keypath, keypath, type, layerNodeSize++, commonId++)
                node.idx = layer[1];
                curr.child.push(node);
                curr = node;
            }
            
            for(let i = 3; i < layer.length; i++) {
                keypath += "." + layer[i];
                let flag = false;
                for(let j = 0; j < curr.child.length; j++) {
                    if(curr.child[j].name != layer[i]) continue;
                    if(curr.child[j].type != type) curr.type = curr.child[j].type = "both";
                    curr = curr.child[j];
                    flag = true;
                }
                if(flag) continue;
                let node = new LayerNode(keypath, layer[i], type, layerNodeSize++, commonId++);
                curr.child.push(node);
                curr = node;
            }
        })
        this.layerTree.child.allVisibility = true
    }
    
    makeCanvasStyle() {
        this.canvasStyle = {
            backgroundColor: {
                alpha: 1,
                hex: "#FFFFFF",
                hexa: "#FFFFFFFF",
                hsla: {
                    h: 0,
                    s: 0,
                    l: 1,
                    a: 1,
                },
                hsva: {
                    h: 0,
                    s: 0,
                    v: 1,
                    a: 1,
                },
                hue: 0,
                rgba: {
                    r: 255,
                    g: 255,
                    b: 255,
                    a: 1
                }
            },
            borderColor: {
                alpha: 0,
                hex: "#BEBEBE",
                hexa: "#BEBEBEFF",
                hsla: {
                    h: 0,
                    s: 0,
                    l: 0.7450980392156863,
                    a: 1,
                },
                hsva: {
                    h: 0,
                    s: 0,
                    v: 0.7450980392156863,
                    a: 1,
                },
                hue: 0,
                rgba: {
                    r: 190,
                    g: 190,
                    b: 190,
                    a: 1
                }
            },
            borderWidth: '1',
            width: '',
            height: '',
            borderShape: 0,
            degree: 0
        }
        this.canvas.style.backgroundColor = this.canvasStyle.backgroundColor.hex;
        this.canvas.style.borderColor = this.canvasStyle.borderColor.hex;
        this.canvas.style.borderWidth = this.canvasStyle.borderWidth + 'px';
        this.canvas.style.width = this.canvasStyle.width + "px";
        this.canvas.style.height = this.canvasStyle.height + "px";
        this.canvas.style.borderRadius = 0;
        this.canvas.style.transform = `rotate(${this.canvasStyle.degree}deg)`;

    }

    makeGifFile(filename, callback) {
        var gif = new GIF({
            workers: 10,
            quality: 1
        });

        for (let i = 0; i <= this.frameCount; i++) {
            let buffer = this.lottieHandle.render(i, this.canvas.width, this.canvas.height);
            let result = Uint8ClampedArray.from(buffer);
            let imageData = new ImageData(result, this.canvas.width, this.canvas.height);

            for (let k = 0; k < imageData.data.length; k += 4) {
                // background color가 아니면 continue;
                if (imageData.data[k + 0] + imageData.data[k + 1] + imageData.data[k + 2] +imageData.data[k + 3] != 0) continue;


                // background color
                imageData.data[k + 0] = this.canvasStyle.backgroundColor.rgba.r;
                imageData.data[k + 1] = this.canvasStyle.backgroundColor.rgba.g;
                imageData.data[k + 2] = this.canvasStyle.backgroundColor.rgba.b;
                imageData.data[k + 3] = this.canvasStyle.backgroundColor.rgba.a;
            }

            gif.addFrame(imageData, {delay: 1000 / 60});
        }

        gif.on('finished', blob => {
            var a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            callback();
        });

        gif.render();
    }
}