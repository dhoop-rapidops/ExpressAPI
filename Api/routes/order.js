const express = require("express");
const router = express();
const mongoose = require("mongoose");
const Order = require("../models/order");
const Product = require("../models/product");
const checkAuth = require("../middleware/checkAuth");

// handling routes for /orders

router.get("/", checkAuth, (req, res) => {
    Order.find().select("_id productId quantity").populate("productId", "name price").exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        productId: doc.productId,
                        quantity: doc.quantity,
                        request: {
                            type: "GET",
                            url: "http://127.0.0.1:3100/orders/" + doc._id
                        }
                    }
                })
            });
        }).catch(err => {
            res.status(500).json({ error: err });
        });
});

router.post("/", (req, res) => {

    Product.findById(req.body.productId).exec()
        .then(result => {
            if (!result) {
                return res.status(404).json({ message: "Product Not Found" });
            }
            const order = new Order({
                _id: new mongoose.Types.ObjectId(),
                productId: req.body.productId,
                quantity: req.body.quantity
            });
            return order.save();
        }).then(result => {
            res.status(201).json({
                message: "Order created",
                result: result
            });
        }).catch(err => {
            res.status(500).json({ message: "Product Not Found", error: err });
        });
});

router.get("/:orderId", (req, res) => {
    Order.findById(req.params.orderId).populate("productId", "name price").exec()
        .then(result => {
            res.status(200).json({
                order: result,
                request: {
                    type: "GET",
                    url: "http://127.0.0.1:3100/orders/"
                }
            });
        }).catch(err => {
            res.status(500).json({ error: err });
        });
});

router.delete("/:orderId", (req, res) => {
    Order.remove({ _id: req.params.orderId }).exec()
        .then(result => {
            res.status(200).json({
                message: "Order Deleted",
                result: result
            });
        }).catch(err => {
            res.status(500).json({ error: err });
        });
});

module.exports = router;