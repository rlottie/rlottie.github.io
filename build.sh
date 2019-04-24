em++ -O3 -std=c++14 -s WASM=1 -s EXTRA_EXPORTED_RUNTIME_METHODS='["cwrap", "allocate" , "intArrayFromString"]' \
-I ./rlottie/src/lottie/ \
-I ./rlottie/src/lottie/rapidjson/ \
-I ./rlottie/src/vector/ \
-I ./rlottie/src/vector/pixman/ \
-I ./rlottie/src/vector/freetype/ \
-I ./rlottie/inc/ \
rlottie_wrapper.cpp \
./rlottie/src/lottie/lottieanimation.cpp \
./rlottie/src/vector/vrect.cpp \
./rlottie/src/vector/vbezier.cpp \
./rlottie/src/vector/vbitmap.cpp \
./rlottie/src/vector/vdebug.cpp \
./rlottie/src/vector/vdasher.cpp \
./rlottie/src/vector/vcompositionfunctions.cpp \
./rlottie/src/vector/vpainter.cpp \
./rlottie/src/vector/vmatrix.cpp \
./rlottie/src/vector/vraster.cpp \
./rlottie/src/vector/vpathmesure.cpp \
./rlottie/src/vector/pixman/vregion.cpp \
./rlottie/src/vector/velapsedtimer.cpp \
./rlottie/src/vector/vpath.cpp \
./rlottie/src/vector/vdrawhelper.cpp \
./rlottie/src/vector/vrle.cpp \
./rlottie/src/vector/stb/stb_image.cpp \
./rlottie/src/vector/vdrawable.cpp \
./rlottie/src/vector/freetype/v_ft_raster.cpp \
./rlottie/src/vector/freetype/v_ft_math.cpp \
./rlottie/src/vector/freetype/v_ft_stroker.cpp \
./rlottie/src/vector/vinterpolator.cpp \
./rlottie/src/vector/vbrush.cpp \
./rlottie/src/vector/vimageloader.cpp \
./rlottie/src/binding/c/lottieanimation_capi.cpp \
./rlottie/src/lottie/lottiemodel.cpp \
./rlottie/src/lottie/lottieloader.cpp \
./rlottie/src/lottie/lottieitem.cpp \
./rlottie/src/lottie/lottieparser.cpp \
./rlottie/src/lottie/lottiekeypath.cpp \
./rlottie/src/lottie/lottieproxymodel.cpp \
-o rlottie-wasm.js
