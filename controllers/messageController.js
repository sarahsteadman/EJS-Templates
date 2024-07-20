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

messageCont.buildArchives = async function (req, res, next) {
    try {
        let userId = res.locals.accountData.account_id
        let nav = await utilities.getNav()
        let archiveMessages = await messageModel.getArchives(userId)

        req.flash("notice", "")
        res.render("./message/archives", {
            title: "Archives",
            message: "",
            archiveMessages,
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

        if (messageDetails.message_to == res.locals.accountData.account_id) {
            req.flash("notice", "");
            res.render("./message/messageDetails", {
                title: messageDetails.message_subject,
                message: "",
                messageDetails,
                nav,
                errors: null
            });
        } else {
            const error = new Error("You do not have access to this message");
            error.status = 403;
            next(error);
        }

    } catch (error) {
        next(error)
    }
}

messageCont.buildDeleteMessage = async function (req, res, next) {
    try {
        let id = req.params.id;
        let nav = await utilities.getNav()
        let messageDetails = await messageModel.getMessageById(id)

        if (messageDetails.message_to == res.locals.accountData.account_id) {
            req.flash("notice", "");
            res.render("./message/deleteMessage", {
                title: `Delete ${messageDetails.message_subject}`,
                message: "",
                messageDetails,
                nav,
                errors: null
            })
        } else {
            const error = new Error("You do not have access to this message");
            error.status = 403;
            next(error);
        }
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

messageCont.buildReply = async function (req, res, next) {
    let id = req.params.id;
    try {
        let nav = await utilities.getNav()
        let recipients = await messageModel.getRecipients()
        let messageDetails = await messageModel.getMessageById(id)

        let message_to = messageDetails.message_from
        let message_subject = "RE:" + messageDetails.message_subject
        let message_body = "\n\n\n\n\n---------------------------------Past Message------------------------------ \n" + messageDetails.message_body

        req.flash("notice", "")
        res.render("./message/newMessage", {
            title: "New Message",
            message: "",
            nav,
            recipients,
            message_to,
            message_subject,
            message_body,
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

    try {
        const saveResult = await messageModel.saveMessage(
            message_subject,
            message_body,
            message_to,
            message_from,
            message_created
        )

        if (saveResult) {
            let userId = res.locals.accountData.account_id
            let inboxMessages = await messageModel.getInbox(userId)
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

messageCont.deleteMessage = async function (req, res, next) {
    let nav = await utilities.getNav()

    let id = req.body.id
    console.log("id:" + id)

    try {
        const deleteResult = await messageModel.deleteMessage(id)
        console.log(`deletion results:` + deleteResult)
        if (deleteResult) {
            let userId = res.locals.accountData.account_id
            let inboxMessages = await messageModel.getInbox(userId)
            req.flash(
                "notice",
                `Message Deleted`
            )
            res.status(201).render("./message/inbox", {
                title: "Inbox",
                message: "",
                inboxMessages,
                nav,
                errors: null
            })
        } else {
            let messageDetails = await messageModel.getMessageById(id)

            req.flash("notice", "")
            res.render(`./message/deleteConf/${id}`, {
                title: `Delete ${messageDetails.message_subject}`,
                message: "",
                messageDetails,
                nav,
                errors: null
            })
        }
    } catch (error) {
        next(error)
    }
}

messageCont.archiveMessage = async function (req, res, next) {
    let nav = await utilities.getNav()

    let id = req.params.id;

    try {
        const archiveResult = await messageModel.archiveMessage(id)

        let messageDetails = await messageModel.getMessageById(id)
        console.log("Here are your message details" + messageDetails)

        if (archiveResult) {
            console.log('3')

            req.flash("notice", "Message Archived")
            res.render("./message/messageDetails", {
                title: messageDetails.message_subject,
                message: "",
                messageDetails,
                nav,
                errors: null
            })
        } else {
            console.log("error in archiveMessage")
            console.log('4')


            req.flash("notice", "")
            res.render("./message/messageDetails", {
                title: messageDetails.message_subject,
                message: "",
                messageDetails,
                nav,
                errors: null
            })
        }
    } catch (error) {
        console.log('5')
        console.log(error)
        next(error)
    }
}

messageCont.readMessage = async function (req, res, next) {
    let nav = await utilities.getNav()

    let id = req.params.id;

    try {
        const readResult = await messageModel.readMessage(id)

        let messageDetails = await messageModel.getMessageById(id)
        console.log("Here are your message details" + messageDetails)

        if (readResult) {
            req.flash("notice", "Message marked as read")
            res.render("./message/messageDetails", {
                title: messageDetails.message_subject,
                message: "",
                messageDetails,
                nav,
                errors: null
            })
        } else {
            console.log("error in readMessage")

            req.flash("notice", "")
            res.render("./message/messageDetails", {
                title: messageDetails.message_subject,
                message: "",
                messageDetails,
                nav,
                errors: null
            })
        }
    } catch (error) {
        console.log(error)
        next(error)
    }
}

module.exports = messageCont
