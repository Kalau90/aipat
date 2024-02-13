const express = require("express")
const app = express();
const port = 3001;

app.get("*", async(req, res) => {
    res.send("HELLO MADS")
})

app.listen(port, () => {
    console.log("Listening on port" + port)
})