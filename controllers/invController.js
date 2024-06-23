const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
        errors: null
    })

}
/* ***************************
 *  Build detail view
 * ************************** */
invCont.buildDetailsById = async function (req, res, next) {
    const id = req.params.id
    const data = await invModel.getInventoryById(id)
    if (data) {
        const div = await utilities.buildCarDetails(data[0])
        let nav = await utilities.getNav()
        let vehicleName = `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`
        res.render("./inventory/details", {
            title: vehicleName,
            nav,
            div,
            errors: null
        }
        )
    }
}

//Build Add Classification view
invCont.buildManagement = async function (req, res, next) {
    try {
        let nav = await utilities.getNav()
        req.flash("notice", "")
        res.render("./inventory/management", {
            title: "Management",
            message: "",
            nav,
            errors: null
        })
    } catch (error) {
        next(error)
    }
}
//Build Add Classification view
invCont.buildAddClassification = async function (req, res, next) {
    try {
        let nav = await utilities.getNav()
        req.flash("notice", "")
        res.render("./inventory/add-classification", {
            title: "Add Classification",
            message: "",
            nav,
            errors: null
        })
    } catch (error) {
        next(error)
    }
}
//Build Add Inventory view
invCont.buildAddInventory = async function (req, res, next) {
    try {
        let nav = await utilities.getNav()
        let classifications = await utilities.buildClassificationList()
        req.flash("notice", "")
        res.render("./inventory/add-inventory", {
            title: "Add Inventory",
            message: "",
            nav,
            classifications,
            errors: null
        })
    } catch (error) {
        next(error)
    }
}

/* ****************************************
*  Add a new Classification
* *************************************** */
invCont.addClassification = async function (req, res) {
    let nav = await utilities.getNav()
    const { classification } = req.body
    console.log("called");

    const characters = /^[a-zA-Z0-9]+$/;
    if (!characters.test(classification)) {
        req.flash("notice", "Classification name can only contain alphanumeric characters and no spaces.");
        return res.status(400).render("inventory/addClassification", {
            title: "Add Classification",
            nav,
            errors: null
        });
    }

    const addResult = await invModel.addClassification(classification);
    if (addResult) {
        req.flash("notice", `Classification '${classification}' added successfully.`);
        res.status(201).redirect("/inv/management");
    } else {
        req.flash("notice", "Sorry, adding the classification failed.");
        res.status(500).render("inv/addClassification", {
            title: "Add Classification",
            nav,
            errors: null
        });
    }
}

/* ****************************************
*  Add a new Inventory
* *************************************** */
invCont.addInventory = async function (req, res) {
    let nav = await utilities.getNav()
    let classifications = await utilities.buildClassificationList()
    const addedInventory = { inv_make, inv_model, inv_year, inv_description, inv_thumbnail, inv_image, inv_price, inv_miles, inv_color, classification_id } = req.body

    const inventory = await invModel.addInventory(addedInventory)

    if (inventory) {
        req.flash(
            "notice",
            `Inventory item added`
        )
        res.status(201).render("inventory/add-inventory", {
            title: "Add Inventory",
            nav,
            classifications,
            errors: null
        })
    } else {
        req.flash("notice", "Sorry, the inventory item could not be added.")
        res.status(501).render("inventory/add-inventory", {
            title: "Add Inventory",
            nav,
            classifications,
            errors: null
        })
    }

}

module.exports = invCont