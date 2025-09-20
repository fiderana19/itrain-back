const mysql = require('mysql');

const Connect = () => {
    try {
        const db = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
        });
        return db;
    } catch (error) {
        console.log("Erreur de la connexion vers la base de données !")
    }
}

module.exports = Connect();