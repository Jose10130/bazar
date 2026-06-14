const { check, body } = require("express-validator");
const { Category } = require("../../db/models");

const regExpFiles = /\.(jpg|jpeg|png)$/i;

const fieldTitle = check("name")
  .trim()
  .notEmpty()
  .withMessage("El nombre es requerido")
  .bail()
  .isLength({ min: 3, max: 100 })
  .withMessage("El nombre debe tener entre 3 y 100 caracteres");

const fieldPrice = body("price")
  .notEmpty()
  .withMessage("El precio es requerido")
  .bail()
  .isFloat({ min: 0 })
  .withMessage("El precio debe ser un número mayor o igual a 0");

const fieldStock = body("stock")
  .notEmpty()
  .withMessage("El stock es requerido")
  .bail()
  .isInt({ min: 0 })
  .withMessage("El stock debe ser un número entero mayor o igual a 0");

const fieldDescription = body("description")
  .trim()
  .notEmpty()
  .withMessage("La descripción es requerida")
  .bail()
  .isLength({ min: 10, max: 1000 })
  .withMessage("La descripción debe tener entre 10 y 1000 caracteres");

const fieldCategory = body("category")
  .notEmpty()
  .withMessage("Debe seleccionar una categoría")
  .bail()
  .custom(async (value) => {
    const category = await Category.findByPk(value);
    if (!category) {
      throw new Error("La categoría seleccionada no existe");
    }
    return true;
  });

const fieldFile = body("imageProduct").custom((value, { req }) => {
  if (!req.file) {
    if (req.method === "POST") {
      throw new Error("La imagen es requerida");
    }
    return true;
  }

  const isValid = regExpFiles.test(req.file.originalname);
  if (!isValid) {
    throw new Error("La imagen debe ser JPG, JPEG o PNG");
  }

  return true;
});

module.exports = {
  productsValidation: [
    fieldTitle,
    fieldPrice,
    fieldStock,
    fieldDescription,
    fieldCategory,
    fieldFile
  ]
};
