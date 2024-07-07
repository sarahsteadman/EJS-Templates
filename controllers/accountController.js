const utilities = require("../utilities/index")
const accountModel = require("../models/account-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const bcrypt = require('bcryptjs');

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
*  Deliver update account view
* *************************************** */
async function buildUpdateAccount(req, res, next) {
    console.log("buildUpdateAccount in controller")
    let nav = await utilities.getNav()

    res.render("account/update", {
        title: "Update Account",
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
    // Hash the password before storing
    let hashedPassword
    try {
        // regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error processing the registration.')
        res.status(500).render("account/register", {
            title: "Registration",
            nav,
            errors: null,
        })
    }
    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
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

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
    let nav = await utilities.getNav()

    const { account_email, account_password } = req.body
    const accountData = await accountModel.getAccountByEmail(account_email)
    if (!accountData) {
        req.flash("notice", "Please check your credentials and try again.")
        res.status(400).render("account/login", {
            title: "Login",
            nav,

            errors: null,
            account_email,
        })
        return
    }
    try {
        if (await bcrypt.compare(account_password, accountData.account_password)) {
            delete accountData.account_password
            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
            if (process.env.NODE_ENV === 'development') {
                res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
            } else {
                res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
            }
            return res.redirect("/account/")
        }
    } catch (error) {
        console.error("Error caught in catch block:", error);
        return new Error('Access Forbidden')
    }
}

async function accountManagement(req, res) {
    try {
        let nav = await utilities.getNav()

        req.flash("notice", "")
        res.render("./account/management", {
            title: "Account",
            message: "",
            nav,
            errors: null
        })
    } catch (error) {
        next(error)
    }
}

/* ****************************************
*  Update Account
* *************************************** */
async function updateAccount(req, res) {
    console.log("updateAccount in controller")
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_id } = req.body

    const updateResult = await accountModel.updateAccount(
        {
            account_firstname,
            account_lastname,
            account_email,
            account_id
        }
    )

    if (updateResult) {
        res.locals.accountData = {
            account_firstname,
            account_lastname,
            account_email,
            account_id
        }
        req.flash(
            "notice",
            `Your account information has been updated`
        )
        res.status(201).render("./account/management", {
            title: "Account",
            message: "",
            nav,
            errors: null
        })
    } else {
        req.flash("notice", "Sorry, the account update failed.")
        res.status(501).render("./account/management", {
            title: "Account",
            message: "",
            nav,
            errors: null
        })
    }

}

/* ****************************************
*  Update Password
* *************************************** */
async function updatePassword(req, res) {
    console.log("updatePassword in controller")

    let nav = await utilities.getNav()

    const { account_password, account_id } = req.body
    // Hash the password before storing
    let hashedPassword
    try {
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error processing the password')
        res.status(500).render("./account/management", {
            title: "Update Account",
            message: "",
            nav,
            errors: null
        })
    }
    const updateResult = await accountModel.updatePassword(
        { hashedPassword, account_id }
    )

    if (updateResult) {
        req.flash(
            "notice",
            `Your password has been updated!`
        )
        res.status(201).render("./account/management", {
            title: "Update Account",
            message: "",
            nav,
            errors: null
        })
    } else {
        req.flash("notice", "Sorry, the update failed.")
        res.status(501).render("./account/management", {
            title: "Update Account",
            message: "",
            nav,
            errors: null
        })
    }

}


module.exports = { buildLogin, buildRegistration, registerAccount, accountLogin, accountManagement, updateAccount, updatePassword, buildUpdateAccount }