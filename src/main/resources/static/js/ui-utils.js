function openColorPicker(onChange) {
  const input = document.createElement("input");
  input.type = "color";

  input.addEventListener("input", () => {
    onChange(input.value);
  });

  input.click();
}

function attachConfirmPopover(element, options) {
  const { className, onConfirm } = options;
  const existing = element.querySelector(".color-popover");
  if (existing) return;

  const box = document.createElement("div");
  box.className = `color-popover ${className}`;
  box.innerHTML = `<button class="color-confirm">確認</button>`;

  element.appendChild(box);

  box.querySelector("button").addEventListener("click", (e) => {
    e.stopPropagation();

    onConfirm();  

    box.remove();
  });
}

function updateRowUI(row) {
  const status = row.querySelector(".status");
  const shipping = row.querySelector(".shipping");

  const received = status.dataset.received === "true";
  const hasShipping = shipping.textContent.trim() !== "";

  const orderCount = parseInt(shipping.dataset.orderCount || "0");
  const hasColor = status.dataset.color;

  // tooltip
  if (!received) {
    status.dataset.tip = "雙擊設為已到貨";
  } else if (!hasShipping) {
    status.dataset.tip = "可編輯郵費";
  } else {
    status.removeAttribute("data-tip");
  }

  // editable
  if (received && !hasShipping) {
    shipping.classList.add("editable");
  } else {
    shipping.classList.remove("editable");
  }

  if (orderCount > 1 && !hasShipping && !hasColor) {
    status.classList.add("merge-pending");
    status.dataset.tip = "點擊設定顏色";
    return;
  }
  status.classList.remove("merge-pending");

  if (hasShipping) {
    status.style.cursor = "default"; 
  } else {
    status.style.cursor = "pointer"; 
  }
}