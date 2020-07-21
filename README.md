# Env Setup
- Setup the emscripten sdk environment
   Follow  DoDown and Install steps https://emscripten.org/docs/getting_started/downloads.html
- Clone the repo using git clone --recurse-submodules https://github.com/rlottie/rlottie.github.io.git command

# Build
   - cd rlottie
   - ./wasm_build {emscripten_sdk_path}
   - cp builddir_wasm/src/rlottie-wasm.* ../
   - NOTE : to get a callstack modify build.sh file by passing the build flag -s assertions=1

# test
  run ./test.sh in command prompt.

