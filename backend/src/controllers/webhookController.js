const pool = require("../config/db");
const aiService = require("../services/aiService");
const whatsappService = require("../services/whatsappService");

exports.verifyWebhook = async (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (
    mode === "subscribe" &&
    token === process.env.META_VERIFY_TOKEN
  ) {
    console.log("Webhook Verified ✅");
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
};

exports.whatsappWebhook = async (req, res) => {

  try {
    console.log("WEBHOOK HIT");
    console.log(
      JSON.stringify(req.body, null, 2)
    );


    const entry = req.body.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;

    if (value?.messages) {
      const msg = value.messages[0];

      const from = msg.from;
      const text = msg.text?.body || "";

      console.log("WEBHOOK HIT");
      console.log("Incoming:", text);

      console.log("Message From:", from);
      console.log("Message:", text);

      // Customer check
      let customerResult = await pool.query(
        "SELECT * FROM customers WHERE phone = $1",
        [from]
      );

      let customerId;

      if (customerResult.rows.length === 0) {
        const newCustomer = await pool.query(
          `
      INSERT INTO customers
      (
        phone,
        name
      )
    VALUES
      (
        $1,
        $2
      )
      RETURNING id
      `,
          [from, from]
        );

        customerId = newCustomer.rows[0].id;
      } else {
        customerId = customerResult.rows[0].id;
      }

      // Conversation check
      let convResult = await pool.query(
        `
    SELECT *
      FROM conversations
    WHERE customer_number = $1
    ORDER BY updated_at DESC
    LIMIT 1
      `,
        [from]
      );

      let conversationId;

      if (convResult.rows.length === 0) {
        const conv = await pool.query(
          `
      INSERT INTO conversations
      (
        customer_number,
        last_message
      )
    VALUES
      (
        $1,
        $2
      )
      RETURNING id
      `,
          [from, text]
        );

        conversationId = conv.rows[0].id;
      } else {
        conversationId = convResult.rows[0].id;

        await pool.query(
          `
      UPDATE conversations
    SET
    last_message = $1,
      updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      `,
          [text, conversationId]
        );
      }

      // Save customer message
      await pool.query(
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
      (
        $1,
        $2,
        $3,
        $4,
        $5
      )
      `,
        [
          conversationId,
          "customer",
          text,
          "text",
          "received"
        ]
      );

      console.log("Message Saved ✅");

      // AI Reply
      const aiReply =
        await aiService.generateReply(
          "Nexzsoft Assistant",
          text
        );

      console.log("AI Reply:", aiReply);

      // Save AI reply
      await pool.query(
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
      (
        $1,
        $2,
        $3,
        $4,
        $5
      )
      `,
        [
          conversationId,
          "assistant",
          aiReply,
          "text",
          "sent"
        ]
      );

      // Send WhatsApp reply
      await whatsappService.sendMessage(
        from,
        aiReply
      );

      console.log("AI Reply Sent ✅");
    }

    res.sendStatus(200);


  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};
