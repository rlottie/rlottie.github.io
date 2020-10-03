class LayerNode {
    constructor(keypath, name, type, id, commonId) {
        this.id = id;
        this.idx = -1;
        this.commonId = commonId;
        this.keypath = keypath;
        this.name = name;
        this.type = type;
        this.visible = true;
        this.selected = false;
        this.opacity = 100;
        this.beforeOpacity = 100;
        this.strokeWidth = Number();
        // this.xPos = 0;
        // this.yPos = 0;
        // this.scaleWidth = 100;
        // this.scaleHeight = 100;
        // this.rotation = 0;
        this.color = {
            alpha: Number(),
            hex: String(),
            hexa: String(),
            hsla: {
                h: Number(),
                s: Number(),
                l: Number(),
                a: Number(),
            },
            hsva: {
                h: Number(),
                s: Number(),
                v: Number(),
                a: Number(),
            },
            hue: Number(),
            rgba: {
                r: Number(),
                g: Number(),
                b: Number(),
                a: Number()
            }
        }
        this.child = []
    }
}