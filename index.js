const express = require("express")
const app = express();
const port = 3001;
const path = require("path")

const db = require("./knexfile")
const knex = require("knex")(db)

const { Example, Situational } = require("./kasql/out/models")

app.use("/admin", require("./server/admin"))

app.use("/scripts", express.static("scripts"))

app.use("/api", require("./kasql/api"))

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "server", "public", "index.html"))
})

function getIntersection(arr1, arr2){
    return arr1.filter(value => arr2.includes(value));
}

app.get("/filterItems/examples", async(req, res) => {
    const { faculty, situational, complexity } = req.query;

    const faculty_item_ids = await knex("examplevsfaculty").where({ faculty_id: faculty }).select("example_id").then((rows) => {
        return rows.map((v) => {
            return v.example_id;
        })
    })
    const complexity_item_ids = await knex("examplevscomplexity").where({ complexity_id: complexity }).select("example_id").then((rows) => {
        return rows.map((v) => {
            return v.example_id;
        })
    })
    const situational_item_ids = await knex("examplesvssituationals").where({ situational_id: situational }).select("example_id").then((rows) => {
        return rows.map((v) => {
            return v.example_id;
        })
    })

    faculty_item_ids.concat(complexity_item_ids, situational_item_ids)
    
    const intersection1 = getIntersection(faculty_item_ids, complexity_item_ids);
    const intersection2 = getIntersection(intersection1, situational_item_ids);

    const items = await Example.query().whereIn("recid", intersection2);

    res.send(items)
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