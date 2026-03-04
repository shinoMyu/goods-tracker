document.addEventListener("DOMContentLoaded", () => {
  const marks = document.querySelectorAll(".ship-mark[data-order]");
  const orderMap = {};

  marks.forEach(m => {
    const orderId = m.dataset.order;
    if (!orderId) return;

    if (!orderMap[orderId]) {
      orderMap[orderId] = [];
    }
    orderMap[orderId].push(m);
  });

  const colors = ["#e57373", "#64b5f6", "#81c784", "#ba68c8", "#ffb74d"];
  let colorIndex = 0;

  for (const orderId in orderMap) {
    if (orderMap[orderId].length > 1) {
      const color = colors[colorIndex % colors.length];
      orderMap[orderId].forEach(m => {
        m.style.color = color;
      });
      colorIndex++;
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const marks = document.querySelectorAll(".ship-mark");

  marks.forEach(mark => {
    if (mark.textContent.trim() === "✓") {
      mark.style.color = "#2a9d8f";
    }
  });
});