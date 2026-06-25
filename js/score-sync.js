(function (global) {
  var DEVICE_KEY = "tff-device-id";
  var debounceMs = 700;
  var timer = null;

  function deviceId() {
    var id = null;
    try { id = localStorage.getItem(DEVICE_KEY); } catch (e) {}
    if (!id) {
      id = "d-" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
      try { localStorage.setItem(DEVICE_KEY, id); } catch (e2) {}
    }
    return id;
  }

  function meta() {
    var m = global.TFFConcepts && global.TFFConcepts.setMeta;
    return m ? m() : { version: 0, label: "" };
  }

  function push(scores, rater, totalConcepts, onDone) {
    var name = (rater || "").trim();
    if (!name) {
      if (onDone) onDone({ ok: false, error: "name_required" });
      return;
    }
    if (timer) clearTimeout(timer);
    timer = setTimeout(function () {
      var set = meta();
      fetch("/api/score/live", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deviceId: deviceId(),
          rater: name,
          scores: scores || {},
          conceptVersion: set.version,
          conceptLabel: set.label,
          totalConcepts: totalConcepts || 10
        })
      })
        .then(function (r) { return r.json().then(function (data) { return { status: r.status, data: data }; }); })
        .then(function (res) { if (onDone) onDone(res.data, res.status); })
        .catch(function () { if (onDone) onDone({ ok: false, error: "network" }); });
    }, debounceMs);
  }

  function fetchPublic(onDone) {
    fetch("/api/score/live")
      .then(function (r) { return r.json().then(function (data) { return { status: r.status, data: data }; }); })
      .then(function (res) { if (onDone) onDone(res.data, res.status); })
      .catch(function () { if (onDone) onDone({ ok: false, error: "network" }); });
  }

  global.TFFScoreSync = { deviceId: deviceId, push: push, fetchPublic: fetchPublic };
})(typeof window !== "undefined" ? window : global);