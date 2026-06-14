const { getOrderPending } = require('./utility');

module.exports = async (req, res) => {
  try {
    const [order] = await getOrderPending(req);

    order.state = 'canceled';
    await order.save();

    return res.status(200).json({
      ok: true,
      msg: 'Orden cancelada con éxito'
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      ok: false,
      msg: error.message
    });
  }
};
