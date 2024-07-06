const express = require('express');
const baseController = require('../controllers/baseController');
const router = express.Router();
const utilities = require("../utilities/index")

// Static Routes
// Set up "public" folder / subfolders for static files
router.use(express.static("public"));
router.get("/logout", utilities.logout, baseController.buildHome);
router.get("/error", utilities.handleErrors(baseController.itsAnError));
router.use("/css", express.static(__dirname + "public/css"));
router.use("/js", express.static(__dirname + "public/js"));
router.use("/images", express.static(__dirname + "public/images"));

module.exports = router;



