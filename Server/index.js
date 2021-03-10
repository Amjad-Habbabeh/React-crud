const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('config_secret.json'));

const connection = mysql.createConnection(config);
const db = mysql.createPool(connection);

const app = express();
app.use(cors());

app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/insert', (req, res) => {
  const moviesName = req.body.moviesName;
  const moviesReview = req.body.moviesReview;
  const sqlInsert =
    'INSERT INTO movies_reviews(moviesName,moviesReview) VALUES(?,?)';
  db.query(sqlInsert, [moviesName, moviesReview], (err, result) => {
    console.log(result);
  });
});
app.get('/api/get', (req, res) => {
  const sqlSelect = 'SELECT * FROM movies_reviews';
  db.query(sqlSelect, (err, result) => {
    console.log(result);
    res.send(result);
  });
});
app.put('/api/update', (req, res) => {
  const moviesName = req.body.moviesName;
  const moviesReview = req.body.moviesReview;

  const sqlUpdate = `UPDATE movies_reviews SET moviesReview =? WHERE moviesName=?`;

  db.query(sqlUpdate, [moviesReview, moviesName], (err, result) => {
    console.log(moviesName, moviesReview);

    res.send(result);
    console.log(err);
  });
});
app.delete('/api/delete/:moviesName', (req, res) => {
  const name = req.params.moviesName;
  const sqlDelete = `DELETE FROM movies_reviews WHERE moviesName=?`;
  db.query(sqlDelete, name, (err, result) => {
    res.send(result);
  });
});

app.listen(3001, () => console.log('reunning on port 3001'));
