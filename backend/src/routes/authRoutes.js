// routes/tenantRoutes.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/authController");



/*

 Tenant registration endpoint
    Expected request body:
    {
      "name": "John Doe",
      "business_name": "John's Business",
      "whatsapp_number": "+1234567890",
      "email": "john.doe@example.com",
      "password": "securepassword"
    }

  Improvements:
    - Input validation: Ensure all required fields are present and valid (e.g., valid email format, password strength).
    - Error handling: Return appropriate error messages for missing/invalid fields or if the email is already registered.
    
    -validate the onbarding business details and whatsapp number with whatsapp api to ensure the number
*/
router.post("/register", controller.register);

/*
 Tenant login endpoint  
  Expected request body:
    {
      "email": "john.doe@example.com",
      "password": "securepassword"
    }

    Improvements:
    - Login using social media accounts (e.g., Google, Facebook) for easier access.
    - Implement rate limiting to prevent brute-force attacks on the login endpoint.
    - Implement JWT-based authentication to provide secure access tokens for authenticated users.
*/
router.post("/login", controller.login);

module.exports = router;