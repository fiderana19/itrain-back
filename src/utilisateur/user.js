const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const authorize = require("../middleware/rbac");
const Connect = require("../db/connection");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const db = Connect;
router.use(express.json());

//User login
router.post("/login", async (req, res) => {
  const { email, motdepasse } = req.body;

  if (!email || !motdepasse) {
    return res.status(500).send({
      message: "Veuillez remplir tous les champs !",
    });
  }

  const LOGIN_QUERY = "SELECT * FROM utilisateur WHERE email = ?"

  db.query(LOGIN_QUERY, email, async (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }

    const role = data[0].role;
    const user = await data[0]; 
    const pwd = await data[0].motdepasse;
    const isMatched = await bcrypt.compare(motdepasse , pwd);
        
    if(isMatched === true) {
      const payload = { id: user.utilisateur_id, username: user.nom, role };

      const token = await jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET)
      return res.status(200).send({ token: token});           
    } else {
      return res.status(401).send({ message: "Mot de passe incorrect !"});
    }    
  });
});
//User signup
router.post("/signup", async (req, res) => {
  const { nom, email, motdepasse, telephone } = req.body;

  if (!nom || !email || !motdepasse) {
    return res.status(500).send({
      message: "Veuillez remplir tous les champs !",
    });
  }

  const hashedPassword = await bcrypt.hash(motdepasse, 10);

  db.query(
    "INSERT INTO utilisateur(nom,email,telephone, motdepasse) VALUES (?,?,?,?)",
    [nom, email, telephone, hashedPassword],
    (err, data) => {
      if (err) {
        return res.status(404).send({
          message: "Erreur sur l'insertion !",
        });
      }
      return res.status(201).send({
        message: "Compte créé avec succès !",
      });
    },
  );
});
//Getting all user
router.get("/all", (req, res) => {
  res.json(user.filter((user) => user.username !== req.body.username));
});

//Getting an user by id
router.get(
  "/get/:id",
  authMiddleware,
  authorize(["admin", "client"]),
  async (req, res) => {
    const id = req.params.id;

    db.query(
      "SELECT utilisateur_id, nom, email, telephone FROM utilisateur WHERE utilisateur_id = ?",
      [id],
      (err, data) => {
        if (err) {
          console.log(err);
          return res.json(err);
        }
        return res.json(data);
      },
    );
  },
);

// Deleting an user
router.delete(
  "/delete/:id",
  authMiddleware,
  authorize(["admin", "client"]),
  async (req, res) => {
    const id = req.params.id;
    db.query(
      "DELETE FROM utilisateur WHERE utilisateur_id = ?",
      [id],
      (err, data) => {
        if (err) {
          console.log(err);
          return res.json(err);
        }
        res.status(201).send({
          message: "Suppression reussie",
        });
      },
    );
  },
);
//Updating an use
router.patch(
  "/edit/:id",
  authMiddleware,
  authorize(["admin", "client"]),
  async (req, res) => {
    const id = req.params.id;
    const { email, motdepasse } = req.body;
    db.query(
      "UPDATE utilisateur SET email = ? , motdepasse = ? WHERE utilisateur_id = ?",
      [email, motdepasse, id],
      (err, data) => {
        if (err) {
          console.log(err);
          return res.json(err);
        }
        res.status(201).send({
          message: "Modification reussie",
        });
      },
    );
  },
);

module.exports = router;
