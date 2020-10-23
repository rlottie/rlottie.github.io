<center><img src="https://user-images.githubusercontent.com/25967949/94992643-7173a580-05c6-11eb-8514-322f459a88d8.png"></center>

## Introduction
rlottie Viewer is the most convenient lottie web player. It is created to help communication between designers and developers. Not only does rlottie Viewer helps designers and developers to check if the animation is rendered well on the website, but rlottie Viewer also allows to customize animation layers.

- **Simple Customization**: In the left panel, users can access each layer by keypath. In the right panel, you can easily adjust properties such as color, opacity, and position, and find out the immediate changes.
<br>

## Features
- [x] Change layer color
- [x] Change layer opacity
- [x] Change layer position
- [x] Canvas shape, rotation
- [x] Keypath search
- [ ] Multi view
- [ ] Play speed, type, direction
- [ ] Transforms

<br>

## Getting Started
### Env Setup

- Setup the emscripten sdk environment. Follow  Down and Install steps [emscripten](https://emscripten.org/docs/getting_started/downloads.html)
- Clone the repo
```bash
$ git clone --recurse-submodules https://github.com/rlottie/rlottie.github.io.git
```

### Build
```bash
$ cd rlottie
$ ./wasm_build.sh {absolute_emsdk_folder_path}
$ cp builddir_wasm/src/rlottie-wasm.* ../
```
- NOTE : to get a callstack modify build.sh file by passing the build flag -s assertions=1


### test
```bash
$ run ./test.sh
```

<br>

## License

No License

**But [gif.js](https://github.com/jnordberg/gif.js) has MIT License**
