(function () {
  if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) return;

  function sync() {
    var tv = window.innerWidth >= 1600 && window.innerHeight >= 900;
    document.documentElement.classList.toggle("tv-display", tv);
  }

  sync();
  window.addEventListener("resize", sync);
})();
