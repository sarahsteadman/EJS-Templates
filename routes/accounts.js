// Needed Resources 
const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/index")
const regValidate = require('../utilities/account-validation')

router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.accountManagement));
router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.post("/login", regValidate.loginRules(), regValidate.checkLoginData, utilities.handleErrors(accountController.accountLogin))

router.get("/register", utilities.handleErrors(accountController.buildRegistration));
router.post("/register", regValidate.registrationRules(), regValidate.checkUpdateData, utilities.handleErrors(accountController.registerAccount)
)

router.get("/update", utilities.handleErrors(accountController.buildUpdateAccount));
router.post("/update", regValidate.updateAccountRules(), regValidate.checkUpdateData, utilities.handleErrors(accountController.updateAccount))
router.post("/update/password", regValidate.updatePassword(), utilities.handleErrors(accountController.updatePassword))


module.exports = router;