(function () {
  var d = window.PROTOTYPE_DATA;
  var $ = function (id) { return document.getElementById(id); };
  var cur = 0, lines, editing, approved, edits, inserted, routed;

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
    var done = approved || routed;
    $("approve").disabled = done || blocked;
    $("block-note").textContent = blocked && !done ? "Approve is blocked: a line has no source. Edit or remove it first." : "";
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

  function load(i) {
    cur = i; lines = copyLines(d.cases[cur]); editing = false; approved = false; edits = 0; inserted = 0; routed = false;
    setStatus(""); $("snip-search").value = "";
    renderTabs(); renderEnquiry(); renderDraft(); renderPolicy(null); updateButtons(); renderSnippets();
  }

  $("edit").addEventListener("click", function () {
    if (editing) { syncEdits(); editing = false; setStatus(edits ? "Edits saved to the draft. " + edits + " logged." : ""); }
    else { editing = true; setStatus("Editing. Change any line, then choose Done editing."); }
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
