const path = require("path");
const PDFDocument = require("pdfkit");
const db = require("../../db/models");

const currencyFormat = (value) =>
  Number(value || 0).toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS"
  });

const buildBarcode = (product) => product.barcode || `PRD-${String(product.id).padStart(8, "0")}`;

const getQuantity = (product) => Number(
  product?.Orderproduct?.quantity ??
  product?.Orderproducts?.quantity ??
  product?.orderProducts?.quantity ??
  product?.orderproduct?.quantity ??
  1
) || 1;

module.exports = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await db.Order.findByPk(id, {
      include: [
        {
          model: db.Product,
          as: "products",
          through: { attributes: ["quantity"] }
        },
        {
          model: db.User,
          as: "user"
        }
      ]
    });

    if (!order) {
      return res.status(404).send("Orden no encontrada");
    }

    const plain = order.get({ plain: true });
    const products = Array.isArray(plain.products) ? plain.products : [];

    const lines = products.map((product) => {
      const quantity = getQuantity(product);
      const price = Number(product.price || 0);
      const subtotal = price * quantity;

      return {
        ...product,
        quantity,
        price,
        subtotal,
        barcode: buildBarcode(product)
      };
    });

    const subtotal = lines.reduce((acc, item) => acc + Number(item.subtotal || 0), 0);
    const total = Number(plain.total || subtotal);
    const discountAmount = Math.max(subtotal - total, 0);
    const discountPercent = subtotal > 0 ? (discountAmount / subtotal) * 100 : 0;
    const fullName = [plain.user?.name || "", plain.user?.surname || ""].join(" ").trim() || "Sin cliente";

    const doc = new PDFDocument({
      size: "A4",
      margin: 42,
      bufferPages: true
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="Orden-${id}.pdf"`);

    doc.pipe(res);

    const logoPath = path.join(__dirname, "../../../public/images/logo.png");
    const pageWidth = doc.page.width;
    const rightEdge = pageWidth - 42;

    if (require("fs").existsSync(logoPath)) {
      doc.image(logoPath, 42, 28, { width: 58 });
    }

    doc
      .fontSize(18)
      .font("Helvetica-Bold")
      .text("L Y L Aromas Nails", 110, 36);

    doc
      .fontSize(10)
      .font("Helvetica")
      .text("Boleta / comprobante de venta", 110, 58);

    doc.moveDown(2);

    doc
      .fontSize(22)
      .font("Helvetica-Bold")
      .text(`Orden N° ${plain.id}`, 42, 100);

    doc
      .fontSize(11)
      .font("Helvetica")
      .text(`Fecha: ${new Date(plain.createdAt).toLocaleString("es-AR")}`, 42, 130)
      .text(`Cliente: ${fullName}`, 42, 145)
      .text(`Estado: ${plain.state}`, 42, 160);

    doc
      .roundedRect(388, 96, 170, 74, 12)
      .fill("#203864")
      .fillColor("#ffffff");

    doc
      .fontSize(10)
      .font("Helvetica")
      .text("Total", 515, 112, { width: 30, align: "right" });

    doc
      .fontSize(24)
      .font("Helvetica-Bold")
      .text(currencyFormat(total), 398, 140, { width: 148, align: "center" });

    doc.fillColor("#000000");

    doc.moveTo(42, 190).lineTo(rightEdge, 190).strokeColor("#cccccc").stroke();
    doc.moveDown(1.5);

    let y = 212;

    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("Detalle de productos", 42, y);
    y += 20;

    doc
      .fontSize(9)
      .font("Helvetica-Bold")
      .text("Producto", 42, y)
      .text("Código", 210, y)
      .text("Cant.", 330, y, { width: 50, align: "right" })
      .text("Precio", 390, y, { width: 80, align: "right" })
      .text("Subtotal", 480, y, { width: 80, align: "right" });

    y += 10;
    doc.moveTo(42, y).lineTo(rightEdge, y).strokeColor("#e0e0e0").stroke();
    y += 8;
    doc.strokeColor("#000000");

    const pageBottom = 750;

    for (const item of lines) {
      if (y > pageBottom) {
        doc.addPage();
        y = 50;
      }

      doc
        .fontSize(10)
        .font("Helvetica")
        .text(item.name || "-", 42, y, { width: 160 })
        .text(item.barcode, 210, y, { width: 110 })
        .text(String(item.quantity), 330, y, { width: 50, align: "right" })
        .text(currencyFormat(item.price), 390, y, { width: 80, align: "right" })
        .text(currencyFormat(item.subtotal), 480, y, { width: 80, align: "right" });

      y += 24;
    }

    y += 10;
    doc.moveTo(42, y).lineTo(rightEdge, y).strokeColor("#cccccc").stroke();

    y += 16;
    doc
      .fontSize(11)
      .font("Helvetica")
      .text(`Subtotal: ${currencyFormat(subtotal)}`, 350, y, { width: 220, align: "right" });
    y += 16;
    doc
      .text(`Descuento: ${discountPercent.toFixed(0)}% (${currencyFormat(discountAmount)})`, 350, y, { width: 220, align: "right" });
    y += 16;
    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .text(`Total: ${currencyFormat(total)}`, 350, y, { width: 220, align: "right" });

    y += 34;
    doc
      .fontSize(10)
      .font("Helvetica")
      .text("Documento generado automáticamente desde el panel administrativo.", 42, y, {
        width: 500,
        align: "center"
      });

    doc.end();
  } catch (error) {
    console.error("Error generando PDF de la orden:", error);
    return res.status(500).send("Error generando PDF");
  }
};
