function applyWorkColor(cell) {
  const color = cell.dataset.color;
  const received = cell.dataset.received === "true";

  if (color && received) {
    cell.style.background = color;
  } else if (color && !received) {
    cell.style.background = "";
  }
}

function applyWorkColorToAll(workId, color) {
  document
    .querySelectorAll(`.work-color[data-work-id='${workId}']`)
    .forEach(cell => {
      cell.dataset.color = color;
      applyWorkColor(cell);
    });
}

document.querySelectorAll(".work-color").forEach(cell => {
  applyWorkColor(cell);

  cell.addEventListener("click", () => {
    if (cell.dataset.color) return;

    showColorPicker(cell, (color) => {
      cell.dataset.pendingColor = color;
      cell.style.background = color;
    });
  });
});

document.querySelectorAll(".work-color").forEach(cell => {
  cell.addEventListener("mouseenter", () => {
    if (!cell.dataset.pendingColor || cell.dataset.color) return;

    showConfirm(cell, async () => {

      const workId = cell.dataset.workId;
      const color = cell.dataset.pendingColor;

      await api(`/work/${workId}/color`, {color});

      delete cell.dataset.pendingColor;
      applyWorkColorToAll(workId, color);

      document.querySelectorAll(`.work-color[data-work-id='${workId}']`)
        .forEach(c => updateRowUI(c.closest("tr")));

    });
  });
});
