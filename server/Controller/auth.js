const Admin = require("../Model/Admin")
const User =  require("../Model/User")
const bcrypt = require('bcrypt');
const  {generateToken}  = require("../Utils/jwt");

var ObjectId = require('mongodb').ObjectId

exports.addAdmin = async (req, res, err) => {
    const { email, password } = req.body;
// console.log(email, password);

    try {
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds
 
        // Create a new Admin instance with the hashed password
        let admindata = new Admin({ email, password: hashedPassword });

        // Save the admin data
        admindata.save()
            .then((result) => {
                console.log(result);
                return res.status(200).json(result);
            })
            .catch((e) => {
                console.log(e);
                return res.status(500).json(e);
            });
    } catch (error) {
        return res.status(500).json(error);
    }
};
exports.adminLogin = async (req, res, err) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json("Please provide email or password.");
    }
  
    try {
      const admin = await Admin.findOne({ email });
  
      if (!admin) {
        return res.status(500).json("Invalid credentials or user not found.");
      }
  
      // Compare the input password with the hashed password stored in the database
      const passwordMatch = await bcrypt.compare(password, admin.password);
  
      if (passwordMatch) {
        // Passwords match - authentication successful
       const token = generateToken({ email: admin.email });
      console.log(token);
        // return res.status(200).json("Authentication successful.");
      } else {
        // Passwords do not match - authentication failed
        return res.status(401).json("Invalid credentials.");
      }
    } catch (error) {
      return res.status(500).json("Server error.");
    }
  };
