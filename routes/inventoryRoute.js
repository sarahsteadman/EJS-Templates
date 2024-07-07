// Needed Resources 
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/index")
const validation = require("../utilities/inventory-validation")


// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:id", utilities.handleErrors(invController.buildDetailsById));

router.get('/', utilities.checkAccountType, utilities.handleErrors(invController.buildManagement));

router.get('/addClassification', utilities.checkAccountType, utilities.handleErrors(invController.buildAddClassification));
router.post('/addClassification', utilities.checkAccountType, utilities.handleErrors(invController.addClassification));

router.get('/addInventory', utilities.checkAccountType, utilities.handleErrors(invController.buildAddInventory));
router.post('/addInventory', utilities.checkAccountType, validation.inventoryRules(), validation.checkAddData, utilities.handleErrors(invController.addInventory));
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

router.get('/edit/:id', utilities.checkAccountType, utilities.handleErrors(invController.editInventory));
router.post('/update/', utilities.checkAccountType, validation.inventoryRules(), validation.checkUpdateData, utilities.handleErrors(invController.updateInventory));

router.get('/delete/:id', utilities.checkAccountType, utilities.handleErrors(invController.buildDeleteInventory));
router.post('/delete/', utilities.checkAccountType, utilities.handleErrors(invController.deleteInventory));


module.exports = router;