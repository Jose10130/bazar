const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin");
const { uploadProducts } = require("../middlewares/uploads");
const checkAdmin = require("../middlewares/checkAdmin");
const { productsValidation } = require("../middlewares/validations");

// "/admin"

router.get("/dashboard/productos", checkAdmin, adminController.list);
router.get("/dashboard/productos/:id/barcode", checkAdmin, adminController.barcode);

router.get("/dashboard/usuarios", checkAdmin, adminController.userList);
router.get("/dashboard/usuarios/:id", checkAdmin, adminController.userDetail);
router.put("/dashboard/usuarios/:id", checkAdmin, adminController.userEdit);

router.get("/dashboard/ordenes", checkAdmin, adminController.orderList);
router.get("/dashboard/ordenes/:id", checkAdmin, adminController.orderDetail);
router.get("/dashboard/ordenes/:id/pdf", checkAdmin, adminController.downloadOrderPdf);
router.put("/dashboard/ordenes/:id/estado", checkAdmin, adminController.updateOrderState);
router.post("/dashboard/ordenes/:id/descuento", checkAdmin, adminController.applyDiscount);

router.get("/dashboard/ventas-dia", checkAdmin, adminController.salesDay);
router.get("/dashboard/analiticas", checkAdmin, adminController.salesDay);

router.get("/dashboard/editar/:id", checkAdmin, adminController.edit);
router.put("/dashboard/editar/:id", checkAdmin, uploadProducts.single("imageProduct"), productsValidation, adminController.update);

router.get("/dashboard/crear", checkAdmin, adminController.create);
router.post("/dashboard/crear", checkAdmin, uploadProducts.single("imageProduct"), productsValidation, adminController.store);

router.delete("/dashboard/eliminar/:id", checkAdmin, adminController.destroy);

router.put("/dashboard/restaurar/:id", checkAdmin, adminController.restore);

module.exports = router;
