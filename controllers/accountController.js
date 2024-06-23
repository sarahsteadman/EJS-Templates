const utilities = require("../utilities/index")
const accountModel = require("../models/account-model")
accountCont = {}

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    try {
        let nav = await utilities.getNav()
        req.flash("notice", "")
        res.render("./account/login", {
            title: "Login",
            message: "",
            nav,
            errors: null
        })
    } catch (error) {
        next(error)
    }
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegistration(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null
    })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {

    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )

    if (regResult) {
        req.flash(
            "notice",
            `Congratulations, you\'re registered ${account_firstname}. Please log in.`
        )
        res.status(201).render("account/login", {
            title: "Login",
            nav,
            errors: null
        })
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("account/register", {
            title: "Registration",
            nav,
            errors: null
        })
    }

}




module.exports = { buildLogin, buildRegistration, registerAccount }