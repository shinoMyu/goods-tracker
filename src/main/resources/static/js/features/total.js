// 總計：商品金額（逐筆）+ 額外費用（逐筆）+ 郵費（每個訂單只算一次）
// noShipping 的訂單不計郵費（

function calculateTotals() {
  let itemTotal = 0;
  let extraTotal = 0;

  document.querySelectorAll("tbody tr[data-id]").forEach(row => {
    itemTotal += Number(row.dataset.price || 0);
    extraTotal += Number(row.dataset.extra || 0);
  });

  const shippingByOrder = new Map();
  document.querySelectorAll("tbody tr[data-id] .shipping[data-order]").forEach(cell => {
    const orderId = cell.dataset.order;
    if (shippingByOrder.has(orderId)) return;

    const row = cell.closest("tr");
    const fee = cell.dataset.noShipping === "true" ? 0 : Number(row.dataset.shipping || 0);
    shippingByOrder.set(orderId, fee);
  });

  let shippingTotal = 0;
  shippingByOrder.forEach(fee => { shippingTotal += fee; });

  return {
    itemTotal,
    extraTotal,
    shippingTotal,
    total: itemTotal + extraTotal + shippingTotal
  };
}

function formatAmount(n) {
  return String(Math.round((n + Number.EPSILON) * 100) / 100);
}

function renderTotal() {
  const cell = document.getElementById("total-amount");
  if (!cell) return;

  const { total } = calculateTotals();
  cell.textContent = `總計：${formatAmount(total)}`;
}

const totalCell = document.getElementById("total-amount");
if (totalCell) {
  totalCell.setAttribute("data-popover-trigger", "");
  totalCell.style.cursor = "pointer";

  totalCell.addEventListener("click", () => {
    const { itemTotal, extraTotal, shippingTotal } = calculateTotals();

    const html =
      `<div>商品：${formatAmount(itemTotal)}</div>` +
      `<div>額外：${formatAmount(extraTotal)}</div>` +
      `<div>郵費：${formatAmount(shippingTotal)}</div>`;

    createPopover(totalCell, html, "total-popover");
  });
}

document.addEventListener("DOMContentLoaded", renderTotal);
