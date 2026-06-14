document.addEventListener('DOMContentLoaded', function () {
  var addButtons = document.querySelectorAll('.add-to-cart, .detail-add-to-cart, .detail-buy-now');
  var plusButton = document.querySelector('.detail-quantity-plus');
  var minusButton = document.querySelector('.detail-quantity-minus');
  var quantityValue = document.getElementById('detailQuantityValue');

  function showMessage(type, text) {
    if (window.Toastify) {
      Toastify({
        text: text,
        duration: 2500,
        gravity: 'top',
        position: 'right',
        close: true,
        style: {
          background: type === 'error' ? '#dc3545' : '#198754'
        }
      }).showToast();
      return;
    }

    if (window.Swal) {
      Swal.fire({
        icon: type === 'error' ? 'error' : 'success',
        title: text,
        timer: 1800,
        showConfirmButton: false
      });
      return;
    }

    alert(text);
  }

  function getStockFromDetailButtons() {
    var detailAdd = document.querySelector('.detail-add-to-cart');
    if (!detailAdd) {
      detailAdd = document.querySelector('.detail-buy-now');
    }
    var stock = detailAdd ? Number(detailAdd.dataset.stock || 0) : 0;
    return Number.isFinite(stock) ? stock : 0;
  }

  function getQuantityToSend(button) {
    if (button && button.classList.contains('detail-add-to-cart') || button && button.classList.contains('detail-buy-now')) {
      var current = Number(quantityValue ? quantityValue.textContent : 1);
      return Number.isFinite(current) && current > 0 ? current : 1;
    }

    return 1;
  }

  function updateQuantity(delta) {
    if (!quantityValue) {
      return;
    }

    var stock = getStockFromDetailButtons();
    var current = Number(quantityValue.textContent || '1');
    if (!Number.isFinite(current)) {
      current = 1;
    }

    var next = current + delta;

    if (stock > 0) {
      if (next > stock) next = stock;
    }

    if (next < 1) next = 1;
    quantityValue.textContent = String(next);
  }

  async function addToCart(button, goToCart) {
    var productId = button.dataset.productId;
    var quantity = getQuantityToSend(button);

    try {
      button.disabled = true;

      var response = await fetch('/carrito/agregar-producto/' + productId, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          quantity: quantity
        })
      });

      var data = {};
      try {
        data = await response.json();
      } catch (jsonError) {
        data = {};
      }

      if (!response.ok || data.ok === false) {
        throw new Error(data.msg || 'No se pudo agregar el producto al carrito');
      }

      showMessage('success', data.msg || 'Producto agregado al carrito');

      if (goToCart) {
        window.location.href = '/carrito';
      }
    } catch (error) {
      showMessage('error', error.message);
    } finally {
      button.disabled = false;
    }
  }

  if (plusButton) {
    plusButton.addEventListener('click', function () {
      updateQuantity(1);
    });
  }

  if (minusButton) {
    minusButton.addEventListener('click', function () {
      updateQuantity(-1);
    });
  }

  addButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      if (button.classList.contains('detail-buy-now')) {
        addToCart(button, true);
        return;
      }

      addToCart(button, false);
    });
  });
});
