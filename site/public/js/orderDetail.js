document.addEventListener("DOMContentLoaded", () => {
  const subtotalEl = document.getElementById("subtotalAmount");
  const discountInput = document.getElementById("discountPercent");
  const discountAmountEl = document.getElementById("discountAmount");
  const grandTotalEl = document.getElementById("grandTotal");
  const applyDiscountBtn = document.getElementById("applyDiscountBtn");

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

  updateTotals();
});
