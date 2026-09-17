document.querySelectorAll(".shipping").forEach(cell => {
  cell.addEventListener("dblclick", () => {
    if (!cell.classList.contains("editable")) return;

    if (typeof isEditMode !== "undefined" && isEditMode) return;

    const orderId = cell.dataset.order;
    if (!orderId) return;

    const html = `
      <input type="number" class="shipping-fee-input" placeholder="郵費" step="0.01" min="0" />
      <input type="text" class="shipping-note-input" placeholder="說明（可選）" />
      <div class="shipping-popover-actions">
        <button type="button" class="confirm">確認</button>
        <button type="button" class="cancel">取消</button>
      </div>
    `;
    const popover = createPopover(cell, html, "shipping-popover");

    const feeInput = popover.querySelector(".shipping-fee-input");
    const noteInput = popover.querySelector(".shipping-note-input");
    feeInput.focus();

    popover.querySelector(".cancel").onclick = () => popover.remove();

    popover.querySelector(".confirm").onclick = async () => {
      const fee = feeInput.value.trim();
      if (!fee) {
        alert("請輸入郵費");
        return;
      }
      const note = noteInput.value.trim();

      await fetch(`/orders/${orderId}/shipping`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shipping: fee, shippingNote: note })
      });

      cell.querySelector(".text").textContent = fee;
      const noteText = cell.querySelector(".note-text");
      if (noteText) noteText.textContent = note;

      popover.remove();

      const row = cell.closest("tr");
      const status = row.querySelector(".status");
      status.dataset.shipping = fee;
      updateRowUI(row);
    };
  });
});
