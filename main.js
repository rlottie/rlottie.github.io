(function () {
    // load the script depending on web worker support
    var srcs;
    if (typeof(Worker) !== "undefined") {
        srcs = [
            "index.js",
            "rlottie-module.js",
            "rlottie-handler.js"
        ];
    } else {
        srcs = [];
    }
    var head = document.head;

    srcs.forEach(src => {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = src;
        head.appendChild(script);
    });
})();
