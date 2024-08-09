const express = require('express');
const router = express.Router();
const mysql = require('mysql');

// Database connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "reservation_train",
});

// Get all trains
router.get("/", (req, res) => {
    const SELECT_ALL_TRAINS_QUERY = "SELECT * FROM train";

    db.query(
        SELECT_ALL_TRAINS_QUERY,
        (err, data) => {
            if (err) {
                console.log(err);
                return res.json(err);
            }
            return res.json(data);
        }
    );
});

// Get train by id
router.get("/get/:id", (req, res) => {
    const id = req.params.id;
    const SELECT_ALL_TRAINS_QUERY = "SELECT * FROM train WHERE train_id = ?";

    db.query(
        SELECT_ALL_TRAINS_QUERY,
        [id],
        (err, data) => {
            if (err) {
                console.log(err);
                return res.json(err);
            }
            return res.json(data);
        }
    );
});

// Add a new train
router.post("/create", (req, res) => {
    const { numero_train, capacite , classe } = req.body;

    const INSERT_TRAIN_QUERY = "INSERT INTO train (numero_train, capacite, classe) VALUES (? , ? , ?)";

    db.query(
        INSERT_TRAIN_QUERY,
        [numero_train, capacite , classe],
        (err, data) => {
            if (err) {
                console.log(err);
                return res.json(err);
            }
            return res.json(data);
        }
    );
});

// Delete a train
router.delete("/delete/:id", (req, res) => {
    const id = req.params.id;

    const DELETE_TRAIN_QUERY = "DELETE FROM train WHERE train_id = ?";

    db.query(
        DELETE_TRAIN_QUERY,
        [id],
        (err, data) => {
            if (err) {
                console.log(err);
                return res.json(err);
            }
            return res.json(data);
        }
    );
});

// Update a train
router.patch("/edit/:id", (req, res) => {
    const id = req.params.id;
    const { numero_train, capacite, classe } = req.body;

    const UPDATE_TRAIN_QUERY = "UPDATE train SET numero_train = ? , capacite = ? , classe = ? WHERE train_id = ?";

    db.query(
        UPDATE_TRAIN_QUERY,
        [numero_train, capacite, classe, id],
        (err, data) => {
            if (err) {
                console.log(err);
                return res.json(err);
            }
            return res.json(data);
        }
    );
});

module.exports = router;
