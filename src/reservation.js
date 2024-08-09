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

// Get all reservations
router.get("/", (req, res) => {
    const SELECT_ALL_RESERVATIONS_QUERY = "SELECT date_trajet , gare_depart, gare_arrive, duree_trajet, heure_depart, heure_arrive, billet, numero_train, classe, nbr_place, nom, telephone, email FROM trajet,train,reservation,utilisateur WHERE trajet.trajet_id=reservation.trajet_id AND trajet.train_id=train.train_id AND reservation.utilisateur_id=utilisateur.utilisateur_id";

    db.query(
        SELECT_ALL_RESERVATIONS_QUERY,
        (err, data) => {
            if (err) {
                console.log(err);
                return res.json(err);
            }
            return res.json(data);
        }
    );
});

// Get reservation by id
router.get("/get/:id", (req, res) => {
    const id = req.params.id;
    const SELECT_ALL_RESERVATIONS_QUERY = "SELECT * FROM reservation WHERE reservation_id = ?";

    db.query(
        SELECT_ALL_RESERVATIONS_QUERY,
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

// Get reservation by id
router.get("/billet/:id", (req, res) => {
    const id = req.params.id;
    const SELECT_ALL_RESERVATIONS_QUERY = "SELECT date_trajet , gare_depart, gare_arrive, duree_trajet, heure_depart, heure_arrive, billet, numero_train, classe, nbr_place, nom, telephone, email FROM trajet,train,reservation,utilisateur WHERE trajet.trajet_id=reservation.trajet_id AND trajet.train_id=train.train_id AND reservation.utilisateur_id=utilisateur.utilisateur_id AND reservation.utilisateur_id=?;";

    db.query(
        SELECT_ALL_RESERVATIONS_QUERY,
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


// Add a new reservation
router.post("/create", (req, res) => {
    const { date_reservation, nbr_place, utilisateur_id, trajet_id } = req.body;

    const INSERT_RESERVATION_QUERY = "INSERT INTO reservation (date_reservation, nbr_place, utilisateur_id, trajet_id) VALUES (?, ?, ?, ?)";

    db.query(
        INSERT_RESERVATION_QUERY,
        [date_reservation, nbr_place, utilisateur_id, trajet_id],
        (err, data) => {
            if (err) {
                console.log(err);
                return res.json(err);
            }
            return res.json(data);
        }
    );
});

// Delete a reservation
router.delete("/delete/:id", (req, res) => {
    const id = req.params.id;

    const DELETE_RESERVATION_QUERY = "DELETE FROM reservation WHERE reservation_id = ?";

    db.query(
        DELETE_RESERVATION_QUERY,
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

// Update a reservation
router.patch("/edit/:id", (req, res) => {
    const id = req.params.id;
    const { nom_client, email_client, telephone, date_reservation, trajet_id, place_id } = req.body;

    const UPDATE_RESERVATION_QUERY = "UPDATE reservation SET nom_client = ?, email_client = ?, telephone = ?, date_reservation = ?, trajet_id = ?, place_id = ? WHERE reservation_id = ?";

    db.query(
        UPDATE_RESERVATION_QUERY,
        [nom_client, email_client, telephone, date_reservation, trajet_id, place_id, id],
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