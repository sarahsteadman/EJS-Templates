// Needed Resources 
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/index")


// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:id", utilities.handleErrors(invController.buildDetailsById));

router.get('/management', utilities.handleErrors(invController.buildManagement));
router.get('/addClassification', utilities.handleErrors(invController.buildAddClassification));
router.post('/addClassification', utilities.handleErrors(invController.addClassification));
router.get('/addInventory', utilities.handleErrors(invController.buildAddInventory));
router.post('/addInventory', utilities.handleErrors(invController.addInventory));

module.exports = router;