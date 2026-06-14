document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.js-barcode').forEach((element) => {
    const value = element.dataset.code || element.getAttribute('data-code') || element.textContent.trim()

    if (!value) {
      return
    }

    if (window.JsBarcode) {
      JsBarcode(element, value, {
        format: 'CODE128',
        displayValue: true,
        fontSize: 16,
        height: 70,
        margin: 0
      })
    } else {
      element.textContent = value
    }
  })
})
