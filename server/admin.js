/* IMPORT STUFF */
const express = require("express");
const router = express.Router();
const path = require("path")

router.use(require("./lib/simpleAuth"))

router.use("/kasql", require("./../kasql/router"))

router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "import.html"))
})

module.exports = router;