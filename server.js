const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');

// Initialize express
const app = express();

// Load environment variables from .env file
dotenv.config();

// Middleware to parse JSON requests
app.use(express.json());

// Create MySQL connection using credentials from .env
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Test database connection
connection.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Question 1: Retrieve all patients
app.get('/patients', (req, res) => {
  const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching patients:', err);
      res.status(500).send('Error fetching patients');
      return;
    }
    res.json(results);
  });
});

// Question 2: Retrieve all providers
app.get('/providers', (req, res) => {
  const query = 'SELECT first_name, last_name, specialty FROM providers';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching providers:', err);
      res.status(500).send('Error fetching providers');
      return;
    }
    res.json(results);
  });
});

// Question 3: Filter patients by first name
app.get('/patients/:firstName', (req, res) => {
  const { firstName } = req.params;
  const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?';
  connection.query(query, [firstName], (err, results) => {
    if (err) {
      console.error('Error fetching patients by first name:', err);
      res.status(500).send('Error fetching patients');
      return;
    }
    res.json(results);
  });
});

// Question 4: Retrieve providers by their specialty
app.get('/providers/specialty/:specialty', (req, res) => {
  const { specialty } = req.params;
  const query = 'SELECT first_name, last_name FROM providers WHERE specialty = ?';
  connection.query(query, [specialty], (err, results) => {
    if (err) {
      console.error('Error fetching providers by specialty:', err);
      res.status(500).send('Error fetching providers');
      return;
    }
    res.json(results);
  });
});

// Listen on the specified port
const PORT = 3306;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
