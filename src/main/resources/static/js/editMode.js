let isEditMode = false;
let editingRow = null;

const editBtn = document.getElementById("editModeBtn");
const actionHeader = document.querySelector("th.action-col");

function bindRowEvents() {
  const rows = document.querySelectorAll("tbody tr");

  rows.forEach(row => {
    const editBtn = row.querySelector(".edit-btn");
    const saveBtn = row.querySelector(".save-btn");
    const cancelBtn = row.querySelector(".cancel-btn");

    if (!editBtn) return;

    editBtn.onclick = () => {
      editingRow = row;
      render();
    };

    cancelBtn.onclick = () => {
      editingRow = null;
      render();
    };

    saveBtn.onclick = () => {
      editingRow = null;
      render();
    };
  });
}

function render() {
  const rows = document.querySelectorAll("tbody tr");

  rows.forEach(row => {
    const editBtn = row.querySelector(".edit-btn");
    const saveBtn = row.querySelector(".save-btn");
    const cancelBtn = row.querySelector(".cancel-btn");

    if (!editBtn) return;

    if (!isEditMode) {
      editBtn.style.display = "none";
      saveBtn.style.display = "none";
      cancelBtn.style.display = "none";
      return;
    }

    if (editingRow === null) {
      // 可選擇狀態
      editBtn.style.display = "inline-block";
      saveBtn.style.display = "none";
      cancelBtn.style.display = "none";
    } else if (editingRow == row) {
      // 編輯中
      editBtn.style.display = "none";
      saveBtn.style.display = "inline-block";
      cancelBtn.style.display = "inline-block";
    } else {
      // 其他列鎖住
      editBtn.style.display = "none";
      saveBtn.style.display = "none";
      cancelBtn.style.display = "none";
    }
  });
  bindRowEvents();
}

editModeBtn.addEventListener("click", () => {
  isEditMode = !isEditMode;
  editingRow = null;

  editModeBtn.textContent = isEditMode ? "結束編輯" : "編輯模式";
  actionHeader.classList.toggle("edit-mode");
  actionHeader.textContent = isEditMode ? "編輯" : "";
  document.querySelector(".dropdown").classList.remove("open");

  render();
});
