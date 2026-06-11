/**
 * Shared localStorage helpers for TFF portal tools.
 */
(function (global) {
  function get(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      if (raw == null) return fallback !== undefined ? fallback : null;
      return JSON.parse(raw);
    } catch (e) {
      return fallback !== undefined ? fallback : null;
    }
  }

  function set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function remove(key) {
    localStorage.removeItem(key);
  }

  function bindInputs(root, key, map) {
    var timer;
    function persist() {
      var data = get(key, {}) || {};
      map.forEach(function (item) {
        var el = root.querySelector(item.sel);
        if (!el) return;
        var val = item.type === "number" ? +el.value : el.value;
        if (item.field) data[item.field] = val;
        else data[el.id] = val;
      });
      set(key, data);
      showSaved();
    }
    map.forEach(function (item) {
      var el = root.querySelector(item.sel);
      if (!el) return;
      el.addEventListener("input", function () {
        clearTimeout(timer);
        timer = setTimeout(persist, 200);
      });
      el.addEventListener("change", persist);
    });
    return persist;
  }

  function restoreInputs(root, key, map) {
    var data = get(key, {}) || {};
    map.forEach(function (item) {
      var el = root.querySelector(item.sel);
      if (!el) return;
      var val = item.field ? data[item.field] : data[el.id];
      if (val == null) return;
      el.value = val;
    });
  }

  var savedEl;
  function showSaved(msg) {
    if (!savedEl) savedEl = document.getElementById("tff-saved");
    if (!savedEl) return;
    savedEl.textContent = msg || "Saved";
    savedEl.classList.add("show");
    clearTimeout(savedEl._t);
    savedEl._t = setTimeout(function () {
      savedEl.classList.remove("show");
    }, 1800);
  }

  global.TFFStorage = {
    get: get,
    set: set,
    remove: remove,
    bindInputs: bindInputs,
    restoreInputs: restoreInputs,
    showSaved: showSaved
  };
})(typeof window !== "undefined" ? window : global);