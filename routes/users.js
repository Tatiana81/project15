const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  findUser, findAllUsers, updateUser, updateAvatar,
} = require('../controllers/users');

router
  .use('*', celebrate({
    cookies: Joi.object().keys({
      jwt: Joi.string(),
    }).unknown(true),
  }))
  .get('/:userId', celebrate({
    params: Joi.object().keys({
      userId: Joi.string().alphanum().length(24),
    }),
  }), findUser)
  .get('/', findAllUsers)
  .patch('/me', celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2)
        .max(30),
      about: Joi.string().required().min(2)
        .max(30),
    }),
  }), updateUser)
  .patch('/me/avatar', celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required().uri(),
    }),
  }), updateAvatar);

module.exports = router;
