module.exports = (data = []) => {
  let total = 0;

  data.forEach((product) => {
    const price = Number(product && product.price ? product.price : 0);
    const quantity = Number(
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

    total += price * quantity;
  });

  return total;
};
