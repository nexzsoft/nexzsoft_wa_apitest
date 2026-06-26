const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const bcrypt = require("bcrypt");

// GET USER
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `
      SELECT
        id,
        name,
        business_name,
        whatsapp_number,
        email
      FROM users
      WHERE id = $1
      `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server Error",
        });
    }
});

// UPDATE USER
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const {
            name,
            business_name,
            whatsapp_number,
            email,
        } = req.body;

        const result = await pool.query(
            `
      UPDATE users
      SET
        name = $1,
        business_name = $2,
        whatsapp_number = $3,
        email = $4
      WHERE id = $5
      RETURNING *
      `,
            [
                name,
                business_name,
                whatsapp_number,
                email,
                id,
            ]
        );

        res.json({
            message: "Profile updated successfully",
            data: result.rows[0],
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server Error",
        });
    }
});

// CHANGE PASSWORD
router.put("/:id/password", async (req, res) => {
    try {
        const { id } = req.params;

        const {
            currentPassword,
            newPassword,
        } = req.body;

        const userResult = await pool.query(
            `
      SELECT password
      FROM users
      WHERE id = $1
      `,
            [id]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const isMatch = await bcrypt.compare(
            currentPassword,
            userResult.rows[0].password
        );

        if (!isMatch) {
            return res.status(400).json({
                message:
                    "Current password incorrect",
            });
        }

        const hashedPassword =
            await bcrypt.hash(newPassword, 10);

        await pool.query(
            `
      UPDATE users
      SET password = $1
      WHERE id = $2
      `,
            [hashedPassword, id]
        );

        res.json({
            message:
                "Password updated successfully",
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server Error",
        });
    }
});

module.exports = router;