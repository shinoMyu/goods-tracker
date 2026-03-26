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
  const color = cell.dataset.color;
  const orderId = cell.dataset.order;
  if (!orderId) return;

  if (color && orderId) {
    applyOrderColorToAll(orderId, color);
  }

  cell.addEventListener("click", () => {
    if (cell.dataset.color) return;
    if (!cell.classList.contains("merge-pending")) return;

    openColorPicker((color) => {
      applyOrderColorToAll(orderId, color);

      document
        .querySelectorAll(`.status[data-order='${orderId}']`)
        .forEach(c => {
          c.dataset.pendingColor = color;
        });
    });
  });


  cell.addEventListener("mouseenter", () => {
    if (!cell.dataset.pendingColor || cell.dataset.color) return;

    attachConfirmPopover(cell, {
      className: "color-popover--order",
      onConfirm: async () => {

        const orderId = cell.dataset.order;
        const color = cell.dataset.pendingColor;

        await fetch(`/orders/${orderId}/color`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ color })
        });

        document.querySelectorAll(`.status[data-order='${orderId}']`)
          .forEach(c => {
            c.dataset.color = color;
            delete c.dataset.pendingColor;

            updateRowUI(c.closest("tr"));
          });
      }
    });
  });
});