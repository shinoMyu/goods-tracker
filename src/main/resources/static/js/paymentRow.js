function setupPaymentRow(row, isBatchMode = false) {
    const amountInput = row.querySelector("#amountInput, .amountInput");
    const depositInput = row.querySelector("#depositInput, .depositInput");
    const balanceInput = row.querySelector("#balanceInput, .balanceInput");
    const totalPreview = row.querySelector("#totalPreview, .totalPreview");

    const paymentOptions = row.querySelector("#paymentOptions, .paymentOptions");
    const installmentBox = row.querySelector("#installmentBox, .installmentBox");
    const totalRow = row.querySelector("#totalRow, .total");

    if (!amountInput) return;

    // 顯示付款選項
    amountInput.addEventListener("focus", () => {
        paymentOptions.style.display = "block";

        if (isBatchMode) {
            const formGroup = amountInput.closest('.form-group');
            if (formGroup) {
                formGroup.classList.add('amount-row');
            }
        }
    });

    // 切換付款模式
    paymentOptions.addEventListener("change", (e) => {
        const mode = e.target.value;

        amountInput.style.display = "none";
        installmentBox.style.display = "none";
        balanceInput.style.display = "none";
        totalRow.style.display = "none";

        if (mode === "single") {
            amountInput.style.display = "block";
        }
        if (mode === "deposit") {
            installmentBox.style.display = "flex";
        }

        if (mode === "installment") {
            installmentBox.style.display = "flex";
            balanceInput.style.display = "block";
            totalRow.style.display = "flex";
        }
    });

    // 計算總金額
    function updateTotal() {
        const d = parseFloat(depositInput.value) || 0;
        const b = parseFloat(balanceInput.value) || 0;
    
        const total = d + b;
        totalPreview.textContent = total.toFixed(2);
        amountInput.value = total;
    }

    depositInput.addEventListener("input", updateTotal);
    balanceInput.addEventListener("input", updateTotal);
}