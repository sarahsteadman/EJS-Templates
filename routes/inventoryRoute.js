// Needed Resources 
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/index")
const validation = require("../utilities/inventory-validation")


// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:id", utilities.handleErrors(invController.buildDetailsById));

router.get('/', utilities.checkAccountType, invController.buildManagement);

router.get('/addClassification', utilities.checkAccountType, invController.buildAddClassification);
router.post('/addClassification', utilities.checkAccountType, invController.addClassification);

router.get('/addInventory', utilities.checkAccountType, invController.buildAddInventory);
router.post('/addInventory', utilities.checkAccountType, validation.inventoryRules(), validation.checkAddData, invController.addInventory);
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

router.get('/edit/:id', utilities.checkAccountType, invController.editInventory);
router.post('/update/', utilities.checkAccountType, validation.inventoryRules(), validation.checkUpdateData, invController.updateInventory);

router.get('/delete/:id', utilities.checkAccountType, invController.buildDeleteInventory);
router.post('/delete/', utilities.checkAccountType, invController.deleteInventory);

// // Route to build inventory by classification view
// router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
// router.get("/detail/:id", utilities.handleErrors(invController.buildDetailsById));

// router.get('/management', utilities.handleErrors(invController.buildManagement));
// router.get('/addClassification', utilities.handleErrors(invController.buildAddClassification));
// router.post('/addClassification', utilities.handleErrors(invController.addClassification));
// router.get('/addInventory', utilities.handleErrors(invController.buildAddInventory));
// router.post('/addInventory', utilities.handleErrors(invController.addInventory));

//router.get('/edit/:id', utilities.handleErrors(invController.editInventory));
//router.post('/update/', validation.checkUpdateData, utilities.handleErrors(invController.updateInventory));

module.exports = router;