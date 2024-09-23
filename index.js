const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("Hello World! from expense tracker backend");
});
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})
