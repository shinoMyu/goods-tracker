function bindNotePopover(cell) {
    const note = (cell.dataset.note || "").trim();
    
    if (!note) return;

    cell.setAttribute("data-popover-trigger", "");

    cell.onclick = () => {
        const row = cell.closest("tr");
        if (row.classList.contains("editing")) return;

        createPopover(cell, `<div>${note}</div>`, "note-popover");
    };
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".name-col").forEach(cell => {
    bindNotePopover(cell);
  });

  enablePopoverAutoClose();
});