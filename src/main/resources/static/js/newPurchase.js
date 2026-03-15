const amountInput = document.getElementById("amountInput");
const options = document.getElementById("paymentOptions");
const installmentBox = document.getElementById("installmentBox");

const depositInput = document.getElementById("depositInput");
const balanceInput = document.getElementById("balanceInput");
const totalRow = document.getElementById("totalRow");
const totalPreview = document.getElementById("totalPreview");

// 點擊金額顯示付款方式
amountInput.addEventListener("focus", () => {
    options.style.display = "block";
});

// 切換付款模式
document.querySelectorAll("input[name='payMode']").forEach(radio => {
    radio.addEventListener("change", () => {
        const mode = radio.value;

        amountInput.style.display = "none";
        installmentBox.style.display = "none";
        balanceInput.style.display = "none";
        totalRow.style.display = "none";

        if (mode === "single") {
            amountInput.style.display = "block";
            options.classList.remove("installment-mode");
        }

        if (mode === "deposit") {
            installmentBox.style.display = "flex";
            options.classList.remove("installment-mode");
        }

        if (mode === "installment") {
            installmentBox.style.display = "flex";
            balanceInput.style.display = "block";
            totalRow.style.display = "flex";
            options.classList.add("installment-mode");
        }

        // if (mode === "installment") {
        //     amountInput.style.display = "none";
        //     installmentBox.style.display = "flex";
        //     options.classList.add("installment-mode");
        // } else {
        //     amountInput.style.display = "block";
        //     installmentBox.style.display = "none";
        //     options.classList.remove("installment-mode");
        // }
    });
});

// 自動計算總金額
function updateTotal() {
    const d = parseFloat(depositInput.value) || 0;
    const b = parseFloat(balanceInput.value) || 0;
    
    const total = d + b;
    totalPreview.textContent = (total).toFixed(2);
    amountInput.value = total;
}

depositInput.addEventListener("input", updateTotal);
balanceInput.addEventListener("input", updateTotal);


