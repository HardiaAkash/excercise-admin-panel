const express = require("express")
const { addAdmin, adminLogin } = require("../Controller/auth")
const router = express.Router()

router.route("/addAdmin").post(addAdmin)
router.route("/adminlogin").post(adminLogin)

module.exports = router;
