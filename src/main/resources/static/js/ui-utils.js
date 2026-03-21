function applyWorkColor(cell) {
    const color = cell.dataset.color;
    const received = cell.dataset.received === "true";
  
    if (color && received) {
      cell.style.background = color;
    } else {
        cell.style.background = ""; 
    }
}

function updateRowUI(row) {
    const status = row.querySelector(".status");
    const shipping = row.querySelector(".shipping");
  
    const received = status.dataset.received === "true";
    const hasShipping = shipping.textContent.trim() !== "";
  
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
}