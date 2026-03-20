function updateStatusTip(cell, shipping) {
    const received = cell.dataset.received === "true";
    const hasShipping = shipping.textContent.trim() !== "";

    if (!received) {
        cell.dataset.tip = "雙擊設為已到貨";
        return;
    }

    if (!hasShipping) {
        cell.dataset.tip = "可編輯郵費";
    } else {
        cell.removeAttribute("data-tip");
    }
}

document.querySelectorAll(".status").forEach(cell => {
    const row = cell.closest("tr");
    const shipping = row.querySelector(".shipping");

    updateStatusTip(cell, shipping);

    if (cell.textContent.trim() === "✓") {
        shipping.classList.add("editable"); 
    }

    cell.addEventListener("dblclick", async () => {
        const id = row.dataset.id;

        if (cell.textContent.trim() !== "✓") {
            // 更新 DB
            await fetch(`/purchases/${id}/received`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(true)
            });

            // 更新 UI（不用 reload）
            cell.textContent = "✓";

            cell.dataset.received = "true";
            updateStatusTip(cell, shipping);
            shipping.classList.add("editable");

            const workColor = row.querySelector(".work-color");
            workColor.dataset.received = "true";          
            applyWorkColor(workColor);  
        }
    });
});
