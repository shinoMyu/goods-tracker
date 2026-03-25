function applyColor(element, color, enabled = true) {
  element.style.background = (color && enabled) ? color : "";
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

  // if (!hasShipping || !hasColor) {
  //   status.style.cursor = "default"; 
  // }
}

function applyOrderColorToGroup(orderId, color, confirmed = false) {
  document.querySelectorAll(`.status[data-order="${orderId}"]`)
    .forEach(cell => {
      applyColor(cell, color, true);

      if (confirmed) {
        cell.dataset.color = color;
      }
    });
}

function applyColorToElements(selector, color) {
  document.querySelectorAll(selector).forEach(el => {
    el.style.background = color;
    el.style.color = color;
  });
}


function openColorPicker(onChange, onConfirm) {
  const input = document.createElement("input");
  input.type = "color";

  input.addEventListener("input", () => {
    onChange(input.value);
  });

  input.addEventListener("change", () => {
    onConfirm(input.value);
  });

  input.click();
}