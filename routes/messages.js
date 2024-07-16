// Needed Resources 
const express = require("express")
const router = new express.Router()
const messageController = require("../controllers/messageController")
const utilities = require("../utilities/index")
const validation = require("../utilities/message-validation")

router.get("/", utilities.checkAccount, utilities.handleErrors(messageController.buildInbox));
router.get("/message/:id", utilities.checkAccount, utilities.handleErrors(messageController.buildMessageDetails));
router.get("/newMessage", utilities.checkAccount, utilities.handleErrors(messageController.buildNewMessage));
router.post("/newMessage", validation.messageRules(), validation.checkMessage, utilities.handleErrors(messageController.sendMessage));



module.exports = router;