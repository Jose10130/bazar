document.addEventListener('DOMContentLoaded', function () {
  var moreButtons = document.querySelectorAll('.more-quantity');
  var lessButtons = document.querySelectorAll('.less-quantity');
  var removeButtons = document.querySelectorAll('.remove-from-cart');
  var whatsappButton = document.getElementById('btn-whatsapp');
  var mercadopagoButton = document.getElementById('btn-mercadopago');
  var checkoutForm = document.getElementById('formulario_pago');

  // Cambiar este número aquí cuando haga falta.
  var WHATSAPP_NUMBER = '5492645570781';

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

  function formatMoney(value) {
    return Number(value || 0).toLocaleString('es-AR', {
      style: 'currency',
      currency: 'ARS'
    });
  }

  function getQuantity(product) {
    return Number(
      (product && product.Orderproducts && product.Orderproducts.quantity) ||
      (product && product.Orderproducts && product.Orderproducts.dataValues && product.Orderproducts.dataValues.quantity) ||
      (product && product.Orderproduct && product.Orderproduct.quantity) ||
      (product && product.Orderproduct && product.Orderproduct.dataValues && product.Orderproduct.dataValues.quantity) ||
      (product && product.orderProducts && product.orderProducts.quantity) ||
      (product && product.orderProducts && product.orderProducts.dataValues && product.orderProducts.dataValues.quantity) ||
      (product && product.dataValues && product.dataValues.Orderproducts && product.dataValues.Orderproducts.quantity) ||
      (product && product.dataValues && product.dataValues.Orderproducts && product.dataValues.Orderproducts.dataValues && product.dataValues.Orderproducts.dataValues.quantity) ||
      0
    ) || 0;
  }

  function runPatch(url) {
    return fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function (response) {
      return response.json().catch(function () {
        return {};
      }).then(function (data) {
        if (!response.ok || data.ok === false) {
          throw new Error(data.msg || 'No se pudo completar la acción');
        }
        return data;
      });
    });
  }

  function getCartItems() {
    var nodes = document.querySelectorAll('.cart-item[data-product-id]');
    return Array.prototype.map.call(nodes, function (node) {
      return {
        id: node.dataset.productId || '',
        name: node.dataset.productName || '',
        price: Number(node.dataset.productPrice || 0),
        quantity: Number(node.dataset.productQty || 0),
        subtotal: Number(node.dataset.productSubtotal || 0)
      };
    });
  }

  function buildWhatsAppMessage() {
    var dniInput = document.getElementById('numero-dni');
    var phoneInput = document.getElementById('numero-celular');
    var emailInput = document.getElementById('correo-electronico');
    var orderTotalEl = document.querySelector('.summary-row--total');
    var orderNumberEl = document.querySelector('.cart-hero__value');

    var dni = dniInput ? dniInput.value.trim() : '';
    var phone = phoneInput ? phoneInput.value.trim() : '';
    var email = emailInput ? emailInput.value.trim() : '';
    var orderTotal = orderTotalEl ? Number(orderTotalEl.dataset.orderTotal || 0) : 0;
    var orderNumber = orderNumberEl ? orderNumberEl.textContent.trim() : '—';
    var items = getCartItems();

    var messageLines = [];
    messageLines.push('*Nuevo pedido*');
    messageLines.push('');
    messageLines.push('*N° de orden:* ' + orderNumber);
    messageLines.push('');
    messageLines.push('*Datos del cliente*');
    messageLines.push('DNI: ' + (dni || 'No informado'));
    messageLines.push('Celular: ' + (phone || 'No informado'));
    messageLines.push('Correo: ' + (email || 'No informado'));
    messageLines.push('');
    messageLines.push('*Productos*');

    items.forEach(function (item, index) {
      messageLines.push(
        (index + 1) + '. ' + item.name +
        ' | Precio: ' + formatMoney(item.price) +
        ' | Cantidad: ' + item.quantity +
        ' | Subtotal: ' + formatMoney(item.subtotal)
      );
    });

    messageLines.push('');
    messageLines.push('*Total general:* ' + formatMoney(orderTotal));
    messageLines.push('');
    messageLines.push('¡Gracias!');

    return messageLines.join('\n');
  }

  moreButtons.forEach(function (button) {
    button.addEventListener('click', async function () {
      try {
        await runPatch('/carrito/incrementar/' + button.dataset.productId);
        window.location.reload();
      } catch (error) {
        showMessage('error', error.message);
      }
    });
  });

  lessButtons.forEach(function (button) {
    button.addEventListener('click', async function () {
      try {
        var data = await runPatch('/carrito/decrementar/' + button.dataset.productId);
        showMessage('success', data.msg || 'Cantidad actualizada');
        window.location.reload();
      } catch (error) {
        showMessage('error', error.message);
      }
    });
  });

  removeButtons.forEach(function (button) {
    button.addEventListener('click', async function () {
      var confirmRemove = true;

      if (window.Swal) {
        var result = await Swal.fire({
          icon: 'warning',
          title: '¿Eliminar producto?',
          text: 'Esta acción lo quitará del carrito.',
          showCancelButton: true,
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'Cancelar'
        });
        confirmRemove = result.isConfirmed;
      } else {
        confirmRemove = confirm('¿Eliminar este producto del carrito?');
      }

      if (!confirmRemove) {
        return;
      }

      try {
        await runPatch('/carrito/remover-producto/' + button.dataset.productId);
        showMessage('success', 'Producto eliminado');
        window.location.reload();
      } catch (error) {
        showMessage('error', error.message);
      }
    });
  });

  if (whatsappButton) {
    whatsappButton.addEventListener('click', function () {
      if (!checkoutForm || !checkoutForm.checkValidity()) {
        if (checkoutForm) {
          checkoutForm.reportValidity();
        }
        return;
      }

      var items = getCartItems();
      if (!items.length) {
        showMessage('error', 'No hay productos en el carrito.');
        return;
      }

      var message = buildWhatsAppMessage();
      var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message);
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  }

  if (mercadopagoButton) {
    mercadopagoButton.addEventListener('click', function () {
      showMessage('success', 'La integración con Mercado Pago quedará lista en la próxima etapa.');
    });
  }
});
