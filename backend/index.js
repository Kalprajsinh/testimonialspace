const express = require("express")
const path = require("path");
const bodyParser = require("body-parser");  
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors({
    origin: "*"
}));

app.use("/", require(path.resolve(__dirname, "routes/router.js")));

app.listen(3001, () => {
    console.log("Server is running on port 3000");
});