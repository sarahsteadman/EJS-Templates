const { error } = require("console")
const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    let list = "<ul class='nav'>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
        list += "<li>"
        list +=
            '<a href="/inv/type/' +
            row.classification_id +
            '" title="See our inventory of ' +
            row.classification_name +
            ' vehicles">' +
            row.classification_name +
            "</a>"
        list += "</li>"
    })
    list += "</ul>"
    return list
}


/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function (data) {
    let grid
    if (data.length > 0) {
        grid = '<ul id="inv-display">'
        data.forEach(vehicle => {
            grid += '<li class="vehicles">'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id
                + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model
                + 'details"><img src="' + vehicle.inv_thumbnail
                + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model
                + ' on CSE Motors" /></a>'
            grid += '<div class="namePrice">'
            grid += '<hr />'
            grid += '<h2>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id + '" title="View '
                + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
                + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
            grid += '</h2>'
            grid += '<span>$'
                + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
            grid += '</div>'
            grid += '</li>'
        })
        grid += '</ul>'
    } else {
        grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
}

// Builds the HTML for the Car Details page
Util.buildCarDetails = async function (data) {
    let details
    if (data.inv_year != undefined) {
        details = '<div class="vehicle-display">'
        details += `<h3>${data.inv_year} ${data.inv_make} ${data.inv_model}</h3>`
        details += `<img src="${data.inv_image}" alt="${data.inv_year} ${data.inv_make} ${data.inv_model}">`
        details += `<section class="detail-section">`
        details += `<h2 class="details">${data.inv_make} ${data.inv_model} Details</h2>`
        details += `<p class="details"><b>Price: $${parseFloat(data.inv_price).toLocaleString('en-US')}</b></p>`
        details += `<p class="details"><b>Description:</b> ${data.inv_description}</p>`
        details += `<p class="details"><b>Color:</b> ${data.inv_color}</p>`
        details += `<p class="details"><b>Miles:</b> ${data.inv_miles.toLocaleString('en-US')}</p>`
        details += `</section >`

        details += '</div>'
    } else {
        details += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return details
}
// Builds list of classification inputs for creating a new vehicle item.
Util.buildClassificationList = async function (classification_id = null) {
    let data = await invModel.getClassifications()
    let classificationList =
        '<select name="classification_id" id="classificationList" required>'
    classificationList += "<option value=''>Choose a Classification</option>"
    data.rows.forEach((row) => {
        classificationList += '<option value="' + row.classification_id + '"'
        if (
            classification_id != null &&
            row.classification_id == classification_id
        ) {
            classificationList += " selected "
        }
        classificationList += ">" + row.classification_name + "</option>"
    })
    classificationList += "</select>"
    return classificationList
}

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
    if (req.cookies.jwt) {
        jwt.verify(
            req.cookies.jwt,
            process.env.ACCESS_TOKEN_SECRET,
            function (err, accountData) {
                if (err) {
                    req.flash("Please log in")
                    res.clearCookie("jwt")
                    return res.redirect("/account/login")
                }
                res.locals.accountData = accountData
                res.locals.loggedin = 1

                if (accountData.account_id < 4) {
                    res.locals.message = 1
                }
                next()
            })
    } else {
        next()
    }
}

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
    if (res.locals.loggedin) {
        next()
    } else {
        req.flash("notice", "Please log in.")
        return res.redirect("/account/login")
    }
}

/* ****************************************
 *  Check account
 * ************************************ */
Util.checkAccount = (req, res, next) => {
    console.log("check accounts called")
    if (!res.locals.loggedin) {
        req.flash("notice", "Please log in.");
        return res.redirect("/account/login");
    }
    console.log("you are logged in")
    console.log(res.locals.accountData.account_id)
    if (res.locals.accountData.account_id < 4) {
        next()
    } else {
        req.flash("notice", "Sorry, you do not have access to this feature.")
        return res.redirect("/")
    }
}

/* ****************************************
 *  Check Account Type
 * ************************************ */
Util.checkAccountType = (req, res, next) => {
    if (res.locals.accountData) {
        console.log(res.locals.accountData)
        if (res.locals.accountData == 'Admin' || 'Employee') {
            next()
        }
        else {
            throw new Error("Please log in to an Admin or Employee account to view this page");
        }
    }

    else {
        throw new Error("Please log in to an Admin or Employee account to view this page");
    }
}

// log out deletes logged in jwt cookie
/* ****************************************
* Middleware to check token validity
**************************************** */
Util.logout = (req, res, next) => {
    if (req.cookies.jwt) {
        res.clearCookie("jwt");
        res.locals.loggedin = 0;
        req.flash("notice", "You have logged out successfully.");
        next();
    } else {
        next();
    }
}

/* ****************************************
* Middleware For Handling Errors
* Wrap other function in this for 
* General Error Handling
**************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util;