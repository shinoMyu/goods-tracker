let isEditMode = false;
let editingRow = null;

const editModeBtn = document.getElementById("editModeBtn");
const actionHeader = document.querySelector("th.action-col");

function canEdit(row) {
  return isEditMode && editingRow === row;
}

function getNameParts(row) {
  const nameCol = row.querySelector(".name-col");

  return {
    nameCol,
    text: nameCol.querySelector(".text"),
    input: nameCol.querySelector(".edit-input"),
    textarea: nameCol.querySelector(".edit-note"),
    noteBtn: nameCol.querySelector(".note-toggle"),
    note: nameCol.dataset.note || "",
    hasNote: (nameCol.dataset.note || "").trim() !== ""
  };
}

function resetRow(row) {
  delete row.dataset.noteOpen;

  const { text, input, textarea, noteBtn, hasNote } = getNameParts(row);

  // 名稱還原
  text.classList.remove("hidden");
  input.classList.add("hidden");

  // note 還原
  textarea.classList.add("hidden");
  textarea.value = "";

  noteBtn.classList.toggle("hidden", hasNote);
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

    const { nameCol, noteBtn, hasNote } = getNameParts(row);

    if (isEditMode) {
      nameCol.dataset.tip = "雙擊修改名稱";
    } else {
      nameCol.removeAttribute("data-tip");
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

function buildUpdatePayload(row) {
  const body = {};

  const inputEl = row.querySelector(".edit-input");
  const textEl = row.querySelector(".text");

  const textarea = row.querySelector(".edit-note");

  // 名稱
  if (!inputEl.classList.contains("hidden")) {
    const newName = inputEl.value.trim();
    const oldName = textEl.textContent.trim();

    if (newName !== oldName) {
      body.itemName = newName;
    }
  }

  // note
  if (!textarea.classList.contains("hidden")) {
    const newNote = textarea.value;
    const cell = row.querySelector(".name-col");
    const oldNote = cell.dataset.note || "";

    if (newNote !== oldNote) {
      body.note = newNote;
    }
  }

  return body;
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
      editingRow = null;
      resetRow(row);
      render();
    };

    saveBtn.onclick = async () => {
      const id = row.dataset.id;
      const body = buildUpdatePayload(row);

      if (Object.keys(body).length === 0) {
        editingRow = null;
        resetRow(row);
        render();
        return;
      }

      await fetch(`/purchases/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });

      // 更新畫面
      if (body.itemName !== undefined) {
        row.querySelector(".text").textContent = body.itemName;
      }

      if (body.note !== undefined) {
        const { nameCol } = getNameParts(row);

        nameCol.dataset.note = body.note;
        nameCol.classList.toggle("has-note", body.note.trim() !== "");

        bindNotePopover(row.querySelector(".name-col"));
      }

      editingRow = null;
      resetRow(row);
      render();
    };
  });
}

document.addEventListener("DOMContentLoaded", () => {
  bindRowEvents();
  render();
});

editModeBtn.addEventListener("click", () => {
  isEditMode = !isEditMode;
  editingRow = null;

  editModeBtn.textContent = isEditMode ? "結束編輯" : "編輯模式";
  actionHeader.classList.toggle("edit-mode");
  actionHeader.textContent = isEditMode ? "編輯" : "";
  document.querySelector(".dropdown").classList.remove("open");

  render();
});

function enterNameEdit(cell) {
  const row = cell.closest("tr");

  const { text, input, textarea, noteBtn, note, hasNote } = getNameParts(row);

  text.classList.add("hidden");
  input.classList.remove("hidden");

  input.value = text.textContent.trim();
  input.focus();

  const isOpen = row.dataset.noteOpen === "true";
  const showNote = hasNote || isOpen;
  textarea.classList.toggle("hidden", !showNote);
  if (showNote) {
    textarea.value = note;
  }
  noteBtn.classList.toggle("hidden", showNote);
}

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

document.addEventListener("dblclick", (e) => {
  const cell = e.target.closest("td");
  if (!cell) return;

  const row = cell.closest("tr");
  if (!canEdit(row)) return;

  if (cell.classList.contains("name-col")) {
    enterNameEdit(cell);
  }

  if (cell.classList.contains("extra")) {
    enterExtraEdit(cell);
  }

  if (cell.classList.contains("shipping")) {
    enterShippingEdit(cell);
  }
});