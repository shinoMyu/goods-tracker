let isEditMode = false;
let editingRow = null;

const editModeBtn = document.getElementById("editModeBtn");
const actionHeader = document.querySelector("th.action-col");

function canEdit(row) {
  return isEditMode && editingRow === row;
}

function getParts(cell) {
  return {
    text: cell.querySelector(".text"),
    input: cell.querySelector(".edit-input"),
    textarea: cell.querySelector(".edit-note"),
    noteBtn: cell.querySelector(".note-toggle"),
    noteText: cell.querySelector(".note-text"),
    miniNoteInput: cell.querySelector(".edit-mini-note"),
  };
}

function resetRow(row) {
  delete row.dataset.noteOpen;
  delete row.dataset.noShippingChanged;
  delete row.dataset.origNoShipping;

  row.querySelectorAll(".edit-cell").forEach(cell => {
    const { text, input, textarea, noteBtn, noteText, miniNoteInput } = getParts(cell);

    if (cell.classList.contains("extra") || cell.classList.contains("shipping")) {
      text.classList.remove("hidden");
      const editBlock = cell.querySelector(".edit-block");
      if (editBlock) editBlock.classList.add("hidden");
      if (miniNoteInput) miniNoteInput.value = "";
    } else {
      if (text) text.classList.remove("hidden");
      if (input) input.classList.add("hidden");
    }

    if (textarea) {
      textarea.classList.add("hidden");
      textarea.value = "";
    }

    if (noteBtn && noteText) {
      const hasNote = noteText.textContent.trim() !== "";
      noteBtn.classList.toggle("hidden", hasNote);
    }

    if (cell.classList.contains("name-col") && miniNoteInput) {
      miniNoteInput.classList.add("hidden");
      miniNoteInput.value = "";
    }
  });
}

function render() {
  const rows = document.querySelectorAll("tbody tr");

  rows.forEach(row => {
    const editBtn = row.querySelector(".edit-btn");
    const saveBtn = row.querySelector(".save-btn");
    const cancelBtn = row.querySelector(".cancel-btn");

    if (!editBtn) return;

    let state = "hidden";

    if (isEditMode) {
      if (editingRow === null) {
        state = "view";
      } else if (editingRow === row) {
        state = "editing";
      } else {
        state = "locked";
      }
    }

    editBtn.style.display = state === "view" ? "inline-block" : "none";
    saveBtn.style.display = state === "editing" ? "inline-block" : "none";
    cancelBtn.style.display = state === "editing" ? "inline-block" : "none";

    row.classList.toggle("editing", state === "editing");

    // 其他列鎖住
    row.style.opacity = state === "locked" ? "0.5" : "1";
    row.style.pointerEvents = state === "locked" ? "none" : "auto";

    const nameCol = row.querySelector(".name-col");
    const { noteBtn } = getParts(nameCol);
    const hasNote = (nameCol.dataset.note || "").trim() !== "";

    const extraCol = row.querySelector(".extra");
    const shippingCol = row.querySelector(".shipping");
    const statusCol = row.querySelector(".status");

    const shippingText = shippingCol.querySelector(".text");
    const hasShipping = (shippingText?.textContent || "").trim() !== "";
    const orderCount = parseInt(shippingCol.dataset.orderCount || "0");
    const isReceived = statusCol?.dataset.received === "true";
    const noShipping = shippingCol.dataset.noShipping === "true";
    const canEditShipping = isReceived && hasShipping && orderCount === 1 && !noShipping;
    const canSetNoShipping = isReceived && orderCount === 1 && !hasShipping && !noShipping;

    if (state === "editing") {
      nameCol.dataset.tip = "雙擊修改名稱";
      const extraText = extraCol.querySelector(".text");
      const hasExtra = (extraText?.textContent || "").trim() !== "";
      extraCol.dataset.tip = hasExtra ? "雙擊修改額外費用" : "雙擊新增額外費用";
      statusCol.removeAttribute("data-tip");
      if (canEditShipping) {
        shippingCol.dataset.tip = "雙擊修改郵費";
      } else if (canSetNoShipping || noShipping) {
        shippingCol.dataset.tip = "右鍵切換無郵費";
      } else {
        shippingCol.removeAttribute("data-tip");
      }
    } else if (state === "view") {
      nameCol.removeAttribute("data-tip");
      extraCol.removeAttribute("data-tip");
      shippingCol.removeAttribute("data-tip");
      statusCol.removeAttribute("data-tip");
    } else if (state === "locked") {
      nameCol.removeAttribute("data-tip");
      extraCol.removeAttribute("data-tip");
      shippingCol.removeAttribute("data-tip");
      statusCol.removeAttribute("data-tip");
    }

    if (state === "editing") {
      if (hasNote) {
        noteBtn.classList.add("hidden");
      } else {
        noteBtn.classList.remove("hidden");
      }
    } else {
      noteBtn.classList.add("hidden");
    }
  });
}

