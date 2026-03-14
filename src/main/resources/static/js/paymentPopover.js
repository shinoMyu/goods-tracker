const paymentTypeMap = {
    deposit: "訂金",
    balance: "尾款"
};

const sourceMap = {
    father: "父",
    mother: "母",
    self: "自己"
};

const typeMap = {
    official: "公式",
    secondhand: "中古"
};

document.querySelectorAll(".amount").forEach(cell => {
    cell.addEventListener("click", async () => {
        document.querySelectorAll(".payment-popover").forEach(p => p.remove());
        const existing = cell.querySelector(".payment-popover");

        if (existing) {
            existing.remove();
            return;
        }

        const id = cell.dataset.id;

        const res = await fetch(`/payment/purchase/${id}`);
        const payments = await res.json();
        if (payments.length === 1 && payments[0].paymentType === "deposit") {
            const amountText = cell.textContent;
            if (!amountText.includes("(訂金)")) {
                cell.textContent = amountText + "(訂金)";
            }
        }
        
        let html = "";

        payments.forEach(p => {
            const type = paymentTypeMap[p.paymentType];

            if (p.note) {
                html += `<div>${type}：${p.paidAmount} (${p.note})</div>`;
            } else {
                html += `<div>${type}：${p.paidAmount}</div>`;
            }
        });

        if (payments.length > 0) {
            const purchase = payments[0].purchase;

            html += `<hr>`;
            html += `<div>付款來源：${sourceMap[purchase.paymentSource]}</div>`;
            html += `<div>類型：${typeMap[purchase.purchaseType]}</div>`;
        }

        let box = document.createElement("div");
        box.className = "payment-popover";
        box.innerHTML = html;

        cell.appendChild(box);  
    });
});

document.addEventListener("click", (e) => {
    const popovers = document.querySelectorAll(".payment-popover");
    popovers.forEach(p => {
        if (!p.contains(e.target) && !e.target.closest(".amount")) {
        p.remove();
      }
    });  
});