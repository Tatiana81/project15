const express = require('express');
const users = require('./users');
const cards = require('./cards');

const router = express.Router();

router
  .use('/cards', cards)
  .use('/users', users)
  .use('*', (req, res) => {
    res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
  });

module.exports = router;
