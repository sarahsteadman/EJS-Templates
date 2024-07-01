// Needed Resources 
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/index")
const validation = require("../utilities/inventory-validation")


// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:id", utilities.handleErrors(invController.buildDetailsById));

router.get('/', invController.buildManagement);
router.get('/management', invController.buildManagement);


router.get('/addClassification', invController.buildAddClassification);
router.post('/addClassification', invController.addClassification);
router.get('/addInventory', invController.buildAddInventory);
router.post('/addInventory', validation.inventoryRules(), validation.checkAddData, invController.addInventory);
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

router.get('/edit/:id', invController.editInventory);
router.post('/update/', validation.inventoryRules(), validation.checkUpdateData, invController.updateInventory);

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