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
            .isInt({ min: 2100 })
            .withMessage(`Please provide a year greater or equal to 2100`),
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

validate.checkAddData = async (req, res, next) => {
    const { inv_make, inv_model, inv_year, inv_description, inv_thumbnail, inv_image, inv_price, inv_miles, inv_color, classification_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let classifications = await utilities.buildClassificationList(classification_id)
        let nav = await utilities.getNav()
        res.render("./inventory/add-inventory", {
            errors: errors,
            title: `Add Inventory`,
            nav,
            classifications: classifications,
            inv_make: inv_make,
            inv_model: inv_model,
            inv_year: inv_year,
            inv_description: inv_description,
            inv_image: inv_image,
            inv_thumbnail: inv_thumbnail,
            inv_price: inv_price,
            inv_miles: inv_miles,
            inv_color: inv_color
        })
        return
    }
    next()
}

validate.checkUpdateData = async (req, res, next) => {
    const updatedInventory = { inv_make, inv_model, inv_year, inv_description, inv_thumbnail, inv_image, inv_price, inv_miles, inv_color, classification_id } = req.body
    let errors = []
    errors = validationResult(req)
    console.log("Errors: " + errors)
    if (!errors.isEmpty()) {
        let classifications = await utilities.buildClassificationList(updatedInventory.classification_id)
        let nav = await utilities.getNav()
        res.render("./inventory/edit-inventory", {
            title: `Edit ${updatedInventory.inv_make} ${updatedInventory.inv_model}`,
            nav,
            classifications: classifications,
            errors: errors,
            inv_make: updatedInventory.inv_make,
            inv_model: updatedInventory.inv_model,
            inv_year: updatedInventory.inv_year,
            inv_description: updatedInventory.inv_description,
            inv_image: updatedInventory.inv_image,
            inv_thumbnail: updatedInventory.inv_thumbnail,
            inv_price: updatedInventory.inv_price,
            inv_miles: updatedInventory.inv_miles,
            inv_color: updatedInventory.inv_color,
            inv_id: updatedInventory.inv_id
        })
        return
    }
    next()
}
module.exports = validate
