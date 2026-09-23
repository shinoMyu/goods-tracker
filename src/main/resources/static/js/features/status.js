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
                body: JSON.stringify({ received: true })
            });

            // 更新 UI
            cell.textContent = "✓";
            cell.dataset.received = "true";

            updateRowUI(row);

            const workColor = row.querySelector(".work-color");
            const workId = workColor.dataset.workId;

            const source = document.querySelector(
                `.work-color[data-work-id='${workId}'][data-color]`
            );

            if (source) {
                workColor.dataset.color = source.dataset.color;
            }

            workColor.dataset.received = "true";
            applyWorkColor(workColor);
        }
    });
});