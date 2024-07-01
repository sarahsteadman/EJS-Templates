const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)

    if (data.length === 0) {
        let nav = await utilities.getNav()
        res.render("./inventory/classification", {
            title: "No vehicles found",
            nav,
            grid: "<p>No cars were found in this category</p>",
            errors: null
        })
        return
    }

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

invCont.buildManagement = async function (req, res, next) {
    try {
        let nav = await utilities.getNav()
        const classificationSelect = await utilities.buildClassificationList()
        req.flash("notice", "")
        res.render("./inventory/management", {
            title: "Management",
            message: "",
            nav,
            classification: classificationSelect,
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
            errors: null,
            formData: {}
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
            errors: null,
            formData: {}
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


    const characters = /^[a-zA-Z0-9]+$/;
    if (!characters.test(classification)) {
        req.flash("notice", "Classification name can only contain alphanumeric characters and no spaces.");
        return res.status(400).render("inventory/addClassification", {
            title: "Add Classification",
            nav,
            errors: null,
            formData: {}
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
            errors: null,
            formData: classification
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
            formData: {}
        })
    } else {
        req.flash("notice", "Sorry, the inventory item could not be added.")
        res.status(501).render("inventory/add-inventory", {
            title: "Add Inventory",
            nav,
            classifications,
            errors: null,
            formData: addedInventory
        })
    }

}

/* ****************************************
*  Update Inventory
* *************************************** */
invCont.updateInventory = async function (req, res) {
    let nav = await utilities.getNav()
    let classifications = await utilities.buildClassificationList()
    const addedInventory = { inv_make, inv_model, inv_year, inv_description, inv_thumbnail, inv_image, inv_price, inv_miles, inv_color, classification_id } = req.body

    const inventory = await invModel.updateInventoryInventory(addedInventory)
    if (inventory) {
        req.flash(
            "notice",
            `Inventory item added`
        )
        res.status(201).render("inventory/edit-inventory", {
            title: "Add Inventory",
            nav,
            classifications,
            errors: null,
            formData: {}
        })
    } else {
        req.flash("notice", "Sorry, the inventory item could not be edited.")
        res.status(501).render("inventory/add-inventory", {
            title: "Add Inventory",
            nav,
            classifications,
            errors: null,
            formData: addedInventory
        })
    }

}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    if (invData[0].inv_id) {
        return res.json(invData)
    } else {
        next(new Error("No data returned"))
    }
}

/* ***************************
 *  Create the view for editing inventory
 * ************************** */
invCont.editInventory = async (req, res, next) => {
    const id = parseInt(req.params.id)
    let nav = await utilities.getNav()
    let carArray = await invModel.getInventoryById(id);
    let car = carArray[0];
    let name = `Edit ${car.inv_make} ${car.inv_model}`
    let classifications = await utilities.buildClassificationList(car.classification_id)

    res.render("./inventory/edit-inventory", {
        title: name,
        nav,
        classifications: classifications,
        errors: null,
        inv_id: car.inv_id,
        inv_make: car.inv_make,
        inv_model: car.inv_model,
        inv_year: car.inv_year,
        inv_description: car.inv_description,
        inv_image: car.inv_image,
        inv_thumbnail: car.inv_thumbnail,
        inv_price: car.inv_price,
        inv_miles: car.inv_miles,
        inv_color: car.inv_color
    })
}


module.exports = invCont