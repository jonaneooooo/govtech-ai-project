(function () {
  var d = window.PROTOTYPE_DATA;
  var $ = function (id) { return document.getElementById(id); };
  var cur = 0, lines, editing, approved, edits, inserted, routed;
  var lookupTries = 0, lookupBusy = false, lookupToken = 0, gapLog = [];
  var LOOKUP_MS = 900;
  // Per-case timer. Target is 3 minutes. Going over warns; it never blocks.
  var MAX_MS = 180000, WARN_MS = 120000, timerStart = 0, timerStoppedAt = null;
  function fmt(ms) { var t = Math.floor(ms / 1000); return Math.floor(t / 60) + ":" + String(t % 60).padStart(2, "0"); }
  function elapsed() { return Math.max(0, (timerStoppedAt || Date.now()) - timerStart); }
  var SENSITIVE_ESCALATE_MS = 1800000; // 30 minutes (made up), from the one-pager escalation table
  function renderTimer() {
    var wait = $("wait");
    if (wait) {
      var we = Math.max(0, Date.now() - timerStart);
      wait.textContent = "Waiting for a human agent: " + fmt(we) + ". " +
        (we >= SENSITIVE_ESCALATE_MS ? "Not picked up in 30 minutes. Moved to the duty officer." : "Moves to the duty officer at 30:00 if no one picks it up.");
    }
    var e = elapsed(), t = $("timer");
    t.textContent = "Time on case: " + fmt(e) + " / 3:00" + (e >= MAX_MS ? " \u00b7 Over 3 minutes" : "") + (timerStoppedAt ? " \u00b7 Stopped" : "");
    t.className = "timer" + (e >= MAX_MS ? " over" : e >= WARN_MS ? " warn" : "");
  }
  function stopTimer() { if (!timerStoppedAt) timerStoppedAt = Date.now(); renderTimer(); }
  setInterval(renderTimer, 250);

  $("synthetic-label").textContent = d.label + ". No real residents, policies or cases.";

  function copyLines(c) { return c.draft.map(function (l) { return { id: l.id, text: l.text, cite: l.cite, conf: l.conf, why: l.why, needsSource: l.needsSource }; }); }
  // The rule: a line needs a source unless it is marked "no source needed".
  function unsourced(l) { return !l.cite && l.needsSource !== false && l.text.trim() !== ""; }
  // Rewording a claim does not give it a source. Only a citation, or removing the line, clears it.
  function setStatus(msg) { $("status").textContent = msg; }

  function renderTabs() {
    var nav = $("cases");
    nav.innerHTML = "";
    d.cases.forEach(function (c, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "case-tab";
      b.textContent = c.tab;
      if (i === cur) b.setAttribute("aria-current", "true");
      b.addEventListener("click", function () { load(i); });
      nav.appendChild(b);
    });
    $("screen-tag").textContent = "Prototype · case " + (cur + 1) + " of " + d.cases.length;
  }

  function renderEnquiry() {
    var e = d.cases[cur].enquiry;
    $("case-id").textContent = e.caseId;
    $("channel").textContent = e.channel;
    $("received").textContent = e.received;
    $("subject").textContent = e.subject;
    $("body").textContent = e.body;
  }

  function renderPolicy(activeId) {
    if (d.cases[cur].sensitive) {
      $("policy").innerHTML = "";
      $("policy").appendChild(el("p", "lookup-msg", "No policy lookup. Sensitive cases go to a human agent, who decides the reply."));
      return;
    }
    if (d.cases[cur].lookup === "fail") { renderLookup(); return; }
    var p = d.cases[cur].policy;
    $("policy").innerHTML = '<h3 class="policy-title"></h3><p class="policy-meta"></p>';
    $("policy").querySelector(".policy-title").textContent = p.id + " · " + p.title;
    $("policy").querySelector(".policy-meta").textContent = p.owner + " · " + p.updated;
    p.passages.forEach(function (ps) {
      var el = document.createElement("p");
      el.className = "passage" + (ps.id === activeId ? " active" : "");
      el.id = ps.id;
      el.textContent = ps.text;
      $("policy").appendChild(el);
    });
  }

  function renderSensitive() {
    var s = d.cases[cur].sensitive, box = $("draft");
    box.appendChild(el("p", "sens-h", "No AI draft. Sent straight to a human agent."));
    box.appendChild(el("p", "sens-why", "Why: " + s.reasons.join(", ") + "."));
    box.appendChild(el("p", "sens-quote", "From the enquiry: \u201c" + s.quote + "\u201d"));
    box.appendChild(el("p", "sens-own", "You still own this case until a human agent accepts it."));
    var w = el("p", "sens-wait"); w.id = "wait"; box.appendChild(w);
  }

  function renderDraft() {
    var box = $("draft");
    box.innerHTML = "";
    box.className = "draft" + (d.cases[cur].sensitive ? " sensitive" : "");
    if (d.cases[cur].sensitive) { renderSensitive(); renderTimer(); return; }
    var showFlags = !d.cases[cur].hiddenTest;
    lines.forEach(function (l, i) {
      var flag = showFlags && unsourced(l);
      var p = document.createElement("p");
      p.className = "line line-wrap" + (flag ? " low" : "");
      var span = document.createElement("span");
      span.className = "line-text";
      span.textContent = l.text;
      span.dataset.index = i;
      if (editing) { span.contentEditable = "true"; span.style.outline = "2px solid #1f5fbf"; }
      p.appendChild(span);
      if (l.cite) {
        var b = document.createElement("button");
        b.className = "cite";
        b.type = "button";
        b.textContent = l.cite;
        b.setAttribute("aria-label", "Show policy passage " + l.cite);
        b.addEventListener("click", function () { renderPolicy(l.cite); $(l.cite).scrollIntoView({ block: "nearest" }); });
        p.appendChild(b);
      } else if (l.needsSource === false) {
        var ok = document.createElement("span");
        ok.className = "nosrc-ok";
        ok.textContent = "No source needed";
        p.appendChild(ok);
      } else if (flag) {
        if (!approved && !routed) {
          var rm = document.createElement("button");
          rm.type = "button"; rm.className = "remove-line"; rm.textContent = "Remove line";
          rm.addEventListener("click", function () { removeLine(i); });
          p.appendChild(rm);
        }
        var n = document.createElement("span");
        n.className = "nosrc";
        n.textContent = "No source";
        p.appendChild(n);
        var w = document.createElement("span");
        w.className = "low-note";
        w.textContent = (l.conf === "low" ? "Low confidence. " : "") + (l.why || "No policy passage backs this line. Check before sending.") +
          (l.text !== (d.cases[cur].draft[i] || {}).text ? " Edited, but still no source." : "");
        p.appendChild(w);
      }
      box.appendChild(p);
    });
  }

  function updateButtons() {
    var orig = d.cases[cur].draft;
    var blocked = !d.cases[cur].hiddenTest && lines.some(unsourced);
    var noPolicy = d.cases[cur].lookup === "fail";
    var done = approved || routed;
    $("approve").disabled = done || blocked || noPolicy;
    var note = "";
    if (d.cases[cur].sensitive) {
      note = "Approve blocked: sensitive case. A human agent resolves it with no AI draft.";
    } else if (!done && noPolicy) {
      note = lookupBusy ? "Approve blocked: looking up the policy page."
        : lookupTries >= 2 ? "Approve blocked: no policy page. Route to a human agent."
        : "Approve blocked: lookup failed. Retry the lookup.";
    } else if (!done && blocked) {
      note = "Approve blocked: a line has no source. Remove it, or insert a cited snippet instead.";
    }
    $("block-note").textContent = note;
    $("edit").textContent = editing ? "Done editing" : "Edit";
    $("edit").disabled = done;
    $("restore").disabled = done || (lines.length === orig.length && !lines.some(function (l, i) { return l.text !== orig[i].text; }));
    $("snip-search").disabled = done;
    $("route-human").disabled = done;
  }

  function removeLine(i) {
    if (editing) { syncEdits(); editing = false; }
    lines.splice(i, 1); edits += 1;
    setStatus("Line removed.");
    renderDraft(); updateButtons();
  }

  function syncEdits() {
    document.querySelectorAll("#draft span[data-index]").forEach(function (s) {
      var i = Number(s.dataset.index);
      if (lines[i].text !== s.textContent) { lines[i].text = s.textContent; edits += 1; }
    });
  }

  function renderSnippets() {
    var q = $("snip-search").value.trim().toLowerCase();
    var list = $("snip-list");
    list.innerHTML = "";
    var words = q.split(/\s+/).filter(Boolean);
    var hits = d.snippets.filter(function (sn) {
      if (!words.length) return false;
      var hay = (sn.title + " " + sn.keywords + " " + sn.text).toLowerCase();
      return words.every(function (w) { return hay.indexOf(w) !== -1; });
    });
    hits.forEach(function (sn) {
      var li = document.createElement("li");
      var t = document.createElement("p");
      t.className = "snip-title";
      t.textContent = sn.id + " · " + sn.title + " (" + sn.cite + ")";
      var body = document.createElement("p");
      body.className = "snip-text";
      body.textContent = sn.text;
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = "Insert";
      b.disabled = approved || routed;
      b.addEventListener("click", function () { insertSnippet(sn); });
      li.appendChild(t); li.appendChild(body); li.appendChild(b);
      list.appendChild(li);
    });
    $("snip-none").hidden = !(words.length && hits.length === 0);
  }

  function insertSnippet(sn) {
    if (editing) { syncEdits(); editing = false; }
    lines.push({ id: sn.id, text: sn.text, cite: sn.cite });
    inserted += 1;
    setStatus("Inserted " + sn.id + " (" + sn.cite + ").");
    renderDraft(); updateButtons();
  }

  $("snip-search").addEventListener("input", renderSnippets);

  function routeToHuman() {
    if (editing) { syncEdits(); editing = false; }
    routed = true; stopTimer();
    setStatus("Routed to a human agent. No AI draft for this case. Time: " + fmt(elapsed()) + ".");
    renderDraft(); updateButtons(); renderSnippets();
    if (d.cases[cur].lookup === "fail") renderLookup();
  }

  $("route-human").addEventListener("click", routeToHuman);

  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text) e.textContent = text; return e; }

  function renderLookup() {
    var c = d.cases[cur], box = $("policy");
    box.innerHTML = "";
    if (lookupBusy) {
      box.appendChild(el("p", "lookup-msg", "Looking up the policy page\u2026 (try " + (lookupTries + 1) + " of 2)"));
      return;
    }
    if (lookupTries === 1) {
      box.appendChild(el("p", "lookup-msg fail", "Lookup failed (try 1 of 2)."));
      var r = el("button", null, "Retry lookup");
      r.type = "button"; r.id = "retry-lookup"; r.disabled = approved || routed;
      r.addEventListener("click", startLookup);
      box.appendChild(r);
      return;
    }
    if (lookupTries >= 2) {
      box.appendChild(el("p", "lookup-msg fail", "Lookup failed twice. No policy page found."));
      var g = gapLog.filter(function (x) { return x.caseId === c.enquiry.caseId; })[0];
      if (g) box.appendChild(el("p", "gap-note", "Gap " + g.id + " sent to the " + c.gapOwner + " backlog: " + c.gapTopic + "."));
      var b = el("button", null, "Route to human agent");
      b.type = "button"; b.id = "route-human-lookup"; b.disabled = approved || routed;
      b.addEventListener("click", routeToHuman);
      box.appendChild(b);
      if (gapLog.length) {
        box.appendChild(el("h3", "gap-log-h", "Policy gap log (made up)"));
        var ul = el("ul", "gap-log");
        gapLog.forEach(function (x) { ul.appendChild(el("li", null, x.id + " \u00b7 " + x.caseId + " \u00b7 " + x.topic + " \u00b7 " + x.owner)); });
        box.appendChild(ul);
      }
    }
  }

  function reportGap() {
    var c = d.cases[cur];
    if (gapLog.some(function (x) { return x.caseId === c.enquiry.caseId; })) return;
    gapLog.push({ id: "GAP-" + String(gapLog.length + 1).padStart(3, "0"), caseId: c.enquiry.caseId, topic: c.gapTopic, owner: c.gapOwner });
  }

  function startLookup() {
    var token = ++lookupToken;
    lookupBusy = true;
    renderLookup(); updateButtons();
    setTimeout(function () {
      if (token !== lookupToken) return;
      lookupBusy = false;
      lookupTries += 1;
      if (lookupTries >= 2) reportGap();
      // Do not re-render the draft here, so edits made during the retry are kept.
      renderLookup(); updateButtons();
      if (editing) setStatus("Lookup finished. Your edits are kept.");
    }, LOOKUP_MS);
  }

  function load(i) {
    cur = i; lines = copyLines(d.cases[cur]); editing = false; approved = false; edits = 0; inserted = 0; routed = false;
    lookupTries = 0; lookupBusy = false; lookupToken += 1;
    timerStart = Date.now(); timerStoppedAt = null; renderTimer();
    setStatus(""); $("snip-search").value = "";
    renderTabs(); renderEnquiry(); renderDraft(); renderPolicy(null); updateButtons(); renderSnippets();
    if (d.cases[cur].lookup === "fail") startLookup();
    if (d.cases[cur].sensitive) {
      routed = true; stopTimer(); updateButtons();
      setStatus("Sensitive case. Routed to a human agent on open. No AI draft.");
    }
  }

  $("edit").addEventListener("click", function () {
    if (editing) { syncEdits(); editing = false; setStatus(edits ? "Edits saved (" + edits + ")." : ""); }
    else { editing = true; setStatus(lookupBusy ? "Editing. The lookup keeps running and your edits are kept." : "Editing. Change any line, then choose Done editing."); }
    renderDraft(); updateButtons();
  });

  $("restore").addEventListener("click", function () {
    lines = copyLines(d.cases[cur]); editing = false; approved = false; edits = 0; inserted = 0;
    setStatus("Original draft restored.");
    renderDraft(); updateButtons();
  });

  $("approve").addEventListener("click", function () {
    if (editing) { syncEdits(); editing = false; }
    approved = true; stopTimer();
    var missed = d.cases[cur].hiddenTest && lines.some(unsourced);
    setStatus("Approved and passed to the duty officer. Nothing sent. Edits: " + edits + ". Snippets: " + inserted + ". Time: " + fmt(elapsed()) + "." +
      (missed ? " Test result (made up): an unsourced line was approved. No policy passage states a charity discount." : ""));
    renderDraft(); updateButtons(); renderSnippets();
  });

  load(0);
})();
