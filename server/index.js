const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

// Middleware
app.use(cors({
    origin: '*'
}));
app.use(express.json());

// Create Quiz Entry
app.post("/quiz", async (req, res) => {
    console.log("request recieved")
    try {
        const { player, question, correctAnswer, score } = req.body;
        const newQuiz = await pool.query(
            "INSERT INTO player (player, question, correctAnswer, score) VALUES ($1, $2, $3, $4) RETURNING *",
            [player, question, correctAnswer, score]
        );

        res.json(newQuiz.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// Get All Quiz Entries
app.get("/quiz", async (req, res) => {
    try {
        const allQuiz = await pool.query("SELECT * FROM player");
        res.json(allQuiz.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// Get Quiz Entry by ID
app.get("/quiz/:id", async (req, res) => {
    try {
        const { id } = req.query;
        console.log(id)
        const quiz = await pool.query("SELECT * FROM player WHERE player = $1", [id]);
        res.json(quiz.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// Update Quiz Entry
app.put("/quiz/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { player, question, correctAnswer, score } = req.body;
        const updateScore = await pool.query(
            "UPDATE player SET player = $1, question = $2, correctAnswer = $3, score = $4 WHERE player_id = $5",
            [player, question, correctAnswer, score, id]
        );
        res.json({ message: "Score updated!" }); // Sending JSON response
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

app.delete("/quiz/:player", async (req, res) => {
    try {
        const { player } = req.params; // Get the player's username from the URL parameter
        const deletePlayer = await pool.query("DELETE FROM player WHERE player = $1", [player]);
        res.json({ message: "Player deleted!" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// Start the Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server has started on port ${PORT}`);
});
