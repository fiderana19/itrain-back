const ACCESS_TOKEN = '1234'
const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config({ path: '../../.env' })
const jwt = require('jsonwebtoken');
router.use(express.json())
//Database connection
const db = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "",
    database : "reservation_train",
})
//User login
router.post("/login", async (req, res) => {
    const { email , motdepasse } = req.body;

    if(!email || !motdepasse) {
        return res.status(500).send({
            success: false,
            message: "Veuillez remplir tous les champs !"
        }) 
    }

    db.query(
        "SELECT * FROM utilisateur WHERE email = ? OR telephone = ? AND motdepasse = ?",
        [email ,email , motdepasse],
        (err, data) => {
            if(err) {
                console.log(err);
                return res.json(err);
            }
            if (data.length > 0 ) {
                const id = data[0].utilisateur_id;
                const isadmin = data[0].isadmin;
                const token = jwt.sign(id , ACCESS_TOKEN); 
                return res.send({ token , uid: id ,isadmin: isadmin  })
            }
            return res.status(401).send({
                success: false,
                message: "Mail ou mot de passe incorrect !"
            }) 
        }
    );
});
//User signing
router.post("/signin", async (req, res) => {
    const { nom, email,  motdepasse , telephone } = req.body;

    if( !nom || !email || !motdepasse) {
        return res.status(500).send({
            success: false,
            message: "Veuillez remplir tous les champs !"
        }) 
    }

    db.query(
        "INSERT INTO utilisateur(nom,email,telephone, motdepasse) VALUES (?,?,?,?)",
        [nom ,email, telephone, motdepasse],
        (err, data) => {
            if(err) {
                return res.status(404).send({
                success: false,
                message: "Erreur sur l'insertion !"
                }) 
            }
            return res.status(201).send({
                success: true,
                message: "Compte créé avec succès !"
            }) 
        }
    );
});
//Getting all user
router.get("/all", (req, res) => {
    res.json(user.filter(user => user.username !== req.body.username))
});
//Getting an user by id
router.get("/get/:id", async (req, res) => {
    const { id } = req.params;
    const autHeader = req.headers['authorization']
    const token = autHeader && autHeader.split(' ')[1]
    if (token === '') return res.sendStatus(401)

    jwt.verify(token, ACCESS_TOKEN , (err , user) => {
        if (err) return res.sendStatus(403)
        req.user = user

        db.query(
            "SELECT utilisateur_id, nom, email, telephone FROM utilisateur WHERE utilisateur_id = ?",
            [id],
            (err, data) => {
                if(err) {
                console.log(err);
                return res.json(err);
                }
            return res.json(data);
            }
        );
    })
});

// Deleting an user
router.delete("/delete/:id", async (req, res) => {
    const id = req.params.id;
    const autHeader = req.headers['authorization']
    const token = autHeader && autHeader.split(' ')[1]
    if (token === '') return res.sendStatus(401)

    jwt.verify(token, ACCESS_TOKEN , (err , user) => {
        if (err) return res.sendStatus(403)
        req.user = user

        db.query(
            "DELETE FROM utilisateur WHERE utilisateur_id = ?",
            [id],
            (err, data) => {
                if(err) {
                    console.log(err);
                    return res.json(err);
                }
                res.status(201).send({
                    success: true,
                    message: "Suppression reussie"
                })            
            }
        );
    })
});
//Updating an use
router.patch("/edit/:id", async (req, res) => {
    const id = req.params.id;
    const { email,  motdepasse } = req.body;
    const autHeader = req.headers['authorization']
    const token = autHeader && autHeader.split(' ')[1]
    if (token === '') return res.sendStatus(401)

    jwt.verify(token, ACCESS_TOKEN , (err , user) => {
        if (err) return res.sendStatus(403)
        req.user = user

        db.query(
            "UPDATE utilisateur SET email = ? , motdepasse = ? WHERE utilisateur_id = ?",
            [ email , motdepasse , id],
            (err, data) => {
                if(err) {
                    console.log(err);
                    return res.json(err);
                }
                res.status(201).send({
                    success: true,
                    message: "Modification reussie"
                })    
            }
        );
    })

});

module.exports = router;