const express = require("express");
const router = express();
const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// handling routes for /users

router.post("/signup", (req, res, next) => {
    bcrypt.hash(req.body.password, 10, (err, hashPass) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            const user = new User({
                _id: new mongoose.Types.ObjectId(),
                email: req.body.email,
                password: hashPass
            });
            user.save().then(result => {
                res.status(201).json({
                    message: "User created"
                });
            }).catch(err => {
                res.status(500).json({ error: err });
            });
        }
    });
});

router.post("/signin", (req, res, next) => {
    User.find({ email: req.body.email }).exec()
        .then(user => {
            if (user.length < 1) {
                res.status(404).json({ message: "Auth failed" });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(500).json({ message: "Auth failed" });
                }
                if (result) {
                    const token = jwt.sign({
                        email: user[0].email,
                        _id: user[0]._id
                    }, "ssshhh!randomSecrateString..", { expiresIn: "1h" });
                    return res.status(200).json({ message: "Auth Successful", token: token });
                }
                res.status(500).json({ message: "Auth failed" });
            });
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
});

router.delete("/:userId", (req, res, next) => {
    const id = req.params.userId;
    User.remove({ _id: id }).exec().then(result => {
        res.status(200).json({ message: "User deleted" });
    }).catch(err => {
        res.status(500).json({ error: err });
    });
});

module.exports = router;