#build instruction to generate rlottie.js from rlottie library.
   1. Make following changes in lottie/src/vector/config.h
    // disable threading  (wasm dosen't support threading yet)
    //#define LOTTIE_THREAD_SUPPORT

    //disable logging (we don't want to create log file)
    //#define LOTTIE_LOGGING_SUPPORT

    //enable static building of image loader ( to support embedded image resource)
    #define LOTTIE_STATIC_IMAGE_LOADER
   2. run ./build.sh
   
 # test
   run ./test.sh in command prompt.
    
