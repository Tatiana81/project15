const express = require('express');
const { errors, celebrate, Joi } = require('celebrate');
const users = require('./users');
const cards = require('./cards');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-err');
const { createUser, login } = require('../controllers/users');

const { requestLogger, errorLogger } = require('../middlewares/logger');

const router = express.Router();

router
  .use(requestLogger)
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
  .use('/cards', celebrate({
    cookies: Joi.object().keys({
      jwt: Joi.string(),
    }).unknown(true),
  }), auth, cards)
  .use('/users', celebrate({
    cookies: Joi.object().keys({
      jwt: Joi.string(),
    }).unknown(true),
  }), auth, users)
  .get('/crash-test', (req, res, next) => {
    setTimeout(() => {
      next(new Error('Сервер сейчас упадёт'));
    }, 0);
  })
  .use('*', (req, res, next) => {
    next(new NotFoundError('Запрашиваемый ресурс не найден'));
  })
  .use(errorLogger)
  .use(errors())
  // eslint-disable-next-line no-unused-vars
  .use((err, req, res, next) => {
    const { statusCode = 500, message } = err;
    res
      .status(statusCode)
      .send({
        message: statusCode === 500
          ? 'На сервере произошла ошибка'
          : message,
      });
  });

module.exports = router;
