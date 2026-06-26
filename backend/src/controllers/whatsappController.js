const db = require("../config/db");
const { sendMessage } =
    require("../services/whatsappService");

exports.sendWhatsAppMessage =
    async (req, res) => {

        console.log(
            "REQ BODY =",
            req.body
        );

        try {

            const {
                to,
                message,
                conversationId,
            } = req.body;

            console.log(
                "CONVERSATION ID =",
                conversationId
            );

            const result =
                await sendMessage(
                    to,
                    message
                );

            const insertResult =
                await db.query(
                    `
        INSERT INTO messages
        (
          conversation_id,
          sender,
          message,
          message_type,
          status
        )
        VALUES
        ($1,$2,$3,$4,$5)
        RETURNING *
        `,
                    [
                        conversationId,
                        "assistant",
                        message,
                        "text",
                        "sent"
                    ]
                );

            console.log(
                "INSERT RESULT =",
                insertResult.rows
            );

            res.json(result);

        } catch (error) {

            console.error(
                "SEND ERROR =",
                error
            );

            res.status(500).json({
                success: false
            });

        }

    };

const pool = require("../config/db");

exports.getCustomers = async (req, res) => {
    try {
        const result = await pool.query(
            `             SELECT *
            FROM customers
            ORDER BY id DESC
            `
        );


        res.json(result.rows);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }


};

exports.getConversations = async (req, res) => {
    try {
        const result = await pool.query(
            `             SELECT *
            FROM conversations
            ORDER BY updated_at DESC
            `
        );


        res.json(result.rows);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }


};

exports.getMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;


        const result = await pool.query(
            `
        SELECT *
        FROM messages
        WHERE conversation_id = $1
        ORDER BY created_at ASC
        `,
            [conversationId]
        );

        res.json(result.rows);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }


};
