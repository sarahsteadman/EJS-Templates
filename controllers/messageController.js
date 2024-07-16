const utilities = require("../utilities/index")
const messageModel = require("../models/message-model")
require("dotenv").config()

const messageCont = {}

messageCont.buildInbox = async function (req, res, next) {
    try {
        let userId = res.locals.accountData.account_id
        let nav = await utilities.getNav()
        let inboxMessages = await messageModel.getInbox(userId)

        req.flash("notice", "")
        res.render("./message/inbox", {
            title: "Inbox",
            message: "",
            inboxMessages,
            nav,
            errors: null
        })
    } catch (error) {
        next(error)
    }
}

messageCont.buildMessageDetails = async function (req, res, next) {
    try {
        let id = req.params.id;
        let nav = await utilities.getNav()
        let messageDetails = await messageModel.getMessageById(id)
        console.log(messageDetails)

        req.flash("notice", "")
        res.render("./message/messageDetails", {
            title: messageDetails.message_subject,
            message: "",
            messageDetails,
            nav,
            errors: null
        })
    } catch (error) {
        next(error)
    }
}

messageCont.buildNewMessage = async function (req, res, next) {
    try {
        let nav = await utilities.getNav()
        let recipients = await messageModel.getRecipients()

        req.flash("notice", "")
        res.render("./message/newMessage", {
            title: "New Message",
            message: "",
            nav,
            recipients,
            errors: null
        })
    } catch (error) {
        next(error)
    }
}

messageCont.sendMessage = async function (req, res, next) {
    let nav = await utilities.getNav()

    const { message_subject, message_body, message_to } = req.body
    let message_from = res.locals.accountData.account_id
    let message_created = new Date().toISOString();

    console.log(message_subject)
    console.log(message_body)
    console.log(message_to)
    console.log(message_from)
    console.log(message_created)

    try {
        const regResult = await messageModel.saveMessage(
            message_subject,
            message_body,
            message_to,
            message_from,
            message_created
        )

        if (regResult) {
            let inboxMessages = await messageModel.getInbox()
            req.flash(
                "notice",
                `Message Sent`
            )
            res.status(201).render("./message/inbox", {
                title: "Inbox",
                message: "",
                inboxMessages,
                nav,
                errors: null
            })
        } else {
            console.log("error in newMessage")
            let recipients = await messageModel.getRecipients()

            req.flash("notice", "")
            res.render("./message/newMessage", {
                title: "New Message",
                message: "",
                nav,
                recipients,
                errors: null
            })
        }
    } catch (error) {
        next(error)
    }
}

module.exports = messageCont
