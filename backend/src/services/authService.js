const pool = require("../config/db");
const bcrypt = require("bcrypt");



/* 
* Registers a new tenant in the system.
 */
exports.register = async (
  name,
  business_name,
  whatsapp_number,
  email,
  password
) => {

  // check existing email
  const existing = await pool.query(
    "SELECT id FROM users WHERE email = $1",
    [email]
  );

  if (existing.rows.length > 0) {
    throw new Error("Email already exists");
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // insert into DB
  const result = await pool.query(
    `INSERT INTO users 
  (name, business_name, whatsapp_number, email, password)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING id, created_at`,
    [name, business_name, whatsapp_number, email, hashedPassword]
  );

  return result.rows[0];
};


/*
* Authenticates a tenant using email and password.
*/
exports.login = async (email, password) => {
  const result = await pool.query(
    "SELECT id, password FROM users WHERE email = $1",
    [email]
  );

  if (result.rows.length === 0) {
    throw new Error("Invalid email or password");
  }

  const user = result.rows[0];
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  // In a real application, you would generate a JWT token here
  return { id: user.id };
};
