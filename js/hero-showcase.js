(function () {
  var BOTTLES = [
    "clean-mint",
    "revitalizing-mint",
    "rainforest-mint",
    "dazzling-mint",
    "grapes-galore",
    "wacky-watermelon",
    "strawberry-splash",
    "bubble-gum",
    "tingling-mint",
    "overnight"
  ];

  function buildBottles(stage) {
    if (stage.querySelector(".guest-hero-bottles")) return;
    var wrap = document.createElement("div");
    wrap.className = "guest-hero-bottles";
    wrap.setAttribute("aria-hidden", "true");
    BOTTLES.forEach(function (slug) {
      var img = document.createElement("img");
      img.src = "/assets/bottles/" + slug + ".png?v=4";
      img.alt = "";
      img.loading = "eager";
      img.decoding = "async";
      wrap.appendChild(img);
    });
    var tank = stage.querySelector(".guest-hero-tank");
    if (tank) {
      stage.insertBefore(wrap, tank);
    } else {
      stage.appendChild(wrap);
    }
  }

  function init() {
    document.querySelectorAll(".guest-hero-stage").forEach(buildBottles);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();