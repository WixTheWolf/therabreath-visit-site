(function (global) {
  var STORAGE_KEY = "tff-session-v1";

  function isAuthed() {
    try { return sessionStorage.getItem(STORAGE_KEY) === "1"; }
    catch (e) { return false; }
  }

  function setAuthed() {
    try { sessionStorage.setItem(STORAGE_KEY, "1"); } catch (e) {}
  }

  function clearAuthed() {
    try { sessionStorage.removeItem(STORAGE_KEY); } catch (e) {}
  }

  function getReturnUrl(fallback) {
    var params = new URLSearchParams(global.location.search);
    var ret = params.get("return");
    if (ret && ret.charAt(0) === "/") return ret;
    return fallback || "/packet";
  }

  function logout() {
    clearAuthed();
    fetch("/api/auth", { method: "DELETE", credentials: "same-origin" }).finally(function () {
      global.location.href = "/gate";
    });
  }

  function login(password) {
    return fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ password: password })
    })
      .then(function (res) {
        if (res.ok) { setAuthed(); return true; }
        return false;
      })
      .catch(function () { return false; });
  }

  global.TFF = {
    isAuthed: isAuthed,
    login: login,
    logout: logout,
    getReturnUrl: getReturnUrl
  };
})(window);