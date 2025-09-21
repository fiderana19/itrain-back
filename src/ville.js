const express = require("express");
const router = express.Router();
const Connect = require("./db/connection");
const authMiddleware = require("./middleware/auth");
const authorize = require("./middleware/rbac");
const db = Connect;

// Get all ville
router.get("/all", (req, res) => {
  const SELECT_ALL_VILLE_QUERY = "SELECT * FROM ville";

  db.query(SELECT_ALL_VILLE_QUERY, (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    return res.json(data);
  });
});

// Get ville by id
router.get(
  "/get/:id",
  authMiddleware,
  authorize(["admin", "client"]),
  (req, res) => {
    const id = req.params.id;
    const SELECT_VILLE_BY_ID_QUERY = "SELECT * FROM ville WHERE code_ville = ?";

    db.query(SELECT_VILLE_BY_ID_QUERY, [id], (err, data) => {
      if (err) {
        console.log(err);
        return res.json(err);
      }
      return res.json(data);
    });
  },
);

// Add a new ville
router.post("/create", authMiddleware, authorize(["admin"]), (req, res) => {
  const { code_ville, nom_ville, photo_ville } = req.body;

  const INSERT_VILLE_QUERY =
    "INSERT INTO ville (code_ville, nom_ville, photo_ville) VALUES (? , ?, ?)";

  db.query(
    INSERT_VILLE_QUERY,
    [code_ville, nom_ville, photo_ville],
    (err, data) => {
      if (err) {
        console.log(err);
        return res.json(err);
      }
      return res.json(data);
    },
  );
});

// Delete a ville
router.delete(
  "/delete/:id",
  authMiddleware,
  authorize(["admin"]),
  (req, res) => {
    const id = req.params.id;

    const DELETE_VILLE_QUERY = "DELETE FROM ville WHERE code_ville = ?";

    db.query(DELETE_VILLE_QUERY, [id], (err, data) => {
      if (err) {
        console.log(err);
        return res.json(err);
      }
      return res.json(data);
    });
  },
);

// Update a ville
router.patch("/edit/:id", authMiddleware, authorize(["admin"]), (req, res) => {
  const id = req.params.id;
  const { nom_ville, photo_ville } = req.body;

  const UPDATE_VILLE_QUERY =
    "UPDATE ville SET nom_ville = ? , photo_ville = ? WHERE code_ville = ?";

  db.query(UPDATE_VILLE_QUERY, [nom_ville, photo_ville, id], (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    return res.json(data);
  });
});

module.exports = router;
