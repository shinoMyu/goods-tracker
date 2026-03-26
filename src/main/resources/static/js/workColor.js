function applyWorkColor(cell) {
  const color = cell.dataset.color;
  const received = cell.dataset.received === "true";

  if (color && received) {
    cell.style.background = color;
  }
}

// 初始化
document.querySelectorAll(".work-color").forEach(cell => {
  applyWorkColor(cell);

  cell.addEventListener("click", () => {
    if (cell.dataset.color) return;

    openColorPicker((color) => {
      cell.dataset.pendingColor = color;
      cell.style.background = color;
  });
  });
});

// 確認
document.querySelectorAll(".work-color").forEach(cell => {
  cell.addEventListener("mouseenter", () => {
    if (!cell.dataset.pendingColor || cell.dataset.color) return;

    attachConfirmPopover(cell, {
      className: "color-popover--work",
      onConfirm: async () => {

        const workId = cell.dataset.workId;
        const color = cell.dataset.pendingColor;

        await fetch(`/work/${workId}/color`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ color })
        });

        cell.dataset.color = color;
        delete cell.dataset.pendingColor;

        updateRowUI(cell.closest("tr"));
      }
    });
  });
});