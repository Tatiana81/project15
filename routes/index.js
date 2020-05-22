const express = require('express');
const { celebrate, Joi } = require('celebrate');
const users = require('./users');
const cards = require('./cards');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-err');
const { createUser, login } = require('../controllers/users');

const router = express.Router();

router
  .use('/cards', celebrate({
    cookies: Joi.object().keys({
      jwt: Joi.string().length(172),
    }),
  }), auth, cards)
  .use('/users', celebrate({
    cookies: Joi.object().keys({
      jwt: Joi.string().length(172),
    }),
  }), auth, users)
  .get('/crash-test', () => {
    throw new Error('Сервер сейчас упадёт');
  })
  .use('*', (req, res, next) => {
    next(new NotFoundError('Запрашиваемый ресурс не найден'));
  })
  .post('/signin', celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }), login)
  .post('/signup', celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
      avatar: Joi.string().required().uri(),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }), createUser)
  .use((err, req, res) => {
    if (!err.statusCode) res.status(500).send({ message: 'Ошибка сервера' });
    res.status(err.statusCode).send({ message: err.message });
  });

module.exports = router;
