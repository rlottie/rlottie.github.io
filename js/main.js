(function () {
  var srcs = ['./js/module-rlottie.js', './js/layer-tree.js'];

  srcs.forEach((src) => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    document.head.appendChild(script);
  });
})();
