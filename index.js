const express = require("express")
const app = express();
const port = 3001;
const path = require("path")

const { Example, Situational } = require("./kasql/out/models")

app.use("/admin", require("./server/admin"))

app.use("/scripts", express.static("scripts"))

app.use("/api", require("./kasql/api"))

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "server", "public", "index.html"))
})

app.get("/old", async(req, res) => {
    const situationals = await Situational.query();
    const items = await Example.query().withGraphFetched("situationals")

    var html = "<h1>AI PAT</h1>";
    html += "<div>";
    for(let situational of situationals){
        html += "<button>"+situational.title+"</button>"
    }
    html += "</div>"
    html += "<div style='display: flex; flex-direction: row; flex-wrap: wrap; width: 100%;'>";
    for(let item of items){
        html += "<div style='width: 250px; height: 300px; border: 1px solid #000; margin: 10px; padding: 10px; overflow: auto;'>";
        html += "<b>"+item.title+"</b><br>"
        html += "<div>"
        for(let situational of item.situationals){
            html += "<span style='background: #eee; border-radius: 20px; width: auto; padding: 3px;'>"+situational.title+"</span>"
        }
        html += "</div>"
        html += item.description+"<br>";
        html += "</div>"
    }
    html += "</div>"
    res.send(html)
})

app.get("*", async(req, res) => {
    res.send("Not found")
})

app.listen(port, () => {
    console.log("Listening on port" + port)
})