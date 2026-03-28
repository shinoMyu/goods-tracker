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

function setEditable(shipping, enabled) {
  if (enabled) {
    shipping.classList.add("editable");
  } else {
    shipping.classList.remove("editable");
  }
}

function updateRowUI(row) {
  const status = row.querySelector(".status");
  const shipping = row.querySelector(".shipping");

  const received = status.dataset.received === "true";
  const hasShipping = shipping.textContent.trim() !== "";

  const orderCount = parseInt(shipping.dataset.orderCount || "0");
  const hasColor = status.dataset.color;
  
  const orderId = status.dataset.order;
  let isLast = false;

  if (orderId) {
    const all = Array.from(
      document.querySelectorAll(`.status[data-order='${orderId}']`)
    );

    const last = all[all.length - 1];
    isLast = last === status;

    all.forEach(cell => {
      const row = cell.closest("tr");
      const shippingCell = row.querySelector(".shipping");
  
      if (cell !== last) {
        shippingCell.textContent = "";
      }
    });
  }

  // tooltip
  if (!received) {
    status.dataset.tip = "雙擊設為已到貨";
  } else if (!hasShipping) {
    if (orderCount > 1) {
      if (isLast) {
        status.dataset.tip = "可編輯郵費";
      } else {
        status.removeAttribute("data-tip");
      }
    } else {
      status.dataset.tip = "可編輯郵費";
    }
  } else {
    status.removeAttribute("data-tip");
  }  

  // editable
  if (received && !hasShipping) {
    if (orderCount > 1) {
      // merge 
      setEditable(shipping, hasColor && isLast);
    } else {
      // 單獨出貨
      setEditable(shipping, true);
    }
  } else {
    setEditable(shipping, false);
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

  if (hasColor && orderCount > 1 && !isLast) {
    status.classList.add("no-hover");
  } else {
    status.classList.remove("no-hover");
  }

  if (status.dataset.color) {
    shipping.style.color = status.dataset.color;
  }
}