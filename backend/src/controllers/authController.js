const authService = require("../services/authService");

/*
* Handles tenant registration requests.
*/
exports.register = async (req, res) => {
  try {
    console.log("REGISTER HIT:", req.body);

    const {
      name,
      business_name,
      whatsapp_number,
      email,
      password
    } = req.body;

    const user = await authService.register(
      name,
      business_name,
      whatsapp_number,
      email,
      password
    );

    res.status(201).json({
      message: "User registered successfully",
      data: user
        
    });
  } catch (err) {

    // Handle specific error for existing email
    if(err.message === "Email already exists") {
      console.error(err.message); 
      return res.status(400).json({ error: err.message });
    }

    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
};


/** Handles tenant login requests.
*/
exports.login = async (req, res) => {
  try {
     console.log("LOGIN HIT:", req.body);

    const { email, password } = req.body;

    const authResult = await authService.login(email, password);

    res.status(200).json({
      message: "User logged in successfully",
      data: authResult
    });

  } catch (err) {

    if(err.message === "Invalid email or password") {
      console.error(err.message); 
      return res.status(401).json({ error: err.message });
    }
    
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
  
};