function buildPayload(cell) {
  const { text, input, textarea, noteText, miniNoteInput } = getParts(cell);
  const payload = { changed: false, body: {} };

  const isExtraOrShipping = cell.classList.contains("extra") || cell.classList.contains("shipping");
  const blockHidden = isExtraOrShipping
    ? cell.querySelector(".edit-block")?.classList.contains("hidden")
    : input?.classList.contains("hidden");

  if (input && !blockHidden) {
    const newValue = input.value.trim();
    const oldValue = (text.textContent || "").trim();

    if (newValue !== oldValue) {
      payload.body[cell.dataset.field] = newValue;
      payload.changed = true;
    }
  }

  if (cell.classList.contains("name-col") && textarea && !textarea.classList.contains("hidden")) {
    const newNote = textarea.value;
    const oldNote = cell.dataset.note || "";
    if (newNote !== oldNote) {
      payload.body.note = newNote;
      payload.changed = true;
    }
  }

  if (isExtraOrShipping && miniNoteInput && !blockHidden) {
    const newNote = miniNoteInput.value;
    const oldNote = (noteText?.textContent || "").trim();
    if (newNote !== oldNote) {
      payload.body[cell.dataset.field + "Note"] = newNote;
      payload.changed = true;
    }
  }

  return payload;
}

// 依 cell class 決定 endpoint 與 method
function resolveEndpoint(cell, row) {
  if (cell.classList.contains("name-col")) {
    return { url: `/purchases/${row.dataset.id}`, method: "PUT" };
  }
  if (cell.classList.contains("shipping")) {
    const orderId = cell.dataset.order;
    if (!orderId) return null;
    return { url: `/orders/${orderId}/shipping`, method: "PUT" };
  }
  if (cell.classList.contains("extra")) {
    return { url: `/purchases/${row.dataset.id}/extra`, method: "PUT" };
  }
  return null;
}

function applyCellUpdate(cell, body) {
  const { text, textarea, noteText, miniNoteInput } = getParts(cell);

  if (body[cell.dataset.field] !== undefined) {
    text.textContent = body[cell.dataset.field];
  }

  if (cell.classList.contains("name-col")) {
    if (body.note !== undefined) {
      cell.dataset.note = body.note;
      cell.classList.toggle("has-note", body.note.trim() !== "");
      bindNotePopover(cell);
    }
  }

  if (cell.classList.contains("extra") || cell.classList.contains("shipping")) {
    if (body[cell.dataset.field + "Note"] !== undefined && noteText) {
      noteText.textContent = body[cell.dataset.field + "Note"];
      cell.classList.toggle("has-note", body[cell.dataset.field + "Note"].trim() !== "");
    }
  }

  if (cell.classList.contains("extra") && body.extra !== undefined) {
    cell.closest("tr").dataset.extra = body.extra;
  }

  if (cell.classList.contains("shipping") && body.shipping !== undefined) {
    const row = cell.closest("tr");
    row.dataset.shipping = body.shipping;
    const status = row.querySelector(".status");
    status.dataset.shipping = body.shipping;
    updateRowUI(row);
  }
}

