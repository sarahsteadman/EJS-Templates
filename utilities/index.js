const invModel = require("../models/inventory-model")
const Util = {}

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
    console.log(data.inv_year)
    if (data.inv_year != undefined) {
        details = '<div class="vehicle-display">'
        details += `<h3>${data.inv_year} ${data.inv_make} ${data.inv_model}</h3>`
        details += `<img src="${data.inv_image}" alt=${data.inv_year} ${data.inv_make} ${data.inv_model}">`
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

/* ****************************************
* Middleware For Handling Errors
* Wrap other function in this for 
* General Error Handling
**************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
module.exports = Util;