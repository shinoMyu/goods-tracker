const mergeBar = document.getElementById("mergeBar");
const mergeCount = document.getElementById("mergeCount");
const confirmMergeBtn = document.getElementById("confirmMergeBtn");
const exitMergeBtn = document.getElementById("exitMergeBtn");
const clearMergeBtn = document.getElementById("clearMergeBtn");

let mergeMode = false;
let selectedIds = [];

function startMergeMode() {
  mergeMode = true;
  selectedIds = [];
  mergeBar.classList.add("active");
  updateCount();
}

function exitMergeMode() {
  mergeMode = false;
  selectedIds = [];
  mergeBar.classList.remove("active");
  
  document.querySelectorAll("tr.selected").forEach(row => {
    row.classList.remove("selected");
  });
}

function updateCount() {
  mergeCount.textContent = `已選 ${selectedIds.length} 筆`;
}

function clearSelection() {
  document.querySelectorAll("tr.selected").forEach(row => {
    row.classList.remove("selected");
  });
  selectedIds = [];
  updateCount();
}

function markMergedRows(orderId) {
  document.querySelectorAll("tbody tr").forEach(row => {
    const id = row.dataset.id;

    if (selectedIds.includes(id)) {
      const shippingCell = row.querySelector(".shipping");
      const statusCell = row.querySelector(".status");

      shippingCell.dataset.order = orderId;
      shippingCell.dataset.orderCount = selectedIds.length;
      statusCell.dataset.order = orderId;    
    }

    updateRowUI(row);
  });
}

document.querySelectorAll("tbody tr").forEach(row => {
    row.addEventListener("click", () => {
      if (!mergeMode) return;
  
      const status = row.querySelector(".status");
      if (status.dataset.received !== "true") return;

      const shipping = row.querySelector(".shipping");
      if (shipping.textContent.trim() !== "") return;

      const orderCount = parseInt(shipping.dataset.orderCount);
      if (orderCount > 1) return;
      
      const id = row.dataset.id;
  
      row.classList.toggle("selected");
  
      if (selectedIds.includes(id)) {
        selectedIds = selectedIds.filter(i => i !== id);
      } else {
        selectedIds.push(id);
      }
      updateCount();
    });
});

confirmMergeBtn.addEventListener("click", async () => {
    if (selectedIds.length < 2) {
      alert("至少選兩筆");
      return;
    }
  
    const res = await fetch("/orders/group", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(selectedIds)
    });

    const order = await res.json();
    const orderId = order.id;

    markMergedRows(orderId);
    exitMergeMode();
});

exitMergeBtn.addEventListener("click", exitMergeMode);

clearMergeBtn.addEventListener("click", clearSelection);