const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const setRoute = require("./router");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
        extended: true
    })
);

const PORT = process.env.PORT || 8989;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
    setRoute(app);
});