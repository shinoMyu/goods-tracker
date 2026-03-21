document.querySelectorAll(".shipping").forEach(cell => {
  let original = "";

  cell.addEventListener("dblclick", () => {
    if (!cell.classList.contains("editable")) return;

    original = cell.textContent.trim();

    cell.contentEditable = true;
    cell.focus();
  });

  cell.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      cell.blur();
    }
  });

  cell.addEventListener("blur", async () => {
    if (!cell.isContentEditable) return;
    cell.contentEditable = false;

    const orderId = cell.dataset.order;
    const value = cell.textContent.trim();

    if (value === original) return;

    const fee = parseFloat(value);
    if (isNaN(fee)) {
      alert("請輸入數字");
      cell.textContent = original;
      return;
    }

    await fetch(`/orders/${orderId}/shipping`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(fee)
    });

    const row = cell.closest("tr");
    const status = row.querySelector(".status");

    status.dataset.shipping = fee;
    updateRowUI(row);
  });
});