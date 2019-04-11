(function () {
    // load the script depending on web worker support
    var src;
    if (typeof(Worker) !== "undefined") {
        src = 'module-rlottie.js';
    } else {
        src = 'module-rlottie.js';
    }
    var head = document.head;
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    head.appendChild(script);
})();
