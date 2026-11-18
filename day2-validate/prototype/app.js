(function () {
  var d = window.PROTOTYPE_DATA;
  var $ = function (id) { return document.getElementById(id); };

  $("synthetic-label").textContent = d.label + ". No real residents, policies or cases.";
  $("case-id").textContent = d.enquiry.caseId;
  $("channel").textContent = d.enquiry.channel;
  $("received").textContent = d.enquiry.received;
  $("subject").textContent = d.enquiry.subject;
  $("body").textContent = d.enquiry.body;

  var lines = d.draft.map(function (l) { return { id: l.id, text: l.text, cite: l.cite }; });
  var editing = false, approved = false, edits = 0;

  function renderPolicy(activeId) {
    var p = d.policyPages[0];
    var html = '<h3 class="policy-title"></h3><p class="policy-meta"></p>';
    $("policy").innerHTML = html;
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
      p.className = "line";
      var span = document.createElement("span");
      span.textContent = l.text;
      span.dataset.index = i;
      if (editing) { span.contentEditable = "true"; span.className = "line"; span.style.outline = "2px solid #1f5fbf"; }
      p.appendChild(span);
      if (l.cite) {
        var b = document.createElement("button");
        b.className = "cite";
        b.type = "button";
        b.textContent = l.cite;
        b.setAttribute("aria-label", "Show policy passage " + l.cite);
        b.addEventListener("click", function () { renderPolicy(l.cite); $(l.cite).scrollIntoView({ block: "nearest" }); });
        p.appendChild(b);
      }
      box.appendChild(p);
    });
  }

  function setStatus(msg) { $("status").textContent = msg; }

  function syncEdits() {
    document.querySelectorAll("#draft span[data-index]").forEach(function (s) {
      var i = Number(s.dataset.index);
      if (lines[i].text !== s.textContent) { lines[i].text = s.textContent; edits += 1; }
    });
  }

  function updateButtons() {
    $("approve").disabled = approved;
    $("edit").textContent = editing ? "Done editing" : "Edit";
    $("edit").disabled = approved;
    var changed = lines.some(function (l, i) { return l.text !== d.draft[i].text; });
    $("restore").disabled = !changed;
  }

  $("edit").addEventListener("click", function () {
    if (editing) { syncEdits(); editing = false; setStatus(edits ? "Edits saved to the draft. " + edits + " logged." : ""); }
    else { editing = true; setStatus("Editing. Change any line, then choose Done editing."); }
    renderDraft(); updateButtons();
  });

  $("restore").addEventListener("click", function () {
    lines = d.draft.map(function (l) { return { id: l.id, text: l.text, cite: l.cite }; });
    editing = false; approved = false; edits = 0;
    setStatus("Original draft restored.");
    renderDraft(); updateButtons();
  });

  $("approve").addEventListener("click", function () {
    if (editing) { syncEdits(); editing = false; }
    approved = true;
    setStatus("Approved. Passed to the duty officer to send. Nothing has been sent. Edits logged: " + edits + ".");
    renderDraft(); updateButtons();
  });

  renderDraft(); renderPolicy(null); updateButtons();
})();
