const utilities = require("./index")
const accountModel = require("../models/account-model")
const messageModel = require("../models/message-model")

// const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/* ******************************
 * Message requirements for validation
 * ***************************** */
validate.messageRules = () => {
    return [
        body("message_to")
            .trim()
            .isInt()
            .withMessage("A valid recipient ID is required."),

        body("message_subject")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide a subject."),

        body("message_body")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 2 })
            .withMessage("Message body is required and must be at least 2 characters long.")
    ];
};

/* ******************************
 * Check data and return errors or continue to send message
 * ***************************** */
validate.checkMessage = async (req, res, next) => {
    const { message_to, message_subject, message_body } = req.body;
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log("Check Message errors occurred")
        console.log(errors)
        let nav = await utilities.getNav();
        let recipients = await messageModel.getRecipients();

        res.render("message/newMessage", {
            errors,
            title: "New Message",
            nav,
            recipients,
            message_to,
            message_subject,
            message_body
        });
        return;
    }
    next();
};

module.exports = validate;
