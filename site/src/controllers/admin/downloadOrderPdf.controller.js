const PDFDocument = require('pdfkit');
const db = require('../../db/models');

module.exports = async (req, res) => {
  try {

    const { id } = req.params;

    const order = await db.Order.findByPk(id,{
      include:[
        {
          model: db.Product,
          as:'products',
          through:{attributes:['quantity']}
        },
        {
          model: db.User,
          as:'user'
        }
      ]
    });

    if(!order){
      return res.status(404).send('Orden no encontrada');
    }

    const doc = new PDFDocument({
      margin:50
    });

    res.setHeader(
      'Content-Disposition',
      `attachment; filename=Orden-${id}.pdf`
    );

    res.setHeader(
      'Content-Type',
      'application/pdf'
    );

    doc.pipe(res);

    doc
      .fontSize(24)
      .text('Detalle de Orden', {
        align:'center'
      });

    doc.moveDown();

    doc.fontSize(14);
    doc.text(`Orden N°: ${order.id}`);
    doc.text(`Cliente: ${order.user.name} ${order.user.surname || ''}`);
    doc.text(`Estado: ${order.state}`);

    doc.moveDown();

    let total = 0;

    order.products.forEach(product => {

      const quantity =
      product.Orderproduct?.quantity ||
      product.Orderproducts?.quantity ||
      1;

      const subtotal =
      Number(product.price) * quantity;

      total += subtotal;

      doc.text(
        `${product.name}`
      );

      doc.text(
        `Cantidad: ${quantity}`
      );

      doc.text(
        `Precio: $${product.price}`
      );

      doc.text(
        `Subtotal: $${subtotal}`
      );

      doc.moveDown();
    });

    doc.moveDown();

    doc
      .fontSize(18)
      .text(
        `TOTAL: $${total}`,
        {
          align:'right'
        }
      );

    doc.end();

  } catch(error){

    console.error(error);

    res.status(500).send(
      'Error generando PDF'
    );

  }
};