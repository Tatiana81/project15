const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  findUser, findAllUsers, updateUser, updateAvatar,
} = require('../controllers/users');

router.get('/:userId', celebrate({
  cookies: Joi.object().keys({
    jwt: Joi.string().length(172),
  }),
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
}), findUser);

router.get('/', celebrate({
  cookies: Joi.object().keys({
    jwt: Joi.string().length(172),
  }),
}), findAllUsers);

router.patch('/me', celebrate({
  cookies: Joi.object().keys({
    jwt: Joi.string().length(172),
  }),
  body: Joi.object().keys({
    name: Joi.string().required().alphanum().min(2)
      .max(30),
    about: Joi.string().required().alphanum().min(2)
      .max(30),
    avatar: Joi.string().required().uri(),
  }),
}), updateUser);

router.patch('/me/avatar', celebrate({
  cookies: Joi.object().keys({
    jwt: Joi.string().length(172),
  }),
  body: Joi.object().keys({
    avatar: Joi.string().required().uri(),
  }),
}), updateAvatar);

module.exports = router;
