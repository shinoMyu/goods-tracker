function applyWorkColor(cell) {
  const color = cell.dataset.color;
  const received = cell.dataset.received === "true";

  if (color && received) {
    cell.style.background = color;
  }
}

document.querySelectorAll(".work-color").forEach(cell => {
  applyWorkColor(cell);

  cell.addEventListener("click", () => {
    // 已經有顏色 => 不允許修改
    if (cell.dataset.color) return;

    const input = document.createElement("input");
    input.type = "color";

    input.addEventListener("input", () => {
      const newColor = input.value;
      // 預覽顏色
      cell.style.background = newColor;
      // 暫存顏色
      cell.dataset.pendingColor = newColor;
    });
    input.click();
  });
});

document.querySelectorAll(".work-color").forEach(cell => {
  cell.addEventListener("mouseenter", () => {
    if (!cell.dataset.pendingColor || cell.dataset.color) return;

    const existing = cell.querySelector(".color-popover");
    if (existing) return;

    const box = document.createElement("div");
    box.className = "color-popover";
    box.innerHTML = `<button class="color-confirm">確認</button>`;

    cell.appendChild(box);

    box.querySelector("button").addEventListener("click", async (e) => {
      e.stopPropagation();

      const workId = cell.dataset.workId;
      const color = cell.dataset.pendingColor;
      // 存入資料庫
      await fetch(`/work/${workId}/color`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ color })
      });

      cell.dataset.color = color;
      delete cell.dataset.pendingColor;

      box.remove();
    });
  });
});