function shouldWarnShippingChange(cell, body) {
  if (!cell.classList.contains("shipping")) return false;
  if (body.shipping === undefined) return false;

  const text = cell.querySelector(".text");
  const oldValue = (text?.textContent || "").trim();
  return oldValue !== "";
}

async function saveCell(cell, row) {
  const { changed, body } = buildPayload(cell);
  if (!changed) return false;

  const endpoint = resolveEndpoint(cell, row);
  if (!endpoint) return false;

  if (shouldWarnShippingChange(cell, body)) {
    const ok = confirm("修改郵費會影響總額，確定要改嗎？");
    if (!ok) {
      const input = cell.querySelector(".edit-input");
      input.value = cell.querySelector(".text").textContent.trim();
      delete body.shipping;
      if (Object.keys(body).length === 0) return false;
    }
  }

  await api(endpoint.url, body, endpoint.method);

  applyCellUpdate(cell, body);

  if (cell.classList.contains("extra") && body.extraNote) {
    const list = document.getElementById("extraNotesList");
    if (list && !Array.from(list.options).some(o => o.value === body.extraNote)) {
      const opt = document.createElement("option");
      opt.value = body.extraNote;
      list.appendChild(opt);
    }
  }

  return true;
}

function bindRowEvents() {
  const rows = document.querySelectorAll("tbody tr");

  rows.forEach(row => {
    const editBtn = row.querySelector(".edit-btn");
    const saveBtn = row.querySelector(".save-btn");
    const cancelBtn = row.querySelector(".cancel-btn");

    if (!editBtn) return;

    editBtn.onclick = () => {
      editingRow = row;
      render();
    };

    cancelBtn.onclick = () => {
      if (row.dataset.noShippingChanged === "true") {
        const shipping = row.querySelector(".shipping");
        const orig = row.dataset.origNoShipping || "false";
        shipping.dataset.noShipping = orig;
        delete row.dataset.noShippingChanged;
        delete row.dataset.origNoShipping;
      }

      editingRow = null;
      resetRow(row);
      render();
      updateRowUI(row);
    };

    saveBtn.onclick = async () => {
      let anyChange = false;
      for (const cell of row.querySelectorAll(".edit-cell")) {
        const changed = await saveCell(cell, row);
        if (changed) anyChange = true;
      }

      if (row.dataset.noShippingChanged === "true") {
        const shipping = row.querySelector(".shipping");
        const orderId = shipping.dataset.order;
        if (orderId) {
          await api(`/orders/${orderId}/no-shipping`, { value: shipping.dataset.noShipping === "true" }, "PUT");
        }
        delete row.dataset.noShippingChanged;
        delete row.dataset.origNoShipping;
        anyChange = true;
      }

      editingRow = null;
      resetRow(row);
      render();
      updateRowUI(row);
      if (typeof renderTotal === "function") renderTotal();
    };
  });
}

document.addEventListener("DOMContentLoaded", () => {
  bindRowEvents();
  render();
});

editModeBtn.addEventListener("click", () => {
  const wasEditing = editingRow;

  isEditMode = !isEditMode;
  editingRow = null;

  editModeBtn.textContent = isEditMode ? "結束編輯" : "編輯模式";
  mergeModeBtn.disabled = isEditMode;
  actionHeader.classList.toggle("edit-mode");
  actionHeader.textContent = isEditMode ? "編輯" : "";
  document.querySelector(".dropdown").classList.remove("open");

  if (!isEditMode && wasEditing) {
    resetRow(wasEditing);
  }

  render();

  if (!isEditMode) {
    document.querySelectorAll("tbody tr").forEach(updateRowUI);
  }

  const spacer = document.querySelector(".total-spacer");
  if (spacer) spacer.colSpan = isEditMode ? 8 : 7;
});

document.addEventListener("click", (e) => {
  const toggle = e.target.closest(".note-toggle");
  if (!toggle) return;

  const cell = toggle.closest(".name-col");
  const textarea = cell.querySelector(".edit-note");
  const row = cell.closest("tr");

  textarea.classList.remove("hidden");
  toggle.classList.add("hidden");

  row.dataset.noteOpen = "true";
});

