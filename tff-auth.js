/**
 * TFF team gate — sessionStorage UX + server cookie via /api/auth.
 */
(function (global) {
  var STORAGE_KEY = "tff-session-v1";
  var PASS = "TFF4321#";

  function isAuthed() {
    try {
      return sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch (e) {
      return false;
    }
  }

  function setAuthed() {
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch (e) {}
  }

  function clearAuthed() {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
  }

  function logout() {
    clearAuthed();
    fetch("/api/auth", { method: "DELETE", credentials: "same-origin" }).finally(function () {
      global.location.href = "/gate";
    });
  }

  function getReturnUrl() {
    var params = new URLSearchParams(global.location.search);
    var ret = params.get("return");
    if (ret && ret.charAt(0) === "/") return ret;
    return "/toolkit";
  }

  function injectNoIndex() {
    if (document.querySelector('meta[name="robots"]')) return;
    var m = document.createElement("meta");
    m.name = "robots";
    m.content = "noindex, nofollow";
    document.head.appendChild(m);
  }

  function requireAuth() {
    if (isAuthed()) {
      injectNoIndex();
      return true;
    }
    var path = global.location.pathname + global.location.search + global.location.hash;
    if (path.indexOf("/gate") === 0) return false;
    global.location.replace("/gate?return=" + encodeURIComponent(path || "/toolkit"));
    return false;
  }

  function loginLocal(password) {
    if (password === PASS) {
      setAuthed();
      return true;
    }
    return false;
  }

  function login(password) {
    return fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ password: password })
    })
      .then(function (res) {
        if (res.ok) {
          setAuthed();
          return true;
        }
        return false;
      })
      .catch(function () {
        return false;
      });
  }

  global.TFF = {
    isAuthed: isAuthed,
    requireAuth: requireAuth,
    login: login,
    loginLocal: loginLocal,
    logout: logout,
    getReturnUrl: getReturnUrl
  };
})(window);