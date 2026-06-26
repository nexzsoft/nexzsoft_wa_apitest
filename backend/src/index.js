require("dotenv").config();

console.log("TOKEN =", process.env.META_ACCESS_TOKEN);
console.log("PHONE =", process.env.META_PHONE_NUMBER_ID);

const express = require("express");
const cors = require("cors");

const tenantRoutes = require("./routes/authRoutes");
const webhookRoutes = require("./routes/webhookRoutes");
const userRoutes = require("./routes/userRoutes");
const whatsappRoutes = require("./routes/whatsappRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    message: "Backend running 🚀",
  });
});

app.use("/api", tenantRoutes);
app.use("/api/users", userRoutes);
app.use("/webhook", webhookRoutes);
app.use("/api/whatsapp", whatsappRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});