document.querySelectorAll(".status").forEach(cell => {
    const row = cell.closest("tr");
    
    updateRowUI(row);

    cell.addEventListener("dblclick", async () => {
        const id = row.dataset.id;

        if (cell.textContent.trim() !== "✓") {
            // 更新 DB
            await fetch(`/purchases/${id}/received`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({received: true})
            });

            // 更新 UI（不用 reload）
            cell.textContent = "✓";
            cell.dataset.received = "true";
            
            updateRowUI(row);

            const workColor = row.querySelector(".work-color");
            workColor.dataset.received = "true";          
            applyWorkColor(workColor);  
        }
    });
});