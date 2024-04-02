const express = require("express")
const app = express();
const port = 3001;
const path = require("path")

const db = require("./knexfile")
const knex = require("knex")(db)

/* Init matomo to track */
/*var MatomoTracker = require('matomo-tracker');
var matomo = new MatomoTracker(1, 'http://mywebsite.com/matomo.php');

// Optional: Respond to tracking errors
matomo.on('error', function(err) {
    console.log('error tracking request: ', err);
});

app.use((req, res, next) => {
    console.log("LOL", req.url)
    matomo.track({
        url: req.url,
        cvar: JSON.stringify({ ... req.query })
    });
    next();
})*/

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

app.get("*", async(req, res) => {
    res.send("Not found")
})

app.listen(port, () => {
    console.log("Server is listening on http://localhost:" + port)
})