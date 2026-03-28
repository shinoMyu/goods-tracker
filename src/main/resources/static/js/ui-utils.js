let currentPopover = null;

function closePopover() {
  if (currentPopover && currentPopover.parentNode) {
    currentPopover.remove();
  }
  currentPopover = null;
}

function openPopover(element, content, position = "body") {
  closePopover();

  const box = document.createElement("div");
  box.className = "color-popover";
  box.innerHTML = content;

  if (position === "body") {
    document.body.appendChild(box);
  } else {
    element.appendChild(box);
  }

  currentPopover = box;
  return box;
}

function showColorPicker(cell, onPreview) {
  const rect = cell.getBoundingClientRect();

  const box = openPopover(
    cell,
    `<input type="color" class="color-picker">`
  );

  box.style.position = "fixed";
  box.style.left = rect.right + "px";
  box.style.top = rect.bottom + "px";

  const picker = box.querySelector("input");

  picker.addEventListener("input", () => {
    onPreview(picker.value);
  });
}

function showConfirm(element, onConfirm) {
  const box = openPopover(
    element,
    `<button class="color-confirm">確認</button>`,
    "self"
  );

  box.querySelector("button").onclick = (e) => {
    e.stopPropagation();
    onConfirm();
    closePopover(); 
  };
}

document.addEventListener("click", (e) => {
  const isPopover = e.target.closest(".color-popover");
  const isWork = e.target.closest(".work-color");
  const isEditableStatus = e.target.closest(".status.merge-pending");

  if (!isPopover && !isWork && !isEditableStatus) {
    closePopover();
  }
});

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
  } else {
    status.classList.remove("merge-pending");
  }

  if (hasShipping) {
    status.style.cursor = "default";
  } else {
    status.style.cursor = "pointer";
  }
}