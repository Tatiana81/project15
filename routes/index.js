const express = require('express');
const users = require('./users');
const cards = require('./cards');
const auth = require('../middlewares/auth');

const router = express.Router();

router
  .use('/cards', auth, cards)
  .use('/users', auth, users)
  .use('*', (req, res) => {
    res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
  });

module.exports = router;
