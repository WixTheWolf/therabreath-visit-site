(function (global) {
  var DEVICE_KEY = "tff-device-id";

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

  function submit(state, onDone) {
    var set = meta();
    fetch("/api/flight/live", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({
        deviceId: deviceId(),
        guest: state.guest || "",
        samples: state.samples || {},
        ranking: state.ranking || {},
        finalComment: state.finalComment || "",
        conceptVersion: set.version,
        conceptLabel: set.label
      })
    })
      .then(function (r) { return r.json().then(function (data) { return { status: r.status, data: data }; }); })
      .then(function (res) { if (onDone) onDone(res.data, res.status); })
      .catch(function () { if (onDone) onDone({ ok: false, error: "network" }, 0); });
  }

  global.TFFFlightSync = { deviceId: deviceId, submit: submit };
})(typeof window !== "undefined" ? window : global);