function enterEdit(cell) {
  const text = cell.querySelector(".text");
  const input = cell.querySelector(".edit-input");

  if (!text || !input) return;

  if (cell.classList.contains("shipping")) {
    const row = cell.closest("tr");
    const statusCol = row.querySelector(".status");
    const isReceived = statusCol?.dataset.received === "true";
    const orderCount = parseInt(cell.dataset.orderCount || "0");
    const hasShipping = text.textContent.trim() !== "";
    const noShipping = cell.dataset.noShipping === "true";
    if (!isReceived || orderCount !== 1 || !hasShipping || noShipping) {
      return;
    }
  }

  text.classList.add("hidden");

  if (cell.classList.contains("extra") || cell.classList.contains("shipping")) {
    const editBlock = cell.querySelector(".edit-block");
    if (editBlock) editBlock.classList.remove("hidden");
  } else {
    input.classList.remove("hidden");
  }

  input.value = text.textContent.trim();
  input.focus();

  if (cell.classList.contains("name-col")) {
    handleNote(cell);
  }

  if (cell.classList.contains("extra") || cell.classList.contains("shipping")) {
    handleMiniNote(cell);
  }
}

function handleNote(cell) {
  const { textarea, noteBtn } = getParts(cell);
  const row = cell.closest("tr");

  if (!textarea || !noteBtn) return;

  const note = cell.dataset.note || "";
  const hasNote = note.trim() !== "";
  const isOpen = row.dataset.noteOpen === "true";

  const showNote = hasNote || isOpen;
  textarea.classList.toggle("hidden", !showNote);
  if (showNote) {
    textarea.value = note;
  }
  noteBtn.classList.toggle("hidden", showNote);
}

function handleMiniNote(cell) {
  const { noteText, miniNoteInput } = getParts(cell);

  if (!noteText || !miniNoteInput) return;

  noteText.classList.add("hidden");
  miniNoteInput.value = noteText.textContent.trim();
}

document.addEventListener("dblclick", (e) => {
  const cell = e.target.closest(".edit-cell");
  if (!cell) return;

  const row = cell.closest("tr");
  if (!canEdit(row)) return;

  enterEdit(cell);
});

// 右鍵 shipping → 設為無郵費 / 取消無郵費
// 條件：editMode + 正在 editing 這行 + 單獨出貨 + 已到貨
document.addEventListener("contextmenu", (e) => {
  const cell = e.target.closest(".shipping");
  if (!cell) return;
  if (!isEditMode) return;

  const row = cell.closest("tr");
  if (editingRow !== row) return;

  const statusCol = row.querySelector(".status");
  const isReceived = statusCol?.dataset.received === "true";
  const orderCount = parseInt(cell.dataset.orderCount || "0");

  if (!(isReceived && orderCount === 1)) return;

  e.preventDefault();

  showNoShippingMenu(cell, row);
});

function showNoShippingMenu(cell, row) {
  closePopover();

  const current = cell.dataset.noShipping === "true";
  const label = current ? "取消無郵費" : "設為無郵費";
  const newValue = !current;

  if (row.dataset.origNoShipping === undefined) {
    row.dataset.origNoShipping = cell.dataset.noShipping || "false";
  }

  const html = `
    <div class="no-shipping-label">${label}？</div>
    <div class="shipping-popover-actions">
      <button type="button" class="confirm">確認</button>
      <button type="button" class="cancel">取消</button>
    </div>
  `;

  const box = createPopover(cell, html, "shipping-popover");
  box.classList.add("no-shipping-popover");

  box.querySelector(".confirm").onclick = (e) => {
    e.stopPropagation();

    cell.dataset.noShipping = String(newValue);
    row.dataset.noShippingChanged = "true";

    render();
    updateRowUI(row);

    box.remove();
  };

  box.querySelector(".cancel").onclick = (e) => {
    e.stopPropagation();
    box.remove();
  };
}