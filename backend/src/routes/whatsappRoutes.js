const express = require("express");
const router = express.Router();

const whatsappController =
    require("../controllers/whatsappController");

router.post(
    "/send-message",
    whatsappController.sendWhatsAppMessage
);

router.get(
    "/customers",
    whatsappController.getCustomers
);

router.get(
    "/conversations",
    whatsappController.getConversations
);

router.get(
    "/messages/:conversationId",
    whatsappController.getMessages
);

module.exports = router;
