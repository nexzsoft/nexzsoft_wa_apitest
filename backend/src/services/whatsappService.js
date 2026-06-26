const axios = require("axios");

exports.sendMessage = async (to, message) => {
    const response = await axios.post(
        `https://graph.facebook.com/v23.0/${process.env.META_PHONE_NUMBER_ID}/messages`,
        {
            messaging_product: "whatsapp",
            to,
            type: "text",
            text: {
                body: message
            }
        },
        {
            headers: {
                Authorization: `Bearer ${process.env.META_ACCESS_TOKEN}`,
                "Content-Type": "application/json"
            }
        }
    );

    return response.data;
};
