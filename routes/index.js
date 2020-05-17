const express = require('express');
const users = require('./users');
const cards = require('./cards');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-err');

const router = express.Router();

router
  .use('/cards', auth, cards)
  .use('/users', auth, users)
  .use('*', (req, res, next) => {
    next(new NotFoundError('Запрашиваемый ресурс не найден'));
  });

module.exports = router;
