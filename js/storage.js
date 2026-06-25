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

  global.TFFStorage = { get: get, set: set, remove: remove };
})(typeof window !== "undefined" ? window : global);