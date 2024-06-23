inv_make, inv_model, inv_year, inv_description, inv_image, inv_price, inv_miles, inv_color

const utilities = require("./index")

// const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
  *  Inventory Data Validation Rules
  * ********************************* */
validate.inventoryRules = () => {
    return [
        body("inv_make")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide a car make."),
        body("inv_model")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide a car model."),
        body("inv_description")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide a car description."),
        body("inv_color")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide a car color."),
        body("inv_year")
            .trim()
            .notEmpty()
            .isInt({ min: 0 })
            .withMessage(`Please provide a non-negative number for year`),
        body("inv_miles")
            .trim()
            .notEmpty()
            .isInt({ min: 0 })
            .withMessage("Please provide a non-negative number for miles."),
        body("inv_price")
            .trim()
            .notEmpty()
            .isFloat({ min: 0 })
            .withMessage("Please provide a valid price greater than or equal to 0."),
        body("classification_id")
            .trim()
            .notEmpty()
            .isInt()
            .withMessage("Please provide a valid classification ID."),
    ]
}

module.exports = validate
