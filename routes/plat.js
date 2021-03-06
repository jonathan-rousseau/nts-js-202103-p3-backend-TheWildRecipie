/* eslint-disable camelcase */
const express = require('express');

const router = express.Router();

const pool = require('../config/mysql');

router.get('/', function (req, res) {
  pool.query(
    'SELECT * FROM recipie WHERE category_id=1',
    function (error, result) {
      if (error) {
        res.status(500).send(error);
      } else {
        res.status(200).json(result);
      }
    }
  );
});

router.get('/:id', (request, response) => {
  const { id } = request.params;
  pool.query('SELECT * FROM recipie WHERE id=?', [id], (error, result) => {
    if (error) {
      response.status(500).send(error);
    } else if (result.length > 0) {
      response.send(result[0]);
    } else {
      response.status(404).send('pas de recette pour cet id');
    }
  });
});

router.post('/', (request, response) => {
  const plat = request.body;
  pool.query(
    `INSERT INTO recipie (name,description,category_id,user_id) VALUES (?,?,?,?)`,
    [plat.name, plat.description, plat.category_id, plat.user_id],
    (error, result) => {
      if (error) {
        response.status(500).send(error);
      } else {
        response.status(201).send({ id: result.insertId, ...plat });
      }
    }
  );
});

router.put('/:id', (request, response) => {
  const recipiePropsToUpdate = request.body;
  const { id } = request.params;
  pool.query(
    'UPDATE recipie SET ? WHERE id = ?',
    [recipiePropsToUpdate, id],
    (error, results) => {
      if (error) {
        response.status(500).send(error);
      } else if (results.affectedRows > 0) {
        response.status(200).send(results);
      } else {
        response.sendStatus(404);
      }
    }
  );
});

router.delete('/:id', (request, response) => {
  const { id } = request.params;
  pool.query('DELETE FROM recipie WHERE id= ?', [id], (error, result) => {
    if (error) {
      response.status(500).send(error);
    } else if (result.affectedRows > 0) {
      response.status(200).send(result);
    } else {
      response.status(404).send({ message: 'formation not found' });
    }
  });
});

module.exports = router;
