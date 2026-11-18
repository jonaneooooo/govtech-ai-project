(function () {
  var d = window.DASHBOARD_DATA;
  var $ = function (id) { return document.getElementById(id); };
  var latest = d.weeks[d.weeks.length - 1];
  var prev = d.weeks[d.weeks.length - 2];

  function pct(v) { return v === null ? "No data" : v + "%"; }
  function num(v) { return v === null ? "No data" : v.toLocaleString("en-SG"); }

  $("synthetic-label").textContent = d.label + ". Source: " + d.source + ".";

  function card(id, title, value, detail) {
    var el = $(id);
    el.querySelector("h3").textContent = title;
    el.querySelector(".big").textContent = value;
    el.querySelector(".detail").textContent = detail;
  }

  var range = latest.range + " · " + d.source;
  card("c-quality", "Quality pass rate (headline)", pct(latest.quality),
    range + ". Was " + pct(prev.quality) + " in " + prev.range + ". Threshold " + d.qualityThreshold + "%.");
  card("c-sla", "Replies within SLA", pct(latest.sla),
    range + ". Was " + pct(prev.sla) + " in " + prev.range + ". Target " + d.slaTarget + "%.");
  card("c-enq", "Total enquiries", num(latest.enquiries),
    range + ". Was " + num(prev.enquiries) + " in " + prev.range + ".");

  var below = latest.quality < d.qualityThreshold;
  var slaUp = latest.sla > prev.sla;
  var alert = $("alert");
  if (below && slaUp && latest.quality < prev.quality) {
    alert.textContent = "Act: SLA rose to " + latest.sla + "% but quality fell to " + latest.quality + "%, below the " + d.qualityThreshold + "% threshold. Speed is hiding a drop in quality.";
    alert.className = "alert bad";
  } else if (below) {
    alert.textContent = "Act: quality " + latest.quality + "% is below the " + d.qualityThreshold + "% threshold.";
    alert.className = "alert bad";
  } else {
    alert.textContent = "Quality is at or above the " + d.qualityThreshold + "% threshold.";
    alert.className = "alert ok";
  }

  var tb = $("rows");
  d.weeks.forEach(function (w) {
    var tr = document.createElement("tr");
    [w.range, pct(w.sla), pct(w.quality), num(w.enquiries)].forEach(function (t, i) {
      var td = document.createElement("td");
      td.textContent = t;
      if (t === "No data") td.className = "gap";
      if (i === 2 && w.quality < d.qualityThreshold) td.className = "low";
      tr.appendChild(td);
    });
    tb.appendChild(tr);
  });
})();
