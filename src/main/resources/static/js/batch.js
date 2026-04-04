function reindex() {
  document.querySelectorAll(".item-row").forEach((row, index) => {

    row.querySelectorAll("[data-field]").forEach(el => {
      const field = el.dataset.field;
      el.name = `items[${index}].${field}`;
    });

    row.querySelectorAll("input[type='radio']").forEach(radio => {
      if (radio.dataset.field === "payMode") {
        radio.name = `items[${index}].payMode`;
      }
    });
  });
}

function updateIndex() {
  document.querySelectorAll(".item-row").forEach((row, i) => {
    row.querySelector(".item-index").textContent = `第 ${i+1} 筆`;
  });
}

function copyValues(from, to) {
  const fields = ["workTitle", "category"];

  fields.forEach(field => {
    const fromEl = from.querySelector(`[data-field="${field}"]`);
    const toEl = to.querySelector(`[data-field="${field}"]`);

    if (fromEl && toEl) {
      toEl.value = fromEl.value;
    }
  });
}

const items = document.getElementById("items");
const template = document.getElementById("template");

function createRow() {
  const newRow = template.cloneNode(true);
  newRow.style.display = "block";
  newRow.removeAttribute("id");
  
  setupPaymentRow(newRow, true);

  const last = items.lastElementChild;
  if (last) {
    copyValues(last, newRow);
  }

  return newRow;
}

// 初始化兩筆
window.addEventListener("DOMContentLoaded", () => {
  items.appendChild(createRow());
  items.appendChild(createRow());
  reindex();
  updateIndex();
});

document.addEventListener("click", e => {
  if (e.target.classList.contains("remove-btn")) {
    const rows = document.querySelectorAll(".item-row");
    if (rows.length <= 1) {
      alert("至少要一筆");
      return;
    }
    e.target.closest(".item-row").remove();
    reindex();
  }
});

document.getElementById("addRow").onclick = () => {
  items.appendChild(createRow());
  reindex();
  updateIndex();
};