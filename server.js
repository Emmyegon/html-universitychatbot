// server.js

const express = require('express');
const bodyParser = require('body-parser');
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');

const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(bodyParser.json());

let db;

// Connect to SQLite database
async function connectToDatabase() {
    db = await open({
        filename: 'university_bot.db',
        driver: sqlite3.Database
    });
}

// Initialize the database connection
connectToDatabase();

// Endpoint to handle user details
app.post('/user-details', async (req, res) => {
    const userDetails = req.body;

    try {
        // Insert user details into the database
        await db.run(`
            INSERT INTO UserDetails (name, studentId, faculty, medicalNumber, date)
            VALUES (?, ?, ?, ?, ?)
        `, userDetails.name, userDetails.studentId, userDetails.faculty, userDetails.medicalNumber, userDetails.date);

        res.status(200).json({ message: 'User details inserted successfully.' });
    } catch (error) {
        console.error('Error inserting user details:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
