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

async function initDepositLabel(cell, id) {
    const res = await fetch(`/payment/purchase/${id}`);
    const payments = await res.json();

    if (payments.length === 1 && payments[0].paymentType === "deposit") {
        const price = cell.dataset.price;
        cell.textContent = price + "(訂金)";
    }
}

function paymentRow(p){
    const type = paymentTypeMap[p.paymentType];
    if(p.note){
        return `<div>${type}：${p.paidAmount} (${p.note})</div>`;
    }
    return `<div>${type}：${p.paidAmount}</div>`;
}

async function showPopover(cell, id) {
    const res = await fetch(`/payment/purchase/${id}`);
    const payments = await res.json();

    document.querySelectorAll(".payment-popover").forEach(p => p.remove());        
        let html = "";

        if (payments.length === 0) {

            const source = cell.dataset.source;
            const type = cell.dataset.type;
        
            html += `<div>付款來源：${sourceMap[source]}</div>`;
            html += `<div>類型：${typeMap[type]}</div>`;
        } else {
            payments.forEach(p => html += paymentRow(p));
            const purchase = payments[0].purchase;

            html += `<hr>`;
            html += `<div>付款來源：${sourceMap[purchase.paymentSource]}</div>`;
            html += `<div>類型：${typeMap[purchase.purchaseType]}</div>`;
        }

    createPopover(cell, html, "payment-popover");
}

document.querySelectorAll(".amount").forEach(cell => {
    const id = cell.dataset.id;
    initDepositLabel(cell, id);

    cell.setAttribute("data-popover-trigger", "");

    cell.addEventListener("click", () => {
        showPopover(cell, id);
    });
});

document.addEventListener("DOMContentLoaded", () => {
  enablePopoverAutoClose();
});