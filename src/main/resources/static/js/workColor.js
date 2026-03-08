document.querySelectorAll(".work-color").forEach(cell => {

  const color = cell.dataset.color;
  const received = cell.dataset.received === "true";
  // 初始化顏色
  if (color && received) {
    cell.style.background = color;
  }
  
  cell.addEventListener("click", () => {
    // 已經有顏色就不允許修改
    if (cell.dataset.color) {
      return;
    }       
    const workId = cell.dataset.workId;
    const input = document.createElement("input");
    input.type = "color";
    input.addEventListener("input", async () => {
      const color = input.value;
      // 更新畫面
      cell.style.background = color;
      // 存入資料庫
      await fetch(`/work/${workId}/color`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          color: color
        })
      });      
    });
    input.click(); 
  });
});