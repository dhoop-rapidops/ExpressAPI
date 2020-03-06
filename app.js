const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const products = require("./Api/routes/product");
const orders = require("./Api/routes/order")
const users = require("./Api/routes/user");

const MONGODB_LINK = 'mongodb+srv://dhoop:dhoop@cluster048-naiql.mongodb.net/test?retryWrites=true&w=majority';

mongoose.connect(MONGODB_LINK, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
})

const app = express();

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Accept, Origin, Authorization');
    if (req.method == "OPTIONS") {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, GET, DELETE');
        return res.status(200).json({});
    }
    next();
})

app.use("/products", products);
app.use("/orders", orders);
app.use("/users", users);

app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        error: {
            message: err.message
        }
    });
});

app.listen(3100);