const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function (req, res) {
    const nav = await utilities.getNav()
    res.render("index", {
        title: "Home",
        nav,
        errors: null
    })
}
baseController.itsAnError = async function (req, res) {
    throw new Error("Oh no! It's an error! Everybody cry!!!");
}

module.exports = baseController