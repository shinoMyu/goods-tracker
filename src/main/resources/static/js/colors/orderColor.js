function applyOrderColor(cell, color) {
  const mark = cell.querySelector(".shippingMark");
  if (!mark) return;

  mark.style.color = color || "";
}

function applyOrderColorToAll(orderId, color) {
  document
    .querySelectorAll(`.status[data-order='${orderId}']`)
    .forEach(cell => {
      applyOrderColor(cell, color);
    });
}

document.querySelectorAll(".status").forEach(cell => {
  const initColor = cell.dataset.color;
  const initOrderId = cell.dataset.order;
  if (initColor && initOrderId) {
    applyOrderColorToAll(initOrderId, initColor);
  }

  cell.addEventListener("click", () => {
    if (cell.dataset.color) return;
    if (!cell.classList.contains("merge-pending")) return;

    const orderId = cell.dataset.order;
    if (!orderId) return;

    showColorPicker(cell, (color) => {
      applyOrderColorToAll(orderId, color);

      document.querySelectorAll(`.status[data-order='${orderId}']`)
        .forEach(c => {
          c.dataset.pendingColor = color;
        });
    });
  });

  cell.addEventListener("mouseenter", () => {
    if (cell.classList.contains("no-hover")) return;
    if (!cell.dataset.pendingColor || cell.dataset.color) return;

    const orderId = cell.dataset.order;
    if (!orderId) return;

    showConfirm(cell, async () => {
      const color = cell.dataset.pendingColor;

      await api(`/orders/${orderId}/color`, {color});

      applyOrderColorToAll(orderId, color);

      document.querySelectorAll(`.status[data-order='${orderId}']`)
        .forEach(c => {
          c.dataset.color = color;
          delete c.dataset.pendingColor;
          updateRowUI(c.closest("tr"));
        });
    }, "right");
  });
});
