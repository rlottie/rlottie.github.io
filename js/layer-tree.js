// Create rlottie layers management object
function Layers(RLottieModule, jsString) {
  this.RLottieModule = RLottieModule;
  this.originLayers = JSON.parse(jsString);

  // Managing property values for a keypath
  this.layerList = [];

  // Treeview management object
  this.layerTree = [];

  // Stack of Task record
  this.history = [];
  this.cur = -1;
  this.top = -1;

  // Duplicate property management
  this.savedLayers = [];

  function initProperty(type) {
    return {
      type: type,
      color: {
        alpha: 1,
        hex: '#FFFFFF',
        hexa: '#FFFFFFFF',
        hsla: {
          h: 0,
          s: 1,
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
          r: 250,
          g: 250,
          b: 250,
          a: 1,
        },
      },
      strokeWidth: 0,
      anchorX: 0,
      anchorY: 0,
      positionX: 0,
      positionY: 0,
      scaleWidth: 100,
      scaleHeight: 100,
      rotation: 0,
      opacity: 100,
    };
  }

  // Parse json
  function initLayerList(layerList, layer, keypath) {
    if (layer['nm']) {
      keypath = keypath + (keypath ? '\n' : '') + layer['nm'];
      layerList[keypath] = initProperty(layer['ty']);

      switch (layer['ty']) {
        case 'st':
          layerList[keypath].strokeWidth = parseInt(layer.w.k);
        case 'fl':
          layerList[keypath].color.rgba.r = parseInt(parseFloat(layer.c.k[0]) * 255);
          layerList[keypath].color.rgba.g = parseInt(parseFloat(layer.c.k[1]) * 255);
          layerList[keypath].color.rgba.b = parseInt(parseFloat(layer.c.k[2]) * 255);
          layerList[keypath].color.rgba.a = parseFloat(layer.o.k) / 100;
          break;
      }
    }

    for (let i in layer) {
      if (Array.isArray(layer[i])) {
        for (let j in layer[i]) {
          initLayerList(layerList, layer[i][j], keypath);
        }
      }
    }
  }

  // Layerlist to layertree
  function initLayerTree(layer, names, idx, depth, type) {
    if (idx == depth) {
      layer.type = type;
      layer.keypath = names.join('.');
      return;
    }

    var flag = true;
    for (let i in layer.children) {
      if (layer.children[i].name == names[idx]) {
        initLayerTree(layer.children[i], names, idx + 1, depth, type);
        flag = false;
        break;
      }
    }

    if (flag) {
      layer.children.push({
        name: names[idx],
        children: [],
      });
      initLayerTree(layer.children[layer.children.length - 1], names, idx + 1, depth, type);
    }
  }

  this.getLayerList = function () {
    if (!this.layerList.length) {
      let rootPath = this.originLayers.nm;
      this.originLayers.nm = '';
      initLayerList(this.layerList, this.originLayers, '');
      this.originLayers.nm = rootPath;
    }
    return this.layerList;
  };

  this.getLayerTree = function () {
    if (!this.layerTree.length) {
      var layerList = this.getLayerList();

      this.layerTree = [
        {
          name: this.originLayers.nm,
          children: [],
          type: 'root',
          keypath: '',
        },
      ];

      for (let keypath in layerList) {
        var names = keypath.split('\n');
        initLayerTree(this.layerTree[0], names, 0, names.length, layerList[keypath].type);
        layerList[names.join('.')] = layerList[keypath];
      }
      layerList[''] = initProperty('root');
    }
    return this.layerTree;
  };

  // Set properties on the matching keypath
  this.setProperty = function (keypath, property, param) {
    switch (property) {
      case 'ShapeColor':
        this.RLottieModule.fillColors(keypath, param.r, param.g, param.b, param.a);
        this.RLottieModule.strokeColors(keypath, param.r, param.g, param.b, param.a);
        break;
      case 'StrokeWidth':
        this.RLottieModule.strokeWidth(keypath, param.strokeWidth);
        break;
      case 'TrAnchor':
        this.RLottieModule.trAnchor(keypath, param.anchorX, param.anchorY);
        break;
      case 'TrPosition':
        this.RLottieModule.trPosition(keypath, param.positionX, param.positionY);
        break;
      case 'TrScale':
        this.RLottieModule.trScale(keypath, param.scaleWidth, param.scaleHeight);
        break;
      case 'TrRotation':
        this.RLottieModule.trRotation(keypath, param.rotation);
        break;
      case 'TrOpacity':
        this.RLottieModule.trOpacity(keypath, param.opacity);
        break;
    }
  };

  // Logging history
  this.insert = function (keypath, property, args) {
    while (this.cur < this.top) {
      this.history.pop();
      this.top--;
    }

    this.history.push({
      keypath,
      property,
      args,
    });

    this.cur = ++this.top;
    this.setHistoryState();
  };

  // Reset property
  this.reload = function () {
    this.RLottieModule.reload(jsString);

    let check = [];
    for (let i = 0; i <= this.cur; i++) {
      let key = this.history[i]['keypath'];
      let prop = this.history[i]['property'];
      let args = this.history[i]['args'];
      this.setProperty(key, prop, args);
    }

    this.setHistoryState();
  };

  // Highlighting selected layers
  this.highlighting = function (keypath) {
    this.RLottieModule.lottieHandle.setFillOpacity('**', 30);
    this.RLottieModule.lottieHandle.setStrokeOpacity('**', 30);
    for (let i = 0; i <= this.cur; i++) {
      let key = this.history[i]['keypath'];
      let prop = this.history[i]['property'];
      let args = this.history[i]['args'];
      let params = {};
      for (let j in args) {
        params[j] = args[j];
      }
      if (prop == 'ShapeColor') {
        params.a *= 0.3;
        this.setProperty(key, prop, params);
      }
    }
    this.RLottieModule.lottieHandle.setFillOpacity(keypath, 100);
    this.RLottieModule.lottieHandle.setStrokeOpacity(keypath, 100);
  };

  // Undo and Redo button activation
  this.setHistoryState = function () {
    store.commit('setHasPrev', this.hasPrev());
    store.commit('setHasNext', this.hasNext());
  };

  // Has previous history log?
  this.hasPrev = function () {
    return this.cur != -1;
  };

  // Has next history log?
  this.hasNext = function () {
    return this.cur < this.top;
  };

  // Undo
  this.movePrev = function () {
    if (!this.hasPrev()) {
      return false;
    }
    this.cur--;
    store.dispatch('reloadCanvas');
  };

  // Redo
  this.moveNext = function () {
    if (!this.hasNext()) {
      return false;
    }
    this.cur++;
    store.dispatch('reloadCanvas');
  };

  // Export color property
  changeColor = function (layer, args) {
    if (layer.c == null) {
      layer.c = {
        a: 0,
        k: [args.r, args.g, args.b, 1],
      };
    }
    if (layer.o == null) {
      layer.o = {
        a: 0,
        k: args.a,
      };
    }
    layer.c.k = [args.r, args.g, args.b, layer.c.k ? layer.c.k[3] : 0];
    layer.o.k = args.a;
  };

  // Export stroke width property
  changeWidth = function (layer, args) {
    if (layer.w == null) {
      layer.w = {
        a: 0,
        k: args.strokeWidth,
      };
    }
    layer.w.k = args.strokeWidth;
  };

  // Export anchor property
  changeTrAnchor = function (layer, args) {
    // if (layer.a && layer.a.k) {
    //   layer.a.k = [parseFloat(layer.a.k[0]) + args.anchorX, parseFloat(layer.a.k[1]) + args.anchorY];
    // }
    if (layer.a && layer.a.k) {
      layer.a.k[0] = parseFloat(layer.a.k[0]) + args.anchorX;
      layer.a.k[1] = parseFloat(layer.a.k[1]) + args.anchorY;
    }
  };

  // Export position property
  changeTrPosition = function (layer, args) {
    if (layer.p && layer.p.k) {
      layer.p.k[0] = parseFloat(layer.p.k[0]) + args.positionX;
      layer.p.k[1] = parseFloat(layer.p.k[1]) + args.positionY;
    }
  };

  // Export rotation property
  changeTrRotation = function (layer, args) {
    if (layer.r != null && layer.r.k != null) {
      layer.r.k = (parseInt(layer.r.k) + args.rotation) % 360;
    }
  };

  // Export scale property
  changeTrScale = function (layer, args) {
    if (layer.s && layer.s.k) {
      layer.s.k = [
        (parseFloat(layer.s.k[0]) * args.scaleWidth) / 100,
        (parseFloat(layer.s.k[1]) * args.scaleHeight) / 100,
      ];
    }
  };

  // Export opacity property
  changeTrOpacity = function (layer, args) {
    if (layer.o && layer.o.k) {
      layer.o = {
        a: 0,
        k: args.opacity,
      };
    }
  };

  // Export property
  this.changeProperty = function (layer, names, property, args, flag, keypath) {
    if (names.length == 0 || names[0] == '**') {
      flag = true;
    }

    if (layer.nm) {
      if (keypath) {
        keypath = keypath + '.' + layer.nm;
      } else {
        keypath = layer.nm;
      }
    }

    if (this.savedLayers[keypath] == null) {
      this.savedLayers[keypath] = [];
    }

    if (flag && this.savedLayers[keypath][property] == null) {
      this.savedLayers[keypath][property] = 1;
      switch (property) {
        case 'ShapeColor':
          if (layer.ty == 'fl' || layer.ty == 'st') {
            changeColor(layer, args);
          }
          break;
        case 'StrokeWidth':
          if (layer.ty == 'st') {
            changeWidth(layer, args);
          }
          break;
        case 'TrAnchor':
          if (layer.ty == 'tr') {
            changeTrAnchor(layer, args);
          }
          break;
        case 'TrPosition':
          if (layer.ty == 'tr') {
            changeTrPosition(layer, args);
          }
          break;
        case 'TrRotation':
          if (layer.ty == 'tr') {
            changeTrRotation(layer, args);
          }
          break;
        case 'TrScale':
          if (layer.ty == 'tr') {
            changeTrScale(layer, args);
          }
          break;
        case 'TrOpacity':
          if (layer.ty == 'tr') {
            changeTrOpacity(layer, args);
          }
          break;
      }
    }

    for (let i in layer) {
      if (layer[i].nm && (names[0] == '**' || layer[i] == names[0])) {
        this.changeProperty(layer[i], names.slice(names[0] != '**'), property, args, flag, keypath);
      }

      if (Array.isArray(layer[i])) {
        for (let j in layer[i])
          if (layer[i][j].nm == names[0] || names[0] == '**')
            this.changeProperty(layer[i][j], names.slice(names[0] != '**'), property, args, flag, keypath);
      }
    }
  };

  // Export customizing layers
  this.exportLayers = function () {
    var saveObject = JSON.parse(jsString);
    this.savedLayers = [];
    for (let i = this.cur; i >= 0; i--) {
      var { keypath, property, args } = this.history[i];
      this.changeProperty(saveObject, keypath.split('.'), property, args, false, '');
    }

    var dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(saveObject));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', dataStr);
    var fileName = Math.random().toString(36).substr(2, 8).toUpperCase() + '_' + this.RLottieModule.fileName;
    downloadAnchorNode.setAttribute('download', fileName);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };
  this.setHistoryState();
}
