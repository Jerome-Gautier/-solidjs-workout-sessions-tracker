const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port = 8080;

const path ="./workoutsTable.json";


app.get("/", (req, res) => {
    if (!fs.existsSync(path)) fs.writeFileSync(path, JSON.stringify({}));
    let data = fs.readFileSync(path);
    data = JSON.parse(data);
    res.json(data);
});

app.post("/save_calendar", (req, res) => {
    let data = req.body.obj;

    fs.writeFile(path, JSON.stringify(data), (err) => {
        if (err) {
            res.json({ status: "Something went wrong while updating the Json." });
        } else {
            res.json({ status: "ok" });
        }
    });
});

app.listen(port, (error) => {
    if (error) {
        console.log("Something went wrong", error);
    } else {
        console.log("Server is listening on port: " + port);
    }
});