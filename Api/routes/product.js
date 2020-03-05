const express = require("express");
const router = express.Router();

const Product = require("../models/product");
const mongoose = require("mongoose");

// handling routes for /products

router.get("/", (req, res) => {

    Product.find().select('_id name price').exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        _id: doc._id,
                        name: doc.name,
                        price: doc.price,
                        request: {
                            type: "GET",
                            url: "http://127.0.0.1:3100/products/" + doc._id
                        }
                    }
                })
            };
            res.status(200).json(response);
        }).catch(err => {
            res.status(500).json({ error: err });
        });
});

router.post("/", (req, res) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    product.save().then(result => {
        res.status(201).json({
            message: "product created",
            productCreated: result
        });
    }).catch(err => {
        res.status(500).json({ error: err });
    });

});

router.get("/:productId", (req, res) => {
    Product.findById(req.params.productId).exec()
        .then(doc => {
            if (doc) {
                res.status(200).json(doc);
            } else {
                res.status(404).json({ message: "No valid entry found for provided ID" });
            }
        }).catch(err => {
            res.status(500).json({ error: err });
        });
});

router.patch("/:productId", (req, res) => {
    const id = req.params.productId;
    const updateops = {};
    for (const key in req.body) {
        updateops[key] = req.body[key];
    }
    Product.update({ _id: id }, { $set: updateops }).exec()
        .then(result => {
            res.status(200).json({
                message: "Product updated",
                request: {
                    type: "GET",
                    url: "http://127.0.0.1:3100/products/" + id
                }
            });
        }).catch(err => {
            res.status(500).json({ error: err });
        });
});


router.delete("/:productId", (req, res) => {
    const id = req.params.productId;
    Product.remove({ _id: id }).exec()
        .then(result => {
            res.status(200).json({
                message: "Product Deleted",
                request: {
                    type: "GET",
                    description: "Get All Products",
                    url: "http://127.0.0.1:3100/products/"
                }
            });
        }).catch(err => {
            res.status(500).json({ error: err });
        });
});

module.exports = router;