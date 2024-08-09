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

// Get all trajets
router.get("/", (req, res) => {
    const SELECT_ALL_TRAJETS_QUERY = "SELECT trajet.trajet_id,trajet.train_id, date_trajet , gare_depart, gare_arrive, duree_trajet, heure_depart, heure_arrive, billet, numero_train, classe FROM trajet,train WHERE trajet.train_id=train.train_id;";

    db.query(
        SELECT_ALL_TRAJETS_QUERY,
        (err, data) => {
            if (err) {
                console.log(err);
                return res.json(err);
            }
            return res.json(data);
        }
    );
});

// Get trajet by id
router.get("/get/:id", (req, res) => {
    const id = req.params.id;
    const SELECT_ALL_TRAJETS_QUERY = "SELECT * FROM trajet WHERE trajet_id = ?";

    db.query(
        SELECT_ALL_TRAJETS_QUERY,
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

// Search trajet
router.post("/search", (req, res) => {
    const {depart,arrive,date} = req.body;
    const SELECT_ALL_TRAJETS_QUERY = "SELECT t.*, tr.numero_train, tr.capacite, tr.classe, (tr.capacite - IFNULL(SUM(r.nbr_place), 0)) AS places_disponibles FROM trajet t LEFT JOIN train tr ON t.train_id = tr.train_id LEFT JOIN reservation r ON t.trajet_id = r.trajet_id WHERE (t.gare_depart = ?) AND (t.gare_arrive = ?) AND (t.date_trajet = ?) GROUP BY t.trajet_id, tr.train_id;"
    // const SELECT_ALL_TRAJETS_QUERY = "SELECT trajet.trajet_id,trajet.train_id, date_trajet , gare_depart, gare_arrive, duree_trajet, heure_depart, heure_arrive, billet, numero_train, classe FROM trajet,train WHERE trajet.train_id=train.train_id AND gare_depart = ? AND gare_arrive = ? AND date_trajet = ? ";

    db.query(
        SELECT_ALL_TRAJETS_QUERY,
        [depart,arrive,date],
        (err, data) => {
            if (err) {
                console.log(err);
                return res.json(err);
            }
            return res.json(data);
        }
    );
});


// Add a new trajet
router.post("/create", (req, res) => {
    const { date_trajet, gare_depart, gare_arrive, duree_trajet, heure_depart, heure_arrive, billet, train_id } = req.body;

    const INSERT_TRAJET_QUERY = "INSERT INTO trajet (date_trajet , gare_depart, gare_arrive, duree_trajet, heure_depart, heure_arrive, billet,  train_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

    db.query(
        INSERT_TRAJET_QUERY,
        [ date_trajet, gare_depart, gare_arrive, duree_trajet, heure_depart, heure_arrive, billet, train_id],
        (err, data) => {
            if (err) {
                console.log(err);
                return res.json(err);
            }
            return res.json(data);
        }
    );
});

// Delete a trajet
router.delete("/delete/:id", (req, res) => {
    const id = req.params.id;

    const DELETE_TRAJET_QUERY = "DELETE FROM trajet WHERE trajet_id = ?";

    db.query(
        DELETE_TRAJET_QUERY,
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

// Update a trajet
router.patch("/edit/:id", (req, res) => {
    const id = req.params.id;
    const { date_trajet ,gare_depart, gare_arrive, duree_trajet, heure_depart, heure_arrive, billet, train_id } = req.body;

    const UPDATE_TRAJET_QUERY = "UPDATE trajet SET date_trajet = ? , gare_depart = ?, gare_arrive = ?, duree_trajet = ?, heure_depart = ?, heure_arrive = ?, billet = ?, train_id = ? WHERE trajet_id = ?";

    db.query(
        UPDATE_TRAJET_QUERY,
        [date_trajet,gare_depart, gare_arrive, duree_trajet, heure_depart, heure_arrive, billet , train_id, id],
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
