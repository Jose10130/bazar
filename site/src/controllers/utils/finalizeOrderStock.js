const db = require('../../db/models');

const getPurchasedQuantity = (product) => Number(
  product?.Orderproduct?.quantity ??
  product?.Orderproducts?.quantity ??
  product?.orderProducts?.quantity ??
  product?.orderproduct?.quantity ??
  product?.Orderproduct?.dataValues?.quantity ??
  product?.Orderproducts?.dataValues?.quantity ??
  product?.orderProducts?.dataValues?.quantity ??
  product?.orderproduct?.dataValues?.quantity ??
  0
) || 0;

module.exports = async (orderId, transaction) => {
  // ✅ Solo traemos la orden sin JOIN para aplicar el bloqueo
  const order = await db.Order.findByPk(orderId, {
    transaction,
    lock: transaction.LOCK.UPDATE
  });

  if (!order) {
    const error = new Error('Orden no encontrada');
    error.status = 404;
    throw error;
  }

  if (order.stockDiscounted) {
    return order;
  }

  // ✅ Consultamos directamente la tabla intermedia (más seguro en Postgres)
  const orderItems = await db.Orderproduct.findAll({
    where: { orderId: order.id },
    attributes: ['productId', 'quantity'],
    transaction
  });

  if (!Array.isArray(orderItems) || orderItems.length === 0) {
    const error = new Error('No se puede finalizar una orden vacía');
    error.status = 400;
    throw error;
  }

  for (const item of orderItems) {
    const purchaseQuantity = Number(item.quantity) || 0;

    if (purchaseQuantity <= 0) continue;

    const productRow = await db.Product.findByPk(item.productId, {
      transaction,
      lock: transaction.LOCK.UPDATE
    });

    if (!productRow) {
      const error = new Error(`No se encontró el producto con ID: ${item.productId}`);
      error.status = 404;
      throw error;
    }

    const currentStock = Number(productRow.quantity || 0);

    if (currentStock < purchaseQuantity) {
      const error = new Error(
        `Stock insuficiente para ${productRow.name}. Disponible: ${currentStock}, solicitado: ${purchaseQuantity}`
      );
      error.status = 400;
      throw error;
    }

    await productRow.update(
      { quantity: currentStock - purchaseQuantity },
      { transaction }
    );
  }

  await order.update(
    { stockDiscounted: true },
    { transaction }
  );

  return order;
};