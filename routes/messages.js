// Needed Resources 
const express = require("express")
const router = new express.Router()
const messageController = require("../controllers/messageController")
const utilities = require("../utilities/index")
const validation = require("../utilities/message-validation")

router.get("/", utilities.checkAccount, utilities.handleErrors(messageController.buildInbox));
router.get("/message/:id", utilities.checkAccount, utilities.handleErrors(messageController.buildMessageDetails));
router.get("/newMessage", utilities.checkAccount, utilities.handleErrors(messageController.buildNewMessage));
router.post("/newMessage", utilities.checkAccount, validation.messageRules(), validation.checkMessage, utilities.handleErrors(messageController.sendMessage));
router.get("/reply/:id", utilities.checkAccount, utilities.handleErrors(messageController.buildReply));
router.get("/deleteConf/:id", utilities.checkAccount, utilities.handleErrors(messageController.buildDeleteMessage));
router.post("/deleteMessage", utilities.handleErrors(messageController.deleteMessage));
router.get("/archives", utilities.checkAccount, utilities.handleErrors(messageController.buildArchives));
router.get("/archiveMessage/:id", utilities.checkAccount, utilities.handleErrors(messageController.archiveMessage));
router.get("/readMessage/:id", utilities.checkAccount, utilities.handleErrors(messageController.readMessage));



module.exports = router;