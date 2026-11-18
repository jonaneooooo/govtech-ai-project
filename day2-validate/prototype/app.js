(function () {
  var d = window.PROTOTYPE_DATA;
  var $ = function (id) { return document.getElementById(id); };
  var cur = 0, lines, editing, approved, edits, inserted, routed;
  var lookupTries = 0, lookupBusy = false, lookupToken = 0, gapLog = [];
  var LOOKUP_MS = 900;

  $("synthetic-label").textContent = d.label + ". No real residents, policies or cases.";

  function copyLines(c) { return c.draft.map(function (l) { return { id: l.id, text: l.text, cite: l.cite, conf: l.conf, why: l.why, test: l.test }; }); }
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
    $("screen-tag").textContent = "Prototype · screen " + (cur + 1) + " of 5";
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

  function renderDraft() {
    var box = $("draft");
    box.innerHTML = "";
    lines.forEach(function (l, i) {
      var p = document.createElement("p");
      p.className = "line line-wrap" + (l.conf === "low" ? " low" : "");
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
      } else if (l.conf === "low") {
        var n = document.createElement("span");
        n.className = "nosrc";
        n.textContent = "No source";
        p.appendChild(n);
        var w = document.createElement("span");
        w.className = "low-note";
        w.textContent = "Low confidence. " + l.why;
        p.appendChild(w);
      }
      box.appendChild(p);
    });
  }

  function updateButtons() {
    var orig = d.cases[cur].draft;
    var blocked = lines.some(function (l, i) { return l.conf === "low" && l.text.trim() !== "" && orig[i] && l.text === orig[i].text; });
    var noPolicy = d.cases[cur].lookup === "fail";
    var done = approved || routed;
    $("approve").disabled = done || blocked || noPolicy;
    var note = "";
    if (!done && noPolicy) {
      note = lookupBusy ? "Looking up the policy page. Approve is blocked until a page is found."
        : lookupTries >= 2 ? "No policy page found. Approve is blocked. Ask a champion agent or route to a human agent."
        : "Policy lookup failed. Retry before approving.";
    } else if (!done && blocked) {
      note = "Approve is blocked: a line has no source. Edit or remove it first.";
    }
    $("block-note").textContent = note;
    $("edit").textContent = editing ? "Done editing" : "Edit";
    $("edit").disabled = done;
    $("restore").disabled = done || (lines.length === orig.length && !lines.some(function (l, i) { return l.text !== orig[i].text; }));
    $("snip-search").disabled = done;
    $("route-human").disabled = done;
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
    setStatus("Snippet " + sn.id + " inserted, cited to " + sn.cite + ". Snippets inserted: " + inserted + ".");
    renderDraft(); updateButtons();
  }

  $("snip-search").addEventListener("input", renderSnippets);

  $("route-human").addEventListener("click", function () {
    if (editing) { syncEdits(); editing = false; }
    routed = true;
    setStatus("Routed to a human agent. The tool does not draft a reply for this case.");
    renderDraft(); updateButtons(); renderSnippets();
  });

  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text) e.textContent = text; return e; }

  function renderLookup() {
    var c = d.cases[cur], box = $("policy");
    box.innerHTML = "";
    if (lookupBusy) {
      box.appendChild(el("p", "lookup-msg", "Looking up the policy page\u2026 (attempt " + (lookupTries + 1) + " of 2)"));
      return;
    }
    if (lookupTries === 1) {
      box.appendChild(el("p", "lookup-msg fail", "Lookup failed (attempt 1 of 2). No policy page found for this enquiry."));
      var r = el("button", null, "Retry lookup");
      r.type = "button"; r.id = "retry-lookup"; r.disabled = approved || routed;
      r.addEventListener("click", startLookup);
      box.appendChild(r);
      return;
    }
    if (lookupTries >= 2) {
      box.appendChild(el("p", "lookup-msg fail", "Lookup failed twice. No policy page is shown for this enquiry."));
      var g = gapLog.filter(function (x) { return x.caseId === c.enquiry.caseId; })[0];
      if (g) box.appendChild(el("p", "gap-note", "Policy gap reported to the " + c.gapOwner + " backlog: " + g.id + " \u00b7 " + c.gapTopic + ". (made up)"));
      var b = el("button", null, "Ask a champion agent");
      b.type = "button"; b.id = "ask-champion"; b.disabled = approved || routed;
      b.addEventListener("click", function () {
        if (editing) { syncEdits(); editing = false; }
        routed = true;
        setStatus("Asked a champion human agent for help (made up). The policy gap " + (g ? g.id : "") + " is on the policy team backlog.");
        renderDraft(); renderLookup(); updateButtons(); renderSnippets();
      });
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
      if (editing) setStatus("Lookup finished while you were editing. Your edits are kept.");
    }, LOOKUP_MS);
  }

  function load(i) {
    cur = i; lines = copyLines(d.cases[cur]); editing = false; approved = false; edits = 0; inserted = 0; routed = false;
    lookupTries = 0; lookupBusy = false; lookupToken += 1;
    setStatus(""); $("snip-search").value = "";
    renderTabs(); renderEnquiry(); renderDraft(); renderPolicy(null); updateButtons(); renderSnippets();
    if (d.cases[cur].lookup === "fail") startLookup();
  }

  $("edit").addEventListener("click", function () {
    if (editing) { syncEdits(); editing = false; setStatus(edits ? "Edits saved to the draft. " + edits + " logged." : ""); }
    else { editing = true; setStatus(lookupBusy ? "Editing while the lookup retries. Your edits are kept." : "Editing. Change any line, then choose Done editing."); }
    renderDraft(); updateButtons();
  });

  $("restore").addEventListener("click", function () {
    lines = copyLines(d.cases[cur]); editing = false; approved = false; edits = 0; inserted = 0;
    setStatus("Original draft restored.");
    renderDraft(); updateButtons();
  });

  $("approve").addEventListener("click", function () {
    if (editing) { syncEdits(); editing = false; }
    approved = true;
    var missed = lines.some(function (l, i) { return l.test === "unsourced" && l.text === d.cases[cur].draft[i].text; });
    setStatus("Approved. Passed to the duty officer to send. Nothing has been sent. Edits logged: " + edits + ". Snippets inserted: " + inserted + "." +
      (missed ? " Test result (made up test): a line with no source was still in the draft. No policy passage states a charity discount." : ""));
    renderDraft(); updateButtons(); renderSnippets();
  });

  load(0);
})();
