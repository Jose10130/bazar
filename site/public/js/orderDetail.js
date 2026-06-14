document.addEventListener("DOMContentLoaded", () => {
  const subtotalEl = document.getElementById("subtotalAmount");
  const discountInput = document.getElementById("discountPercent");
  const discountAmountEl = document.getElementById("discountAmount");
  const grandTotalEl = document.getElementById("grandTotal");
  const applyDiscountBtn = document.getElementById("applyDiscountBtn");
  const printReceiptBtn = document.getElementById("printReceiptBtn");

  if (!subtotalEl || !discountInput || !discountAmountEl || !grandTotalEl) {
    return;
  }

  const subtotal = Number(subtotalEl.dataset.orderSubtotal || 0);
  const currency = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS"
  });

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  const updateTotals = () => {
    const discountPercent = clamp(Number(discountInput.value || 0), 0, 100);
    const discountAmount = subtotal * (discountPercent / 100);
    const total = subtotal - discountAmount;

    discountAmountEl.textContent = currency.format(discountAmount);
    grandTotalEl.textContent = currency.format(total);
  };

  discountInput.addEventListener("input", updateTotals);

  if (applyDiscountBtn) {
    applyDiscountBtn.addEventListener("click", updateTotals);
  }

  if (printReceiptBtn) {
    printReceiptBtn.addEventListener("click", () => {
      window.print();
    });
  }

  function updateTotals() {

    const discountPercent =
        Math.max(
            0,
            Math.min(
                100,
                Number(discountInput.value || 0)
            )
        );

    const discountAmount =
        subtotal * (discountPercent / 100);

    const total =
        subtotal - discountAmount;

    discountAmountEl.textContent =
        currency.format(discountAmount);

    grandTotalEl.textContent =
        currency.format(total);

    const discountRow =
        document.querySelector(".summary-discount-result");

    if(discountRow){

        if(discountPercent <= 0){

            discountRow.style.display = "none";

        } else {

            discountRow.style.display = "flex";

        }

    }

}
});