const router = require('express').Router();
const { errors, celebrate, Joi } = require('celebrate');
const { requestLogger, errorLogger } = require('../middlewares/logger');

const {
  findUser, findAllUsers, updateUser, updateAvatar,
} = require('../controllers/users');

router
  .use(requestLogger)
  .get('/:userId', celebrate({
    cookies: Joi.object().keys({
      jwt: Joi.string().length(172),
    }).unknown(true),
    params: Joi.object().keys({
      userId: Joi.string().alphanum().length(24),
    }),
  }), findUser)
  .get('/', celebrate({
    cookies: Joi.object().keys({
      jwt: Joi.string().length(172),
    }).unknown(true),
  }), findAllUsers)
  .patch('/me', celebrate({
    cookies: Joi.object().keys({
      jwt: Joi.string().length(172),
    }).unknown(true),
    body: Joi.object().keys({
      name: Joi.string().required().alphanum().min(2)
        .max(30),
      about: Joi.string().required().alphanum().min(2)
        .max(30),
      avatar: Joi.string().required().uri(),
    }),
  }), updateUser)
  .patch('/me/avatar', celebrate({
    cookies: Joi.object().keys({
      jwt: Joi.string().length(172),
    }).unknown(true),
    body: Joi.object().keys({
      avatar: Joi.string().required().uri(),
    }),
  }), updateAvatar)
  .use(errorLogger)
  .use(errors());

module.exports = router;
